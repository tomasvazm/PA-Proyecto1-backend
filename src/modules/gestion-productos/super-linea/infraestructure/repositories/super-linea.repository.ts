import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { Linea } from '../../../linea/domain/entities/linea.entity';
import { CreateSuperLineaDto } from '../../dto/create-super-linea.dto';
import { UpdateSuperLineaDto } from '../../dto/update-super-linea.dto';
import { SuperLinea } from '../../domain/entities/super-linea.entity';
import { ISuperLineaRepository } from '../../domain/interfaces/super-linea.repository.interface';

@Injectable()
export class SuperLineaRepository implements ISuperLineaRepository {
  constructor(
    @InjectRepository(SuperLinea)
    private readonly repository: Repository<SuperLinea>,
    @InjectRepository(Linea)
    private readonly lineaRepository: Repository<Linea>,
  ) {}

  async create(data: CreateSuperLineaDto): Promise<SuperLinea> {
    return this.repository.save(this.repository.create(data));
  }

  async update(id: number, data: UpdateSuperLineaDto): Promise<SuperLinea> {
    const entity = await this.findOne(id);
    if (!entity) {
      throw new NotFoundException(`SuperLínea con ID ${id} no encontrada.`);
    }
    entity.denominacion = data.denominacion ?? entity.denominacion;
    if (data.observacion !== undefined) {
      entity.observacion = data.observacion;
    }
    entity.usuarioUpdatedId = data.usuarioUpdatedId;
    return this.repository.save(entity);
  }

  async findOne(id: number): Promise<SuperLinea | null> {
    return this.repository.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async findByDenominacion(
    denominacion: string,
  ): Promise<SuperLinea | null> {
    return this.repository.findOne({
      where: { denominacion, deletedAt: IsNull() },
    });
  }

  async findByDenominacionWith(
    denominacion: string,
  ): Promise<SuperLinea | null> {
    return this.repository
      .createQueryBuilder('superLinea')
      .withDeleted()
      .where('UPPER(superLinea.denominacion) = :denominacion', {
        denominacion: denominacion.trim().toUpperCase(),
      })
      .getOne();
  }

  async findBy(
    denominacion: string,
    skip: number,
    take: number,
    incluirEliminados: boolean,
  ): Promise<{ data: SuperLinea[]; total: number }> {
    const query = this.repository.createQueryBuilder('superLinea');
    if (!incluirEliminados) {
      query.andWhere('superLinea.deletedAt IS NULL');
    } else {
      query.withDeleted();
    }
    if (denominacion.trim()) {
      query.andWhere('UPPER(superLinea.denominacion) LIKE :denominacion', {
        denominacion: `%${denominacion.trim().toUpperCase()}%`,
      });
    }
    const [data, total] = await query
      .orderBy('superLinea.denominacion', 'ASC')
      .skip(skip)
      .take(take)
      .getManyAndCount();
    return { data, total };
  }

  async hasActiveLines(superLineaId: number): Promise<boolean> {
    return this.lineaRepository.exists({
      where: { superLinea: { id: superLineaId }, deletedAt: IsNull() },
    });
  }

  async remove(entity: SuperLinea, usuario: Usuario): Promise<SuperLinea> {
    entity.deletedAt = new Date();
    entity.usuarioDeletedId = usuario.id;
    return this.repository.save(entity);
  }
}
