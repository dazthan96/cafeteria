import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RegistroAcceso{
    @PrimaryGeneratedColumn()
    id_registros!:number;

    @ManyToOne(()=>Usuario, (usuario) =>usuario.registrosAcceso)
    @JoinColumn({name:"id_usuario"})
    usuario!:Usuario;

    @Column({length:50})
    evento!:string;

    @Column({length:45})
    ip!:string;

    @Column({type:"text"})
    browser!:string;

    @CreateDateColumn({type:'timestamp'})
    fecha_ingreso!:Date;

    @Column({type:'timestamp', nullable:true})
    fecha_salida?:Date
}