import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsPositive, Max } from 'class-validator';
import {
  MAX_CANTIDAD_PRESENTACION,
  UnidadPresentacion,
} from '../domain/value-objects/presentacion';

export class PresentacionDto {
  @ApiProperty({
    example: 1,
    description: 'Cantidad de la presentación.',
  })
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 3 },
    {
      message:
        'La cantidad de presentación debe ser un número válido con hasta tres decimales.',
    },
  )
  @IsPositive({
    message: 'La cantidad de presentación debe ser mayor que cero.',
  })
  @Max(MAX_CANTIDAD_PRESENTACION, {
    message: 'La cantidad de presentación excede el máximo permitido.',
  })
  cantidad: number;

  @ApiProperty({
    enum: UnidadPresentacion,
    enumName: 'UnidadPresentacion',
    example: UnidadPresentacion.L,
  })
  @IsEnum(UnidadPresentacion, {
    message: 'La unidad debe ser ML, L, G, KG o UNIDADES.',
  })
  unidad: UnidadPresentacion;
}
