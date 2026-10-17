import { BadRequestException, Injectable } from '@nestjs/common';
import { TipoAjustePrecio } from '../enums/tipo-ajuste-precio.enum';

const PRECIO_MAXIMO = 9_999_999_999.99999;
const DECIMALES_PRECIO = 5;

@Injectable()
export class ProductoAjustePrecioService {
  calcularNuevoPrecio(
    precioActual: number,
    tipoAjuste: TipoAjustePrecio,
    valor: number,
    productoId: number,
  ): number {
    if (!Number.isFinite(precioActual) || !Number.isFinite(valor)) {
      throw new BadRequestException('El ajuste y el precio deben ser válidos.');
    }

    let precioCalculado: number;
    switch (tipoAjuste) {
      case TipoAjustePrecio.PORCENTAJE:
        precioCalculado = precioActual * (1 + valor / 100);
        break;
      case TipoAjustePrecio.MONTO:
        precioCalculado = precioActual + valor;
        break;
      default:
        throw new BadRequestException('El tipo de ajuste de precio no es válido.');
    }

    const precioNuevo = Number(precioCalculado.toFixed(DECIMALES_PRECIO));

    if (
      !Number.isFinite(precioNuevo) ||
      precioNuevo <= 0 ||
      precioNuevo > PRECIO_MAXIMO
    ) {
      throw new BadRequestException(
        `El ajuste dejaría el producto ${productoId} con un precio inválido. No se actualizó ningún producto.`,
      );
    }

    return precioNuevo;
  }
}
