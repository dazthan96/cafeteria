import { Controller, Get, Post, Body, Patch, Param, Delete, Res, ParseIntPipe } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { type Response } from 'express';

@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  create(@Body() createVentaDto: CreateVentaDto) {
    return this.ventasService.create(createVentaDto);
  }

  @Get()
  findAll() {
    return this.ventasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ventasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVentaDto: UpdateVentaDto) {
    return this.ventasService.update(+id, updateVentaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ventasService.remove(+id);
  }
   @Get(':id/pdf')
  async descargarReporte(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Factura_Venta_${id}.pdf`);
    await this.ventasService.generarPdfVenta(id, res);
  }
  @Get('estadisticas/dashboard')
  obtenerEstadisticas() {
    return this.ventasService.obtenerMetricasDashboard();
  }
}
