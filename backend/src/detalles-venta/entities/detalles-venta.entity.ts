import { Producto } from "src/productos/entities/producto.entity";
import { Venta } from "src/ventas/entities/venta.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class DetallesVenta {
    @PrimaryGeneratedColumn()
    id_detalle_venta!:number;

    @ManyToOne(()=>Venta, (venta)=>venta.detalles)
    @JoinColumn({name:'id_venta'})
    venta!:Venta;

    @ManyToOne(()=>Producto, (producto)=>producto.detalles_venta)
    @JoinColumn({name:'id_producto'})
    producto!:Producto;

    @Column({type:'integer'})
    cantidad!:number;

    @Column({type:'decimal', precision:10, scale:2})
    precio_unitario!:number;

    @Column({type:'decimal', precision:10, scale:2})
    subtotal!:number;
}
