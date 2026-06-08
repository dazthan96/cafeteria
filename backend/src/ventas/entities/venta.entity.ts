import { Categoria } from "src/categorias/entities/categoria.entity";
import { DetallesVenta } from "src/detalles-venta/entities/detalles-venta.entity";
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Venta {
    @PrimaryGeneratedColumn()
    id_venta!:number;

    @ManyToOne(()=>Usuario, (usuario)=>usuario.ventas)
    @JoinColumn({name:'id_usuario'})
    usuario!:Usuario;

    @Column({type:'integer', nullable:true})
    ci_cliente?:number;

    @Column({length:50, nullable:true})
    razon_social?:string;

    @Column({type:'decimal', precision:10, scale:2})
    monto_total!:number;

    @Column({length:20})
    metodo_pago!:string;

    @CreateDateColumn({type:'timestamp'})
    fecha_venta!:Date;

    @OneToMany(()=>DetallesVenta, (detallesVenta)=>detallesVenta.venta)
    detalles!:DetallesVenta[]
}
