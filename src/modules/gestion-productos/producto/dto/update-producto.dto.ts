import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { CreateProductoDto } from './create-producto.dto';

export class UpdateProductoDto extends PartialType(CreateProductoDto) {
  @IsNotEmpty({ message: 'El usuarioUpdatedId es obligatorio.' })
  @IsInt({ message: 'El usuarioUpdatedId debe ser un número entero.' })
  usuarioUpdatedId: number;

  @ApiPropertyOptional({
    maxLength: 500,
    description: 'Obligatorio cuando cambia el precio del producto.',
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'El motivo debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El motivo no puede estar vacío.' })
  @MaxLength(500, {
    message: 'El motivo no puede superar 500 caracteres.',
  })
  motivoCambioPrecio?: string;

  updatedAt: Date;
}
