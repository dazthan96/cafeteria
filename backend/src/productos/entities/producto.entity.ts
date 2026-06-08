import { Categoria } from "src/categorias/entities/categoria.entity";
import { DetallesVenta } from "src/detalles-venta/entities/detalles-venta.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Producto {
    @PrimaryGeneratedColumn()
    id_producto!:number;

    @Column({length:100})
    nombre!:string;

    @Column({type:'text', nullable:true})
    descripcion!:string;

    @Column({type:'decimal', precision:10, scale:2})
    precio_venta!:number;

    @DeleteDateColumn({type:'timestamp', name: 'eliminado_en'})
    eliminado_en!:Date;

    @ManyToOne(()=>Categoria, (categoria)=>categoria.productos)
    @JoinColumn({name:'id_categoria'})
    categoria!:Categoria

    @OneToMany(()=>DetallesVenta, (detalles_venta)=>detalles_venta.producto)
    detalles_venta!:DetallesVenta[];

}
