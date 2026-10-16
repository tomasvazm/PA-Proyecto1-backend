import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  Matches,
  IsOptional,
  IsInt,
  IsBoolean,
  Min,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateLineaDto {
  @Transform(({ value }) => value.trim().toLowerCase())
  @IsString({ message: 'La denominación debe ser una cadena de texto.' }) // Valida que sea string
  @IsNotEmpty({ message: 'La denominación no puede estar vacía.' }) // Valida que no esté vacía
  @MaxLength(255, { message: 'La denominación no puede estar vacía.' })
  @Matches(/^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ]+$/, {
    message: 'La denominación solo puede contener letras, números y espacios.',
  })
  denominacion: string;

  @IsOptional()
  @IsInt()
  stockMinimo?: number;

  @IsBoolean()
  utilizaStockMinimo: boolean;

  @IsOptional()
  @IsString()
  observacion?: string;

  @IsOptional()
  @Transform(({ value }) =>
    value === null || value === undefined ? value : Number(value),
  )
  @IsInt({ message: 'La SuperLínea debe ser un identificador entero válido.' })
  @Min(1, { message: 'La SuperLínea debe ser un identificador positivo.' })
  superLineaId?: number | null;

  createdAt?: Date;

  @IsNotEmpty({ message: 'El usuarioCreatedId es obligatorio.' })
  @IsInt({ message: 'El usuarioCreatedId debe ser un número entero.' })
  usuarioCreatedId: number;

  @ApiProperty({
    example: null,
    description: 'Fecha de eliminación (null si está activa)',
    nullable: true,
  })
  @IsOptional()
  deletedAt: string | null;
}
