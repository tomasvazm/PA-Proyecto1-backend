import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IUnitOfWork } from 'src/modules/common/unit-of-work/iunit-of-work.';
import { ProveedorService } from 'src/modules/organizacion/proveedor/application/services/proveedor.service';
import { PaginacionUtils } from 'src/modules/common/utils/pagination/paginacion-utils';
import { UsuarioService } from 'src/modules/gestion-usuario/usuario/application/services/usuario.service';
import { ensureNotSistemaEntity } from 'src/modules/common/utils/atrituto-sistema';
import { AuditoriaMapper } from 'src/modules/gestion-sistema/auditoria/mappers/auditoria.mapper';
import { MessageFrontUtils } from 'src/modules/common/utils/message/message-front.util';
import { Producto } from '../../domain/entities/producto.entity';
import { IProductoRepository } from '../../domain/interfaces/producto.repository-interface';
import { CreateProductoDto } from '../../dto/create-producto.dto';
import { GetProductoDto } from '../../dto/get-producto.dto';
import { UpdateProductoDto } from '../../dto/update-producto.dto';
import { ProductoMapper } from '../../mappers/producto.mapper';
import { LineaService } from 'src/modules/gestion-productos/linea/application/services/linea.service';
import { MarcaService } from 'src/modules/gestion-productos/marca/application/services/marca.service';
import { ProductoIntrinsicValidationService } from '../../domain/services/producto-intrinsic-validation.service.ts';
import { ProductoValidationService } from '../../domain/services/producto-validation.service.ts';
import { ProductoRelatedEntitiesValidator } from '../../infraestructure/validators/producto-related-entities.validator.ts';
import { ProductoUniquenessValidator } from '../../infraestructure/validators/producto-uniqueness.validator.ts';
import { UsuarioValidator } from 'src/modules/common/utils/validation/usuario-validator';
import { ProductoDeletePolicy } from '../policies/producto-delete.policy';
import { ModoDenominacion } from '../../domain/enums/modo-denominacion.enum';
import { ProductoDenominacionService } from '../../domain/services/producto-denominacion.service';
import { HistorialPrecioDto } from '../../dto/historial-precio.dto';
@Injectable()
export class ProductoService {
  private readonly logger = new Logger(ProductoService.name);
  constructor(
    @Inject('IProductoRepository')
    private readonly repository: IProductoRepository,
    private readonly lineaService: LineaService,

    @Inject(forwardRef(() => MarcaService))
    private readonly marcaService: MarcaService,
    private readonly proveedorService: ProveedorService,
    private readonly usuarioService: UsuarioService,

    //  Domain Services
    private readonly intrinsicValidationService: ProductoIntrinsicValidationService,
    private readonly validationService: ProductoValidationService,

    // Infrastructure Validators
    private readonly relatedEntitiesValidator: ProductoRelatedEntitiesValidator,
    private readonly uniquenessValidator: ProductoUniquenessValidator,
    private readonly usuarioValidator: UsuarioValidator,

    private readonly productoDeletePolicy: ProductoDeletePolicy,
    private readonly productoDenominacionService: ProductoDenominacionService,

  ) { }

  private readonly ENTITY_NAME = 'Producto';

  async create(dto: CreateProductoDto) {
    this.logger.log(
      `Creando un nuevo ${this.ENTITY_NAME} con denominación: ${dto.denominacion} a: ${dto.denominacion}`,
    );

    // Orquestar todas las validaciones
    const { marca, linea, usuario, productoData } =
      await this.validarYPrepararCreacion(dto);



    const entity = await this.repository.create(
      productoData,
      linea,
      marca,

      usuario,
    );

    return MessageFrontUtils.createSimple(
      `${this.ENTITY_NAME}`,
      entity.denominacion,
      'creada',
    );
  }

  async update(id: number, dto: UpdateProductoDto) {
    this.logger.log(`Actualizandox  ${this.ENTITY_NAME} con ID: ${id}`);

    const { marca, linea, usuario, productoData } =
      await this.validarYPrepararActualizacion(id, dto);

    const entity = await this.repository.update(
      id,
      productoData,
      linea,
      marca,

      usuario,
    );

    return MessageFrontUtils.createSimple(
      `${this.ENTITY_NAME}`,
      entity.denominacion,
      'editada',
    );
  }

  async findByRapido(
    codigo: string,
    exacto: boolean,
    skip: number,
    take: number,
  ): Promise<{ data: GetProductoDto[]; total: number }> {
    this.logger.warn(`service`);
    const result = await this.repository.findByRapido(
      codigo,
      exacto,
      skip,
      take,
    );
    return {
      data: result.data.map((producto) => {
        return ProductoMapper.toBusquedaDto(producto);
      }),
      total: PaginacionUtils.totalItems(result.total),
    };
  }


