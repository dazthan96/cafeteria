import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoriasModule } from './categorias/categorias.module';
import { ProductosModule } from './productos/productos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { VentasModule } from './ventas/ventas.module';
import { DetallesVentaModule } from './detalles-venta/detalles-venta.module';
import { RegistroAccesoModule } from './registro-acceso/registro-acceso.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { config } from 'node:process';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      useFactory:(config:ConfigService)=>({
        type:'postgres',
        host:config.get('DB_HOST'),//||'localhost',
        port: config.get<number>('DB_PORT'),//||5432,
        username:config.get('DB_USERNAME'),//||'postgres',
        password:config.get('DB_PASSWORD'),//||'RosmerY06011996',
        database:config.get('DB_DATABASE'),//||'cafeteria2',
        autoLoadEntities:true,
        synchronize:true,
      }),
      inject:[ConfigService]
      
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
