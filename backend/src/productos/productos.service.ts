import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';
import { Categoria } from 'src/categorias/entities/categoria.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepo:Repository<Producto>,

    @InjectRepository(Categoria)
    private readonly categoriaRepo:Repository<Categoria>
  ){}

  async create(createProductoDto: CreateProductoDto) {
    const categoria = await this.categoriaRepo.findOneBy({
      id_categoria: createProductoDto.id_categoria
    })
    if(!categoria){throw new NotFoundException("La categoria no existe")};
    const producto = await this.productoRepo.create({
      ...createProductoDto,categoria:categoria
    })
    return await this.productoRepo.save(producto);
  }

  async findAll() {
    return await this.productoRepo.find({
      relations:{categoria:true}
    });
  }

  async findOne(id: number) {
    const producto = await this.productoRepo.findOne({
      where:{id_producto:id},
      relations:{categoria:true}
    })
    if(!producto){throw new NotFoundException("Producto no encontrado")}
    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    const producto = await this.productoRepo.findOneBy({id_producto:id})
    if(!producto){throw new NotFoundException("Producto no encontrado")}
    
    const categoria = await this.categoriaRepo.findOneBy({id_categoria:updateProductoDto.id_categoria})
    if(!categoria){throw new NotFoundException("Categoria no encontrado")}
    const producto_actualizado = Object.assign(producto, updateProductoDto)
    return await this.productoRepo.save(producto_actualizado)
  }

  async remove(id: number) {
    return await this.productoRepo.softDelete(id);
  }
}
