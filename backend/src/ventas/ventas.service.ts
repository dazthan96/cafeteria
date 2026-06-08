import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { Repository } from 'typeorm';
import { DetallesVenta } from 'src/detalles-venta/entities/detalles-venta.entity';
import PDFDocument from 'pdfkit';
import { margins, size } from 'pdfkit/js/page';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepo:Repository<Venta>,

    @InjectRepository(DetallesVenta)
    private readonly detallesVentaRepo: Repository<DetallesVenta>
  ){}
  async create(createVentaDto: CreateVentaDto) {
    const id_usuario = createVentaDto.id_usuario;
    const ci_cliente = createVentaDto.ci_cliente;
    const razon_social = createVentaDto.razon_social;
    const metodo_pago = createVentaDto.metodo_pago;
    const lista_detalles = createVentaDto.detalles;

    const datos_venta = {
      usuario: {id_usuario:id_usuario},
      ci_cliente:ci_cliente,
      razon_social:razon_social,
      metodo_pago:metodo_pago,
      monto_total:0
    }
    const entidad_venta = this.ventaRepo.create(datos_venta);
    const venta_guardada = await this.ventaRepo.save(entidad_venta)

    let suma_monto_total = 0;

    for(const item of lista_detalles){
        const subtotal_acumulado = item.cantidad *item.precio_unitario;
        suma_monto_total = suma_monto_total + subtotal_acumulado;
        
        const datos_detalle = {
          venta:venta_guardada,
          producto:{id_producto:item.id_producto},
          cantidad: item.cantidad,
          precio_unitario:item.precio_unitario,
          subtotal:subtotal_acumulado
        }
        const entidad_detalle = this.detallesVentaRepo.create(datos_detalle);
        await this.detallesVentaRepo.save(entidad_detalle);
    }
    venta_guardada.monto_total = suma_monto_total;
    await this.ventaRepo.save(venta_guardada);

    const venta_completa = await this.findOne(venta_guardada.id_venta)
    return venta_completa;
  }

  async findAll() {
    return await this.ventaRepo.find({
      relations:{
        usuario:true,
        detalles:{producto:true}
      }
    });
  }

  async findOne(id: number) {
    const venta = await this.ventaRepo.findOne({
      where:{id_venta:id},
      relations:{
        usuario:true,
        detalles:{producto:true},
        
      }
    });
    if (!venta){throw new NotFoundException("La venta no existe")}

    return venta;
  }

  update(id: number, updateVentaDto: UpdateVentaDto) {
    return "No se puede/editar ventas";
  }

  async remove(id: number) {
    const venta = await this.ventaRepo.findOneBy({id_venta:id});
    if(!venta) {throw new NotFoundException("Venta no existente")}
    await this.ventaRepo.softDelete(id);
    return {message: `Venta ${id} eliminada`}
  }

  async generarPdfVenta(id_venta:number, respuesta_red:any){
    const venta = await this.findOne(id_venta);

    const doc = new PDFDocument({size:'A6', margin:20})

    doc.pipe(respuesta_red);

    doc.fontSize(14).text("LycoReco - Cafeteria",{align:'center'}).moveDown(0.5);
    doc.fontSize(9).text("La Paz, Bolivia",{align:'center'});
    doc.text("-----------------------------------------------------------",{align:"center"}).moveDown(0.5);

    doc.fontSize(9);
    doc.text(`Nro. Venta: ${venta.id_venta}`);
    doc.text(`Fecha: ${new Date(venta.fecha_venta).toLocaleString()}`);
    doc.text(`Atentidido por: ${venta.usuario?.nombre_usuario}`);
    doc.text(`Cliente: ${venta.razon_social || 'S/N'}`);
    doc.text(`C.I./NIT: ${venta.ci_cliente || '0'}`);

    doc.font('Helvetica-Bold').text('Cant.   Producto              P.Unit   Subtotal');
    doc.font('Helvetica').text('-----------------------------------------------------------');
    
    for(const det of venta.detalles){
      const nombreProducto = det.producto?.nombre || 'Producto';
      const nombreCorto = nombreProducto.substring(0, 18).padEnd(18, ' ');
      doc.text(`${det.cantidad.toString().padEnd(6,' ')}${nombreCorto} Bs.${Number(det.precio_unitario).toFixed(2).padEnd(6, ' ')} Bs.${Number(det.subtotal).toFixed(2)}`)
    }
    doc.text('-----------------------------------------------------------').moveDown(0.5);

    doc.font('Helvetica-Bold').fontSize(11);
    doc.text(`Monto Total: Bs. ${Number(venta.monto_total).toFixed(2)}`,{align:'right'});
    doc.fontSize(9).font('Helvetica');
    doc.text(`Metodo de pago: ${venta.metodo_pago.toUpperCase()}`, {align:'left'}).moveDown(1);

    doc.fontSize(10).font('Helvetica-Oblique').text('Gracias por su compra', {align:'center'});
    doc.end()
  }
    async obtenerMetricasDashboard() {
    try {
      // 1. CONSULTA: Ventas agrupadas por día de la semana (Para gráfico de barras)
      // Extrae el día y suma el monto total de las ventas
      const ventasPorDiaRaw = await this.ventaRepo
        .createQueryBuilder('venta')
        .select("TO_CHAR(venta.fecha_venta, 'YYYY-MM-DD')", 'fecha')
        .addSelect('SUM(venta.monto_total)', 'total_vendido')
        .groupBy("TO_CHAR(venta.fecha_venta, 'YYYY-MM-DD')")
        .orderBy('fecha', 'ASC')
        .limit(7) // Trae los últimos 7 días con ventas
        .getRawMany();

      // 2. CONSULTA: Top 5 Productos más vendidos (Para gráfico de torta)
      // Accede al repositorio de detalles mediante el QueryBuilder de ventas
      const productosMasVendidosRaw = await this.detallesVentaRepo
        .createQueryBuilder('detalle')
        .innerJoin('detalle.producto', 'producto')
        .select('producto.nombre', 'producto_nombre')
        .addSelect('SUM(detalle.cantidad)', 'cantidad_total')
        .groupBy('producto.nombre')
        .orderBy('cantidad_total', 'DESC')
        .limit(5) // El top 5 de productos del menú
        .getRawMany();

      // 3. ESTRUCTURAR EL JSON DE RESPUESTA QUE LE ENCANTA A REACT
      return {
        ventasPorDia: ventasPorDiaRaw.map(item => ({
          fecha: item.fecha,
          total: Number(item.total_vendido)
        })),
        productosMasVendidos: productosMasVendidosRaw.map(item => ({
          name: item.producto_nombre,
          value: Number(item.cantidad_total)
        }))
      };

    } catch (error) {
      throw new BadRequestException('Error al compilar las estadísticas: ' + (error as Error).message);
    }
  }

}
