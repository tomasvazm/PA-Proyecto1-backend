import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AlcanceAjustePrecio } from '../domain/enums/alcance-ajuste-precio.enum';
import { TipoAjustePrecio } from '../domain/enums/tipo-ajuste-precio.enum';

export class ResultadoActualizacionMasivaPrecioDto {
  @ApiProperty({ enum: TipoAjustePrecio, enumName: 'TipoAjustePrecio' })
  tipoAjuste: TipoAjustePrecio;

  @ApiProperty()
  valor: number;

  @ApiProperty({ enum: AlcanceAjustePrecio, enumName: 'AlcanceAjustePrecio' })
  alcance: AlcanceAjustePrecio;

  @ApiPropertyOptional()
  lineaId?: number;

  @ApiProperty()
  productosEvaluados: number;

  @ApiProperty()
  productosActualizados: number;

  @ApiProperty()
  productosSinCambios: number;
}
