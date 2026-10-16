import { BadRequestException, Injectable } from '@nestjs/common';
import { Presentacion } from '../value-objects/presentacion';

@Injectable()
export class ProductoDenominacionService {
  generar(
    marca: string,
    linea: string,
    presentacion: Presentacion | null | undefined,
  ): string {
    if (
      !marca?.trim() ||
      !linea?.trim() ||
      presentacion?.cantidad == null ||
      !presentacion.unidad
    ) {
      throw new BadRequestException(
        'Se necesitan Marca, Línea y Presentación para generar la denominación automática.',
      );
    }

    return `${marca} ${linea} ${presentacion.cantidad} ${presentacion.unidad}`
      .trim()
      .replace(/\s+/g, ' ')
      .toUpperCase();
  }
}
