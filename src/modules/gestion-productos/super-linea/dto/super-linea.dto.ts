import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class SuperLineaDto {
  @ApiProperty({ example: 123, description: 'Identificador de la SuperLínea.' })
  @Type(() => Number)
  @IsInt()
  id: number;

  @ApiProperty({
    example: 'Bebidas',
    description: 'Denominación de la SuperLínea.',
  })
  @IsString()
  denominacion: string;

  @ApiPropertyOptional({ example: 'Línea de bebidas', nullable: true })
  @IsOptional()
  @IsString()
  observacion?: string | null;

  @ApiProperty({ example: 0, description: 'Indica si es un registro del sistema.' })
  @Type(() => Number)
  @IsInt()
  sistema: number;

  @ApiPropertyOptional({
    example: null,
    description: 'Fecha de eliminación (null si está activa).',
    nullable: true,
  })
  @IsOptional()
  deletedAt: string | null;
}
