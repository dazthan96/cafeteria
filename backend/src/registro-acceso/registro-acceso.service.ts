import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistroAcceso } from './entities/registro-acceso.entity';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class RegistroAccesoService {
    constructor(
        @InjectRepository(RegistroAcceso)
        private readonly logRepository: Repository<RegistroAcceso>
    ){}

    async registrarIngreso(
        id_usuario:number|null,
        evento:'Ingreso'|'Intento Fallido',
        ip:string,
        browser:string
    ){
        const datosLog = {
            usuario: id_usuario ? ({ id_usuario: id_usuario } as any) : null,
            evento:evento,
            ip:ip,
            browser:browser
        };
        const entidadLog = this.logRepository.create(datosLog);
        return await this.logRepository.save(entidadLog);
    }
    async registrarSalida(id_usuario:number){
        const ultimo_ingreso = await this.logRepository.findOne({
            where:{
                usuario:{id_usuario:id_usuario},
                evento:'Ingreso'
            },
            order:{fecha_ingreso:'DESC'},
        });
        if(!ultimo_ingreso){throw new NotFoundException("No se encontro sesion activa")};

        ultimo_ingreso.fecha_salida=new Date();

        return await this.logRepository.save(ultimo_ingreso)
    }
    async obtenerHistorialCompleto(){
        return await this.logRepository.find({
        relations: {usuario:true}, 
        order: {
            fecha_ingreso: 'DESC',
        },
        });
    }

}
