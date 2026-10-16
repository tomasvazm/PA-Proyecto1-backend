import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty } from 'class-validator';
import { CreateSuperLineaDto } from './create-super-linea.dto';

export class UpdateSuperLineaDto extends PartialType(CreateSuperLineaDto) {
  @IsNotEmpty({ message: 'El usuarioUpdatedId es obligatorio.' })
  @IsInt({ message: 'El usuarioUpdatedId debe ser un número entero.' })
  usuarioUpdatedId: number;
}
