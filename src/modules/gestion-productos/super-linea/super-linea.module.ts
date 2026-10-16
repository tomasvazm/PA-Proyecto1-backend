import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from 'src/modules/gestion-usuario/usuario/usuario.module';
import { Linea } from '../linea/domain/entities/linea.entity';
import { SuperLineaController } from './application/controllers/super-linea.controller';
import { SuperLineaService } from './application/services/super-linea.service';
import { SuperLinea } from './domain/entities/super-linea.entity';
import { SuperLineaRepository } from './infraestructure/repositories/super-linea.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SuperLinea, Linea]), UsuarioModule],
  controllers: [SuperLineaController],
  providers: [
    SuperLineaService,
    {
      provide: 'ISuperLineaRepository',
      useClass: SuperLineaRepository,
    },
  ],
  exports: [TypeOrmModule, SuperLineaService],
})
export class SuperLineaModule {}
