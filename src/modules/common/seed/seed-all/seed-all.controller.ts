import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { SeedAllService } from './seed-all.service';
import { AuthGuard } from 'src/modules/gestion-usuario/auth/auth.guard';
import { Roles } from 'src/modules/gestion-usuario/auth/roles.decorator';

@Controller('seed-all')
@UseGuards(AuthGuard)
export class SeedAllController {

  private readonly logger = new Logger(SeedAllController.name);

  constructor(private readonly seedService: SeedAllService) {}

  @Get('execute')
  @Roles('Administrador', 'Root')
  executeSeed() {
    this.logger.log('🔄 Ejecutando todos los seeds...');
    return this.seedService.runAllSeeds();
  }
}
