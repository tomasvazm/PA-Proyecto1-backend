import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { SeedFamiliaProductoService } from './seed-familia-producto.service';
import { AuthGuard } from 'src/modules/gestion-usuario/auth/auth.guard';
import { Roles } from 'src/modules/gestion-usuario/auth/roles.decorator';

@Controller('seed-familia-producto')
@UseGuards(AuthGuard)
export class SeedFamiliaProductoController {
  constructor(private readonly seedService: SeedFamiliaProductoService) { }

  private readonly logger = new Logger(SeedFamiliaProductoController.name);

  @Get('execute')
  @Roles('Administrador', 'Root')
  executeSeed() {
    this.logger.log('Creando una nseed...');
    return this.seedService.runAllSeeds();

  }


}
