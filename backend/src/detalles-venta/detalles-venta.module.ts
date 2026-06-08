import { Module } from '@nestjs/common';
import { DetallesVentaService } from './detalles-venta.service';
import { DetallesVentaController } from './detalles-venta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetallesVenta } from './entities/detalles-venta.entity';
import { Venta } from 'src/ventas/entities/venta.entity';
import { Producto } from 'src/productos/entities/producto.entity';

@Module({
  imports:[TypeOrmModule.forFeature([DetallesVenta, Venta, Producto])],
  controllers: [DetallesVentaController],
  providers: [DetallesVentaService],
})
export class DetallesVentaModule {}
