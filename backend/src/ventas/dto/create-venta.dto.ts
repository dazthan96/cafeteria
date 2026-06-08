import { Type } from "class-transformer";
import { IsArray, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Length, ValidateNested } from "class-validator";
import { CreateDetallesVentaDto } from "src/detalles-venta/dto/create-detalles-venta.dto";

export class CreateVentaDto {
    @IsNotEmpty()
    @IsNumber()
    id_usuario!:number;

    @IsOptional()
    @IsNumber()
    ci_cliente?:number;

    @IsOptional()
    @IsString()
    @Length(2,50)
    razon_social?:string;

    @IsNotEmpty()
    @IsString()
    @IsIn(['efectivo', 'tarjeta'])
    metodo_pago!:string;

    @IsNotEmpty()
    @IsArray()
    detalles!:CreateDetallesVentaDto[]
}
