import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo:Repository<Usuario>,
  ){}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const {id_usuario, username, contrasenia} = createUsuarioDto;
    const existe_id = await this.usuarioRepo.findOne({where:{id_usuario:id_usuario}})
    if(existe_id) {throw new BadRequestException("El numero de carnet ya esta registrado")}

    const existe_username = await this.usuarioRepo.findOne({where:{username:username}})
    if(existe_username) {throw new BadRequestException("El nombre de usuario ya existe")}

    const salt = await bcrypt.genSalt(10);
    const hashContrasenia = await bcrypt.hash(contrasenia, salt);

    const nuevo_usuario = this.usuarioRepo.create({
      ...createUsuarioDto,
      contrasenia:hashContrasenia,
    })
    return await this.usuarioRepo.save(nuevo_usuario);
  }

  async findAll() {
    return await this.usuarioRepo.find();
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepo.findOne({where:{id_usuario:id}})
    if(!usuario) {throw new NotFoundException("Usuario no encontrado o inactivo")}
    return usuario;
  }

    // ACTUALIZAR DATOS Y CONTRASEÑA DE UN USUARIO EXISTENTE
  async update(id: number, body: any) {
    const usuario = await this.usuarioRepo.findOne({ where: { id_usuario: id } });
    if (!usuario) {
      throw new NotFoundException(`El usuario con ID ${id} no existe`);
    }

    usuario.username = body.username;
    usuario.nombre_usuario = body.nombre_usuario;
    usuario.apellido_usuario = body.apellido_usuario;
    usuario.rol = body.rol;

    // Si el administrador escribió una nueva contraseña, la encriptamos antes de guardar
    if (body.contrasenia) {
      const salt = await bcrypt.genSalt(10);
      usuario.contrasenia = await bcrypt.hash(body.contrasenia, salt);
    }

    return await this.usuarioRepo.save(usuario);
  }


  async remove(id: number) {
    const usuario = await this.usuarioRepo.findOne({where:{id_usuario:id}})
    if(!usuario) {throw new NotFoundException("Usuario no encontrado")}
    return await this.usuarioRepo.softDelete(id);
  }
}
