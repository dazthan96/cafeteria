import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepo: Repository<Categoria>
  ){}

  async create(createCategoriaDto: CreateCategoriaDto) {
    const categoria = this.categoriaRepo.create(createCategoriaDto);
    return await this.categoriaRepo.save(categoria);
  }

  async findAll() {
    const categorias = await this.categoriaRepo.find()
    if(!categorias){throw new NotFoundException("Si categorias disponibles")}
    return categorias;
  }

  async findOne(id: number) {
    const categoria = await this.categoriaRepo.findOne({
      where:{id_categoria:id},
      relations:{productos:true}
    })
    if(!categoria){throw new NotFoundException("La categoria no existe")}
    return categoria;
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    const categoria = await this.categoriaRepo.findOneBy({id_categoria:id})
    if(!categoria){ throw new NotFoundException("Categoria no encontrada")}
    return await this.categoriaRepo.update(id, updateCategoriaDto);
  }

  async remove(id: number) {
    const categoria = await this.categoriaRepo.findOneBy({id_categoria:id})
    if(!categoria){ throw new NotFoundException("Categoria no encontrada")}
    return await this.categoriaRepo.softDelete(id);
  }
}
