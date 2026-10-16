import { SuperLinea } from '../entities/super-linea.entity';
import { CreateSuperLineaDto } from '../../dto/create-super-linea.dto';
import { UpdateSuperLineaDto } from '../../dto/update-super-linea.dto';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';

export interface ISuperLineaRepository {
  create(data: CreateSuperLineaDto): Promise<SuperLinea>;
  update(id: number, data: UpdateSuperLineaDto): Promise<SuperLinea>;
  findOne(id: number): Promise<SuperLinea | null>;
  findByDenominacion(denominacion: string): Promise<SuperLinea | null>;
  findByDenominacionWith(denominacion: string): Promise<SuperLinea | null>;
  findBy(
    denominacion: string,
    skip: number,
    take: number,
    incluirEliminados: boolean,
  ): Promise<{ data: SuperLinea[]; total: number }>;
  hasActiveLines(superLineaId: number): Promise<boolean>;
  remove(entity: SuperLinea, usuario: Usuario): Promise<SuperLinea>;
}
