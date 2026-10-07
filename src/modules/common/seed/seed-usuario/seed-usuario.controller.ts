import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { SeedUsuarioService } from './seed-usuario.service';
import { AuthGuard } from 'src/modules/gestion-usuario/auth/auth.guard';
import { Roles } from 'src/modules/gestion-usuario/auth/roles.decorator';


@Controller('seed-usuario')
@UseGuards(AuthGuard)
export class SeedUsuarioController {
   constructor(private readonly seedService: SeedUsuarioService) { }
 
   private readonly logger = new Logger(SeedUsuarioController.name);
 
   @Get('execute')
   @Roles('Administrador', 'Root')
   executeSeed() {
     this.logger.log('Creando una nseed...');
     return this.seedService.runAllSeeds();
 
   }
 
}
