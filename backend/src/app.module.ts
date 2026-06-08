import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoriasModule } from './categorias/categorias.module';
import { ProductosModule } from './productos/productos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { VentasModule } from './ventas/ventas.module';
import { DetallesVentaModule } from './detalles-venta/detalles-venta.module';
import { RegistroAccesoModule } from './registro-acceso/registro-acceso.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'postgres',
      host:'localhost',
      port: 5432,
      username:'postgres',
      password:'RosmerY06011996',
      database:'cafeteria2',
      autoLoadEntities:true,
      synchronize:true
    }),
    CategoriasModule,
    ProductosModule,
    UsuariosModule,
    VentasModule,
    DetallesVentaModule,
    RegistroAccesoModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
