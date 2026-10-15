// domain/services/producto-intrinsic-validation.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ProductoIntrinsicValidationService {
  /**
   * Valida todos los datos intrínsecos del producto
   */
  validarDatosBasicos(datos: {
    denominacion: string;
    marcaId: number;
    lineaId: number;
    alicuotaIva?: number;
    precio?: number;
    stock?: number;
    stockMinimo?: number;
    utilizaPack?: boolean;
    cantidadPorPack?: number;
  }): void {
    this.validarDenominacion(datos.denominacion);
    this.validarIds(datos.marcaId, datos.lineaId);
    this.validarPrecio(datos.precio);
    this.validarCantidad(datos.stock, 'El stock');
    this.validarCantidad(datos.stockMinimo, 'El stock mínimo');
    this.validarPack(datos.utilizaPack, datos.cantidadPorPack);
    
    if (datos.alicuotaIva !== undefined) {
      this.validarAlicuotaIva(datos.alicuotaIva);
    }
  }

  private validarDenominacion(denominacion: string): void {
    if (!denominacion || denominacion.trim().length === 0) {
      throw new BadRequestException('La denominación es obligatoria');
    }
    if (denominacion.trim().length > 255) {
      throw new BadRequestException(
        'La denominación no puede superar 255 caracteres.',
      );
    }
  }

  private validarIds(
    marcaId: number,
    lineaId: number,
  ): void {
    if (!Number.isInteger(marcaId) || marcaId <= 0) {
      throw new BadRequestException(
        'La marca es obligatoria y debe ser un identificador válido.',
      );
    }
    if (!Number.isInteger(lineaId) || lineaId <= 0) {
      throw new BadRequestException(
        'La línea es obligatoria y debe ser un identificador válido.',
      );
    }
  }

  private validarPrecio(precio?: number): void {
    if (precio === undefined) {
      return;
    }

    if (!Number.isFinite(precio) || precio <= 0) {
      throw new BadRequestException('El precio debe ser mayor que cero.');
    }
  }

  private validarCantidad(cantidad: number | undefined, nombre: string): void {
    if (cantidad === undefined) {
      return;
    }

    if (!Number.isFinite(cantidad) || cantidad < 0) {
      throw new BadRequestException(`${nombre} no puede ser negativo.`);
    }
  }

  private validarPack(
    utilizaPack: boolean | undefined,
    cantidadPorPack: number | undefined,
  ): void {
    if (utilizaPack && (cantidadPorPack === undefined || cantidadPorPack <= 0)) {
      throw new BadRequestException(
        'La cantidad por pack debe ser mayor que cero cuando el producto utiliza pack.',
      );
    }

    if (!utilizaPack && cantidadPorPack !== undefined) {
      throw new BadRequestException(
        'No se puede informar una cantidad por pack si el producto no utiliza pack.',
      );
    }
  }

  private validarAlicuotaIva(alicuotaIva: number): void {
    if (!Number.isFinite(alicuotaIva) || alicuotaIva < 0 || alicuotaIva > 100) {
      throw new BadRequestException(
        'La alícuota IVA debe estar entre 0 y 100.',
      );
    }
  }
}