import { IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, Min } from "class-validator";

export class CreateProductoDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nombre!:string;

    @IsString()
    @MaxLength(100)
    descripcion!:string;

    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    precio_venta!:number;

    @IsInt()
    @IsNotEmpty()
    id_categoria!:number
}
