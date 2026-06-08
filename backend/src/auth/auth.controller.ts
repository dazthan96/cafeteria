import { Controller, Post, Body, Req, ParseIntPipe, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { type Request } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginBody: any, @Req() request: Request) {
    // Capturamos la IP real del cliente que hace la petición
    const ipCliente = request.ip || request.connection.remoteAddress || '127.0.0.1';
    
    // Capturamos el User-Agent (Navegador, Sistema Operativo, etc.)
    const navegadorCliente = request.headers['user-agent'] || 'Desconocido';

    // Se lo enviamos todo al servicio
    return this.authService.login(loginBody, ipCliente, navegadorCliente);
  }

  // 2. ENDPOINT PARA EL LOGOUT: POST http://localhost:3000/auth/logout/1
  @Post('logout/:id')
  logout(@Param('id', ParseIntPipe) idUsuario: number) {
    return this.authService.logout(idUsuario);
  }
}
