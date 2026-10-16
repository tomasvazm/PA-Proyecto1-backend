import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { SuperLinea } from 'src/modules/gestion-productos/super-linea/domain/entities/super-linea.entity';

@Injectable()
export class LineaSuperLineaValidator {
  constructor(
    @InjectRepository(SuperLinea)
    private readonly repository: Repository<SuperLinea>,
  ) {}

  async validate(
    superLineaId: number | null | undefined,
  ): Promise<SuperLinea | null> {
    if (superLineaId == null) {
      return null;
    }

    const superLinea = await this.repository.findOne({
      where: { id: superLineaId, deletedAt: IsNull() },
    });
    if (!superLinea) {
      throw new NotFoundException(
        `SuperLínea con ID ${superLineaId} no encontrada o eliminada.`,
      );
    }

    return superLinea;
  }
}
