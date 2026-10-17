import { BadRequestException } from '@nestjs/common';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from 'src/modules/gestion-usuario/usuario/domain/entities/usuario.entity';
import { Producto } from './producto.entity';

@Entity('historial_precio')
export class HistorialPrecio {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('IDX_historial_precio_producto_id')
  @ManyToOne(() => Producto, { nullable: false })
  @JoinColumn({
    name: 'producto_id',
    foreignKeyConstraintName: 'FK_historial_precio_producto',
  })
  producto: Producto;

  @ManyToOne(() => Usuario, { nullable: false })
  @JoinColumn({
    name: 'usuario_id',
    foreignKeyConstraintName: 'FK_historial_precio_usuario',
  })
  usuario: Usuario;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 5,
    transformer: {
      to: (value: number): string => value.toString(),
      from: (value: string): number => Number(value),
    },
  })
  precioAnterior: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 5,
    transformer: {
      to: (value: number): string => value.toString(),
      from: (value: string): number => Number(value),
    },
  })
  precioNuevo: number;

  @CreateDateColumn({ type: 'timestamp' })
  fechaCambio: Date;

  @Column({ type: 'varchar', length: 500 })
  motivo: string;

  static registrarCambio(
    producto: Producto,
    precioAnterior: number,
    precioNuevo: number,
    motivo: string | undefined,
    usuario: Usuario,
  ): HistorialPrecio {
    if (!Number.isFinite(precioNuevo) || precioNuevo <= 0) {
      throw new BadRequestException('El precio debe ser mayor que cero.');
    }

    const motivoNormalizado = motivo?.trim();
    if (!motivoNormalizado) {
      throw new BadRequestException(
        'El motivo es obligatorio cuando cambia el precio.',
      );
    }
    if (motivoNormalizado.length > 500) {
      throw new BadRequestException(
        'El motivo no puede superar 500 caracteres.',
      );
    }

    const historial = new HistorialPrecio();
    historial.producto = producto;
    historial.precioAnterior = precioAnterior;
    historial.precioNuevo = precioNuevo;
    historial.motivo = motivoNormalizado;
    historial.usuario = usuario;
    return historial;
  }
}
