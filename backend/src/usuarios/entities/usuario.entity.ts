import { RegistroAcceso } from "src/registro-acceso/entities/registro-acceso.entity";
import { Venta } from "src/ventas/entities/venta.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Usuario {
    @PrimaryColumn({type:'integer'})
    id_usuario!:number;
    @OneToMany(()=>Venta,(venta)=>venta.usuario)
    ventas!:Venta[];
    
    @Column({unique:true,length:50})
    username!:string;

    @Column({length:50})
    nombre_usuario!:string;

    @Column({length:50})
    apellido_usuario!:string;

    @Column({select:false})
    contrasenia!:string;

    @Column({length:20})
    rol!:string;

    @DeleteDateColumn({type:'timestamp'})
    eliminado_en!:Date;

    @CreateDateColumn({type:'timestamp'})
    creado_en!:Date

    @OneToMany(()=>RegistroAcceso, (registro)=>registro.usuario)
    registrosAcceso!:RegistroAcceso[];
}
