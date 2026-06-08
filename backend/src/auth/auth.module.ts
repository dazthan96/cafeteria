import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { RegistroAccesoModule } from 'src/registro-acceso/registro-acceso.module';
import {HttpModule} from '@nestjs/axios';
import {JwtModule} from '@nestjs/jwt'
@Module({
  imports:[
    UsuariosModule,
    RegistroAccesoModule,
    HttpModule,
    JwtModule.register({
      secret:process.env.JWT_SECRET||'fallback_secret',
      signOptions:{expiresIn:'8h'}
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
