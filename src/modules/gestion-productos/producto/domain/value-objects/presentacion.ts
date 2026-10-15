import { Column } from 'typeorm';

export enum UnidadPresentacion {
  ML = 'ML',
  L = 'L',
  G = 'G',
  KG = 'KG',
  UNIDADES = 'UNIDADES',
}

export const MAX_CANTIDAD_PRESENTACION = 999_999_999.999;

export class Presentacion {
  @Column('decimal', {
    precision: 12,
    scale: 3,
    nullable: true,
    transformer: {
      to: (value: number | null | undefined): string | null | undefined =>
        value == null ? value : value.toString(),
      from: (value: string | number | null): number | null =>
        value == null ? null : Number(value),
    },
  })
  cantidad: number | null;

  @Column({ type: 'varchar', length: 16, nullable: true })
  unidad: UnidadPresentacion | null;
}
