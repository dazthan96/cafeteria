import { IsNotEmpty, IsString, Length } from "class-validator";

export class UpdatePasswordDTO{
    @IsNotEmpty()
    @IsString()
    @Length(6,255)
    nueva_contrasenia!:string
}