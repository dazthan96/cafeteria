import { Injectable, UnauthorizedException,BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { RegistroAccesoService } from 'src/registro-acceso/registro-acceso.service';
import * as bcrypt from 'bcrypt';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {JwtService} from '@nestjs/jwt'


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    private readonly logsService: RegistroAccesoService,

    private readonly httpService: HttpService,

    private readonly jwtService:JwtService
  ) {}

async validarCaptcha(tokenCaptcha: string): Promise<boolean> {
  //console.log(tokenCaptcha)
  return true;
  console.log('Token recibido:', tokenCaptcha)
  if (!tokenCaptcha) {
    throw new BadRequestException('El token del CAPTCHA es obligatorio');
  }

  const secretKey = "6LfXbxQtAAAAAPkCvZAU-GqPL1cCgp5TAO9ZQDg0"; 
  
  const urlConfig = new URL('https://google.com');
  urlConfig.searchParams.append('secret', secretKey);
  urlConfig.searchParams.append('response', tokenCaptcha);

  try {
    const respuesta = await firstValueFrom(this.httpService.get(urlConfig.href));

    if (!respuesta.data.success) {
      console.log("Detalle del fallo de Google:", respuesta.data['error-codes']);
      throw new BadRequestException('Validación de CAPTCHA incorrecta o expirada');
    }

    return true; 
  } catch (error: any) {
    console.error("ERROR EN VALIDACIÓN CAPTCHA:", error.message); 
    
    if (error instanceof BadRequestException) {
      throw error;
    }
    
    throw new BadRequestException('Error al verificar el CAPTCHA con el servidor externo');
  }
}


  async login(body: any, ip: string, browser: string) {
    const { username, contrasenia, captchaToken } = body;
    //console.log('Token recibido:', captchaToken)
    if(!contrasenia){throw new BadRequestException('contraseña requerida')}
    const esHumano = await this.validarCaptcha(captchaToken);
    if (!esHumano) {
      await this.logsService.registrarIngreso(null, 'Intento Fallido', ip, browser);
      throw new UnauthorizedException('Validación de CAPTCHA incorrecta. Intente de nuevo.');
    }
    const usuarioEncontrado = await this.usuarioRepository.findOne({
      where: { 
        username: username, 
        eliminado_en: IsNull()
      },
      select:{id_usuario:true, username:true, nombre_usuario:true, apellido_usuario:true, rol:true, contrasenia:true, eliminado_en:true,creado_en:true, registrosAcceso:true}
    });
    
    if (!usuarioEncontrado) {
      await this.logsService.registrarIngreso(null, 'Intento Fallido', ip, browser);
      throw new UnauthorizedException('Las credenciales introducidas son incorrectas');
    }

    const esContraseniaValida = await bcrypt.compare(contrasenia, usuarioEncontrado.contrasenia);


    if (!esContraseniaValida) {
      await this.logsService.registrarIngreso(usuarioEncontrado.id_usuario, 'Intento Fallido', ip, browser);
      throw new UnauthorizedException('Las credenciales introducidas son incorrectas');
    }

    await this.logsService.registrarIngreso(usuarioEncontrado.id_usuario, 'Ingreso', ip, browser);

    const payload ={
      id_usuario:usuarioEncontrado.id_usuario,
      rol: usuarioEncontrado.rol
    };

    const tokenGenerado = this.jwtService.sign(payload);

    return {
      id_usuario: usuarioEncontrado.id_usuario,
      username: usuarioEncontrado.username,
      nombre: usuarioEncontrado.nombre_usuario,
      rol: usuarioEncontrado.rol,
      access_token:tokenGenerado,
      message: 'Acceso concedido al sistema POS'
    };
  }

  async logout(idUsuario: number) {
    await this.logsService.registrarSalida(idUsuario);
    
    return {
      message: 'Sesión cerrada correctamente, log de salida registrado'
    };
  }
}
