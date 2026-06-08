import { Module } from '@nestjs/common';
import { RegistroAccesoService } from './registro-acceso.service';
import { RegistroAccesoController } from './registro-acceso.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistroAcceso } from './entities/registro-acceso.entity';

@Module({
  imports:[TypeOrmModule.forFeature([RegistroAcceso])],
  controllers: [RegistroAccesoController],
  providers: [RegistroAccesoService],
  exports:[
    RegistroAccesoService, TypeOrmModule
  ]
})
export class RegistroAccesoModule {}
