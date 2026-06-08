import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class CreateDetallesVentaDto {
    @IsNotEmpty()
    @IsNumber()
    id_producto!:number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    cantidad!:number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    precio_unitario!:number;
}
