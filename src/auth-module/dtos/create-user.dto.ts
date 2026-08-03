import { ApiProperty } from "@nestjs/swagger";
import {IsEnum, IsNotEmpty, IsNumber, IsString, IsStrongPassword, minLength} from 'class-validator';
import { UserRole } from "../../database-module/entities/user.entity";


//Notas para documentación:
//Establecemos el símbolo "!" a continuación de la variable para
//establecer que las variables no serán null, también podría ponerse
// el símbolo "?" para indicar que el valor puede ser nulo, o definir un
//valor de ejemplo como un empty string en los strings, o 0 en los numbers
export class CreateUserDto{
    @IsNumber()
    id!: number;

    @ApiProperty({
        description: 'Nombre de usuario.',
        example: 'Homero'
    })
    @IsString()
    name!:string;

    @ApiProperty({
        description:'Email de usuario.',
        example:'homero.simpson@springfield.com'
    })
    email!:string;

    @ApiProperty({
        description:'Contraseña del usuario'
    })
    @IsString()
    @IsStrongPassword({
        minLength:9,
        minLowercase:1,
        minUppercase:1,
        minNumbers:1,
        minSymbols:1
    })
    password!:string;

    @ApiProperty({
        name:'role',
        description:'Rol del usuario, puede ser "user" o "admin".',
        example:'user',
    })//Con este decorador voy a definir que el rol puede ser user o admin
    @IsNotEmpty()
    role!: UserRole;
}