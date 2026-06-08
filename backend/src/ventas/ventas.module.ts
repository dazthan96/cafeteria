import { Module } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { DetallesVenta } from 'src/detalles-venta/entities/detalles-venta.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Venta, Usuario,DetallesVenta])],
  controllers: [VentasController],
  providers: [VentasService],
})
export class VentasModule {}
