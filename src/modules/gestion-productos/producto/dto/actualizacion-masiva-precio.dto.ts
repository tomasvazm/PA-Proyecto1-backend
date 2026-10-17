import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  Min,
  Validate,
  ValidateIf,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { AlcanceAjustePrecio } from '../domain/enums/alcance-ajuste-precio.enum';
import { TipoAjustePrecio } from '../domain/enums/tipo-ajuste-precio.enum';

@ValidatorConstraint({ name: 'motivoCambioPrecioValido', async: false })
class MotivoCambioPrecioValidator implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return (
      typeof value === 'string' &&
      value.trim().length > 0 &&
      value.trim().length <= 500
    );
  }

  defaultMessage(args: ValidationArguments): string {
    if (args.value === undefined || args.value === null) {
      return 'El motivo es obligatorio.';
    }
    if (typeof args.value !== 'string') {
      return 'El motivo debe ser una cadena de texto.';
    }
    if (!args.value.trim()) {
      return 'El motivo es obligatorio.';
    }
    return 'El motivo no puede superar 500 caracteres.';
  }
}

export class ActualizacionMasivaPrecioDto {
  @ApiProperty({ enum: TipoAjustePrecio, enumName: 'TipoAjustePrecio' })
  @IsEnum(TipoAjustePrecio, {
    message: 'El tipo de ajuste debe ser PORCENTAJE o MONTO.',
  })
  tipoAjuste: TipoAjustePrecio;

  @ApiProperty({
    example: -5,
    description:
      'Valor del ajuste. Un valor negativo reduce el precio; el resultado debe seguir siendo mayor que cero.',
  })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'El valor del ajuste debe ser un número válido.' },
  )
  valor: number;

  @ApiProperty({ enum: AlcanceAjustePrecio, enumName: 'AlcanceAjustePrecio' })
  @IsEnum(AlcanceAjustePrecio, {
    message: 'El alcance debe ser GLOBAL o LINEA.',
  })
  alcance: AlcanceAjustePrecio;

  @ApiPropertyOptional({
    example: 4,
    description: 'Obligatorio cuando el alcance es LINEA.',
  })
  @ValidateIf(
    (dto: ActualizacionMasivaPrecioDto) =>
      dto.alcance === AlcanceAjustePrecio.LINEA || dto.lineaId !== undefined,
  )
  @IsInt({ message: 'La Línea debe ser un identificador entero válido.' })
  @Min(1, { message: 'La Línea debe ser un identificador positivo.' })
  lineaId?: number;

  @ApiProperty({
    maxLength: 500,
    example: 'Actualización de lista de precios',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @Validate(MotivoCambioPrecioValidator)
  motivoCambioPrecio: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: 'El usuarioUpdatedId es obligatorio.' })
  @IsInt({ message: 'El usuarioUpdatedId debe ser un número entero.' })
  usuarioUpdatedId: number;
}
