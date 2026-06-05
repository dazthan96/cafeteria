import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoriasModule } from './categorias/categorias.module';
import { ProductosModule } from './productos/productos.module';

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
    ProductosModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
