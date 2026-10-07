import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { SeedOrganizacionService } from './seed-organizacion.service';
import { AuthGuard } from 'src/modules/gestion-usuario/auth/auth.guard';
import { Roles } from 'src/modules/gestion-usuario/auth/roles.decorator';


@Controller('seed-organizacion')
@UseGuards(AuthGuard)
export class SeedOrganizacionController {
   constructor(private readonly seedService: SeedOrganizacionService) { }
 
   private readonly logger = new Logger(SeedOrganizacionController.name);
 
   @Get('execute')
   @Roles('Administrador', 'Root')
   executeSeed() {
     this.logger.log('Creando una nseed...');
     return this.seedService.runAllSeeds();
 
   }
 
}
