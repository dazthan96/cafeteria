import { Injectable } from '@nestjs/common';
import { CreateDetallesVentaDto } from './dto/create-detalles-venta.dto';
import { UpdateDetallesVentaDto } from './dto/update-detalles-venta.dto';

@Injectable()
export class DetallesVentaService {
  create(createDetallesVentaDto: CreateDetallesVentaDto) {
    return 'This action adds a new detallesVenta';
  }

  findAll() {
    return `This action returns all detallesVenta`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detallesVenta`;
  }

  update(id: number, updateDetallesVentaDto: UpdateDetallesVentaDto) {
    return `This action updates a #${id} detallesVenta`;
  }

  remove(id: number) {
    return `This action removes a #${id} detallesVenta`;
  }
}
