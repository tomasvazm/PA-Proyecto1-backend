import { ApiProperty } from '@nestjs/swagger';
import { ReferenciaDto } from 'src/modules/common/dto/referencia.dto';

export class HistorialPrecioDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ example: 100.5 })
  precioAnterior: number;

  @ApiProperty({ example: 125.75 })
  precioNuevo: number;

  @ApiProperty({ example: '2026-10-17T12:00:00.000Z' })
  fechaCambio: Date;

  @ApiProperty({ example: 'Actualización mensual de lista' })
  motivo: string;

  @ApiProperty({ type: ReferenciaDto })
  usuario: ReferenciaDto;
}