  async findBy(
    denominacion: string,
    codigoProveedor: string,
    codProveedorExacto: boolean,
    codigoReferencia: string,
    marca_id: number,
    linea_id: number,
    proveedor_id: number,
    conStock: boolean,
    skip: number,
    take: number,
    lineaDenominacion?: string,
    superLineaDenominacion?: string,
  ): Promise<{ data: GetProductoDto[]; total: number }> {
    this.logger.warn(`service`);
    const result = await this.repository.findBy(
      denominacion,
      codigoProveedor,
      codProveedorExacto,
      codigoReferencia,
      marca_id,
      linea_id,
      proveedor_id,
      conStock,
      skip,
      take,
      lineaDenominacion,
      superLineaDenominacion,
    );
    return {
      data: result.data.map((producto) => {
        return ProductoMapper.toBusquedaDto(producto);
      }),
      total: PaginacionUtils.totalItems(result.total),
    };
  }


  async buscarMarcaDesdeProducto(id: number) {
    return this.marcaService.findEntityById(id);
  }

  async buscarLineaDesdeProducto(id: number) {
    return this.lineaService.findEntityById(id);
  }

  async findByIdConAuditoria(id: number) {
    const entity = await this.repository.findByIdConAuditoria(id);
    if (!entity)
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    return AuditoriaMapper.mapProductoToDto(entity);
  }

  async findDtoById(id: number) {
    const entity = await this.repository.findOne(id);
    if (!entity)
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    this.logger.log(`b1x`);
    return ProductoMapper.toDto(entity);
  }

  async findHistorialPrecio(id: number): Promise<HistorialPrecioDto[]> {
    const producto = await this.repository.findOne(id);
    if (!producto) {
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    }

    const historial = await this.repository.findHistorialPrecio(id);
    return historial.map((registro) =>
      ProductoMapper.toHistorialPrecioDto(registro),
    );
  }

  async findEntityById(id: number) {
    const entity = await this.repository.findOne(id);
    if (!entity)
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    return entity;
  }

  async remove(id: number, usuarioId: number) {
    const entity = await this.findEntityById(id);

    if (!entity) {
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );
    }
    

    ensureNotSistemaEntity(entity, 'Producto');

