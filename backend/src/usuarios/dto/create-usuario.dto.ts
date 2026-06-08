import { IsNotEmpty, IsNumber, IsString, Length, MaxLength } from "class-validator";

export class CreateUsuarioDto {
    @IsNumber()
    @IsNotEmpty()
    id_usuario!:number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    username!:string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    nombre_usuario!:string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    apellido_usuario!:string;

    @IsString()
    @IsNotEmpty()
    @Length(6,255)
    contrasenia!:string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    rol!:string
}
