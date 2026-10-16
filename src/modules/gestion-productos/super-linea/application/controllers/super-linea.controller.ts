import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PaginationWithDenominacionDto } from 'src/modules/common/dto/busquedas/pagination-with-denominacion.dto';
import { NormalizeDenominacionPipe } from 'src/modules/common/pipes/normalize-denominations.pipe';
import { NormalizeDenominacionSearchPipe } from 'src/modules/common/pipes/normalize-denominations-search.pipe';
import { AuthGuard } from 'src/modules/gestion-usuario/auth/auth.guard';
import { Roles } from 'src/modules/gestion-usuario/auth/roles.decorator';
import { CreateSuperLineaDto } from '../../dto/create-super-linea.dto';
import { SuperLineaDto } from '../../dto/super-linea.dto';
import { UpdateSuperLineaDto } from '../../dto/update-super-linea.dto';
import { SuperLineaService } from '../services/super-linea.service';

@ApiTags('Gestion Productos')
@Controller('super-linea')
@UseGuards(AuthGuard)
export class SuperLineaController {
  private readonly logger = new Logger(SuperLineaController.name);

  constructor(private readonly service: SuperLineaService) {}

  @Post()
  @Roles('Root', 'Administrador', 'Empleado')
  @UsePipes(NormalizeDenominacionPipe)
  create(@Body() dto: CreateSuperLineaDto) {
    this.logger.log('Creando una SuperLínea.');
    return this.service.create(dto);
  }

  @Get('search-by')
  @Roles('Root', 'Administrador', 'Empleado')
  @UsePipes(NormalizeDenominacionSearchPipe)
  search(@Query() paginationDto: PaginationWithDenominacionDto) {
    const {
      denominacion = '',
      skip,
      take,
      incluirEliminados = false,
    } = paginationDto;
    return this.service.findBy(
      denominacion,
      skip,
      take,
      incluirEliminados,
    );
  }

  @Get(':id')
  @Roles('Root', 'Administrador', 'Empleado')
  @ApiOkResponse({ type: SuperLineaDto })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuperLineaDto> {
    return this.service.findDtoById(id);
  }

  @Put(':id')
  @Roles('Root', 'Administrador', 'Empleado')
  @UsePipes(NormalizeDenominacionPipe)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSuperLineaDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('Root', 'Administrador', 'Empleado')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('usuarioId', ParseIntPipe) usuarioId: number,
  ) {
    this.logger.warn(`Eliminando SuperLínea ${id}.`);
    return this.service.remove(id, usuarioId);
  }
}
