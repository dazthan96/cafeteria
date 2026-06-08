import { Controller, Get } from '@nestjs/common';
import { RegistroAccesoService } from './registro-acceso.service';

@Controller('registros-acceso')
export class RegistroAccesoController {
  constructor(private readonly registroAccesoService: RegistroAccesoService) {}
  @Get()
  obtenerTodos() {
    return this.registroAccesoService.obtenerHistorialCompleto();
  }
}
