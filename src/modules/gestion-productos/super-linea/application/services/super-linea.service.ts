import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ensureNotSistemaEntity } from 'src/modules/common/utils/atrituto-sistema';
import { MessageFrontUtils } from 'src/modules/common/utils/message/message-front.util';
import { UsuarioService } from 'src/modules/gestion-usuario/usuario/application/services/usuario.service';
import { ISuperLineaRepository } from '../../domain/interfaces/super-linea.repository.interface';
import { CreateSuperLineaDto } from '../../dto/create-super-linea.dto';
import { SuperLineaDto } from '../../dto/super-linea.dto';
import { UpdateSuperLineaDto } from '../../dto/update-super-linea.dto';
import { SuperLineaMapper } from '../../mappers/super-linea.mapper';

@Injectable()
export class SuperLineaService {
  private readonly logger = new Logger(SuperLineaService.name);

  constructor(
    @Inject('ISuperLineaRepository')
    private readonly repository: ISuperLineaRepository,
    private readonly usuarioService: UsuarioService,
  ) {}

  async create(dto: CreateSuperLineaDto) {
    await this.checkDenominacionExists(dto.denominacion, 0);
    const entity = await this.repository.create(dto);
    return MessageFrontUtils.createSimple(
      'SuperLínea',
      entity.denominacion,
      'creada',
    );
  }

  async update(id: number, dto: UpdateSuperLineaDto) {
    const entity = await this.findEntityById(id);
    ensureNotSistemaEntity(entity, 'SuperLínea');
    if (dto.denominacion) {
      await this.checkDenominacionExists(dto.denominacion, id);
    }
    const updated = await this.repository.update(id, dto);
    return MessageFrontUtils.createSimple(
      'SuperLínea',
      updated.denominacion,
      'editada',
    );
  }

  async findBy(
    denominacion: string,
    skip: number,
    take: number,
    incluirEliminados: boolean,
  ): Promise<{ data: SuperLineaDto[]; total: number }> {
    const result = await this.repository.findBy(
      denominacion,
      skip,
      take,
      incluirEliminados,
    );
    return {
      data: result.data.map(SuperLineaMapper.toDto),
      total: result.total,
    };
  }

  async findDtoById(id: number): Promise<SuperLineaDto> {
    return SuperLineaMapper.toDto(await this.findEntityById(id));
  }

  async findEntityById(id: number) {
    const entity = await this.repository.findOne(id);
    if (!entity) {
      throw new NotFoundException(`SuperLínea con ID ${id} no encontrado.`);
    }
    return entity;
  }

  async remove(id: number, usuarioId: number) {
    const entity = await this.findEntityById(id);
    ensureNotSistemaEntity(entity, 'SuperLínea');
    if (await this.repository.hasActiveLines(id)) {
      throw new ConflictException(
        'No se puede eliminar la SuperLínea mientras tenga líneas activas asociadas. Reasígnelas o desvincúlelas primero.',
      );
    }
    const usuario = await this.usuarioService.findOne(usuarioId);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado.`);
    }
    await this.repository.remove(entity, usuario);
    return MessageFrontUtils.createSimple(
      'SuperLínea',
      entity.denominacion,
      'eliminada',
    );
  }

  private async checkDenominacionExists(
    denominacion: string,
    id: number,
  ): Promise<void> {
    const exists = await this.repository.findByDenominacionWith(denominacion);
    if (exists && exists.id !== id) {
      this.logger.warn(
        `SuperLínea con denominación duplicada: ${denominacion}`,
      );
      throw new ConflictException('Denominación de SuperLínea ya en uso.');
    }
  }
}