    const usuario = await this.usuarioService.findOne(usuarioId);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado.`);
    }

    await this.repository.remove(entity, usuario);
    return MessageFrontUtils.createSimple(
      `${this.ENTITY_NAME}`,
      entity.denominacion,
      'eliminada',
    );
  }


  async findAllForLineas(denominacion: string) {
    return this.lineaService.findAllFor(denominacion);
  }

  async findAllForMarcas(denominacion: string) {
    return this.marcaService.findAllFor(denominacion);
  }

  async findByDenominacionCodigoProveedorFiltered(
    denominacion: string,
    skip = 0,
    take = 10,
  ): Promise<{ data: GetProductoDto[]; total: number }> {
    this.logger.log(
      `  Buscando en srvice producto o ${denominacion}  skip=${skip}, take=${take}`,
    );
    const result =
      await this.repository.findByDenominacionCodigoProveedorFiltered(
        denominacion,
        skip,
        take,
      );
    this.logger.log(result);
    return {
      data: result.data.map((producto) => {
        return ProductoMapper.toBusquedaDto(producto);
      }),
      total: PaginacionUtils.totalItems(result.total),
    };
  }

  async existsProductosActivosByMarca(marcaId: number): Promise<boolean> {
    return this.repository.existsProductosActivosByMarca(marcaId);
  }
  async existsProductosActivosByLinea(lineaId: number): Promise<boolean> {
    return this.repository.existsProductosActivosByLinea(lineaId);
  }


  async findByIds(ids: number[]): Promise<Producto[]> {
    return this.repository.findByIds(ids);
  }

  async incrementarStock(
    uow: IUnitOfWork,
    productoId: number,
    cantidad: number,
    origen?: string,
  ): Promise<number> {
    return this.ajustarStockInterno(uow, productoId, cantidad, origen);
  }

  async decrementarStock(
    uow: IUnitOfWork,
    productoId: number,
    cantidad: number,
    origen?: string,
  ): Promise<number> {
    return this.ajustarStockInterno(uow, productoId, -cantidad, origen);
  }

  private async ajustarStockInterno(
    uow: IUnitOfWork,
    productoId: number,
    delta: number,
    origen?: string,
  ): Promise<number> {
    const producto = await this.repository.findOne(productoId);
    if (!producto) {
      throw new Error(`Producto con ID ${productoId} no encontrado`);
    }

    const stockActual = producto.stock ?? 0;
    const nuevoStock = stockActual + delta;

    // Política opcional
    // if (nuevoStock < 0) throw ...

    producto.stock = nuevoStock;
    await this.repository.updateEntity(uow, producto);

    this.logger.log(
      `[StockService] ${origen ?? 'Desconocido'} → ${stockActual} → ${nuevoStock}`,
    );

    return nuevoStock;
  }

  /**
   * Orquesta todas las validaciones necesarias para crear un producto
   * @private
   */
  private async validarYPrepararCreacion(dto: CreateProductoDto) {
    const { marca, linea } =
      await this.relatedEntitiesValidator.validarYObtenerEntidadesRelacionadas(
        dto.marcaId,
        dto.lineaId,
      );

    this.validationService.validarEntidadesRelacionadas(marca, linea);

    const modoDenominacion =
      dto.modoDenominacion ?? ModoDenominacion.AUTOMATICA;
    const denominacion =
      modoDenominacion === ModoDenominacion.AUTOMATICA
        ? this.productoDenominacionService.generar(
            marca.denominacion,
            linea.denominacion,
            dto.presentacion,
          )
        : dto.denominacion;

    if (!denominacion) {
      throw new BadRequestException(
        'La denominación es obligatoria en modo manual.',
      );
    }
    this.validarDenominacionAutomaticaInformada(dto.denominacion, denominacion);

    this.intrinsicValidationService.validarDatosBasicos({
      denominacion,
      marcaId: dto.marcaId,
      lineaId: dto.lineaId,
      alicuotaIva: dto.alicuotaIva,
      precio: dto.precio,
      stock: dto.stock,
      stockMinimo: dto.stockMinimo,
      utilizaPack: dto.utilizaPack,
      cantidadPorPack: dto.cantidadPorPack,
      presentacion: dto.presentacion,
      presentacionObligatoria: true,
    });
    await this.uniquenessValidator.validarDenominacionUnica(denominacion);

    if (dto.codigoProveedor) {
      await this.uniquenessValidator.validarCodigoProveedorUnico(
        dto.codigoProveedor,
        0,
      );
    }

    const usuario = await this.usuarioValidator.validarUsuarioExiste(
      dto.usuarioCreatedId,
    );

    return {
      marca,
      linea,
      usuario,
      productoData: { ...dto, denominacion, modoDenominacion },
    };
  }
  /**
   * Orquesta todas las validaciones necesarias para actualizar un producto
   * @private
   */
  private async validarYPrepararActualizacion(
    id: number,
    dto: UpdateProductoDto,
  ) {
    // Obtener producto actual
    const productoActual = await this.repository.findOne(id);
    if (!productoActual)
      throw new NotFoundException(
        `${this.ENTITY_NAME} con ID ${id} no encontrado.`,
      );

    if (
      productoActual.lineaId == null ||
      productoActual.marcaId == null
    ) {
      throw new InternalServerErrorException('Producto en estado inválido');
    }

    if (dto.presentacion === null) {
      throw new BadRequestException(
        'La presentación no se puede eliminar una vez asignada.',
      );
    }

    const marcaId = dto.marcaId ?? productoActual.marcaId;
    const lineaId = dto.lineaId ?? productoActual.lineaId;
    const presentacion = dto.presentacion ?? productoActual.presentacion;
    const modoDenominacion =
      dto.modoDenominacion ?? productoActual.modoDenominacion;

    const { marca, linea } =
      await this.relatedEntitiesValidator.validarYObtenerEntidadesRelacionadas(
        marcaId,
        lineaId,
      );

    this.validationService.validarEntidadesRelacionadas(marca, linea);

    const denominacion =
      modoDenominacion === ModoDenominacion.AUTOMATICA
        ? this.productoDenominacionService.generar(
            marca.denominacion,
            linea.denominacion,
            presentacion,
          )
        : (dto.denominacion ?? productoActual.denominacion);

    if (
      modoDenominacion === ModoDenominacion.AUTOMATICA &&
      dto.denominacion &&
      !this.coincidenDenominaciones(dto.denominacion, productoActual.denominacion) &&
      !this.coincidenDenominaciones(dto.denominacion, denominacion)
    ) {
      throw new BadRequestException(
        'Para editar manualmente la denominación, cambie el modo a MANUAL.',
      );
    }

    this.intrinsicValidationService.validarDatosBasicos({
      denominacion,
      marcaId,
      lineaId,
      alicuotaIva: dto.alicuotaIva ?? productoActual.alicuotaIva,
      precio:
        dto.precio === undefined ? productoActual.precio : dto.precio,
      stock: dto.stock ?? productoActual.stock,
      stockMinimo: dto.stockMinimo ?? productoActual.stockMinimo,
      utilizaPack: dto.utilizaPack ?? productoActual.utilizaPack,
      cantidadPorPack:
        dto.cantidadPorPack ??
        productoActual.cantidadPorPack ??
        undefined,
      presentacion,
    });
    await this.uniquenessValidator.validarDenominacionUnica(
      denominacion,
      id,
    );

    const usuario = await this.usuarioValidator.validarUsuarioExiste(
      dto.usuarioUpdatedId,
    );

    return {
      marca,
      linea,
      usuario,
      productoData: { ...dto, denominacion, modoDenominacion },
    };
  }

  private validarDenominacionAutomaticaInformada(
    denominacionInformada: string | undefined,
    denominacionGenerada: string,
  ): void {
    if (
      denominacionInformada &&
      !this.coincidenDenominaciones(
        denominacionInformada,
        denominacionGenerada,
      )
    ) {
      throw new BadRequestException(
        'En modo AUTOMATICA, la denominación debe coincidir con Marca, Línea y Presentación.',
      );
    }
  }

  private coincidenDenominaciones(
    primera: string,
    segunda: string,
  ): boolean {
    return primera.trim().toUpperCase() === segunda.trim().toUpperCase();
  }

}
