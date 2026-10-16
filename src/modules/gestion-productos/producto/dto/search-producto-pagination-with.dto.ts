import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class SearchProductoPaginationWithDto {
  @IsOptional()
  @IsString()
  denominacion?: string;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'La denominación de la línea debe ser un texto.' })
  lineaDenominacion?: string;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'La denominación de la SuperLínea debe ser un texto.' })
  superLineaDenominacion?: string;

  @IsOptional()
  @IsString()
  codigoProveedor: string;
 
  @IsOptional()
  @IsString()
  codigoReferencia: string;
  
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  @IsBoolean()
  codReferenciaExacto: boolean = false;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  @IsBoolean()
  codProveedorExacto: boolean = false;

  @IsInt()
  @Min(0, { message: 'skip debe ser un número entero positivo o 0' })
  @Type(() => Number)
  skip: number = 0;

  @IsInt()
  @Min(1, { message: 'take debe ser un número entero mayor que 0' })
  @Type(() => Number)
  take: number = 10;


  @IsOptional()
  @Type(() => Number)
  @IsInt()
  marcaId: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  lineaId: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  proveedorId: number; 

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  @IsBoolean()
  conStock: boolean;

}