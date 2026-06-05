import { Producto } from "src/productos/entities/producto.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Categoria {

    @PrimaryGeneratedColumn()
    id_categoria!:number;

    @Column({unique:true, length:50})
    nombre!:string;

    @OneToMany(()=>Producto, (producto)=>producto.categoria)
    productos!:Producto[];
}

