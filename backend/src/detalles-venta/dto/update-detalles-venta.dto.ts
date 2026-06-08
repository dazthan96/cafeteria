import { PartialType } from '@nestjs/mapped-types';
import { CreateDetallesVentaDto } from './create-detalles-venta.dto';

export class UpdateDetallesVentaDto extends PartialType(CreateDetallesVentaDto) {}
