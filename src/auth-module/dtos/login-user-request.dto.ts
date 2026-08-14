import { ApiProperty } from "@nestjs/swagger";
import {IsEmail, IsNumber, IsString, IsStrongPassword, minLength} from 'class-validator';

export class LoginUserRequestDto{
    
    @ApiProperty({
        description:'email de usuario.',
        example:'homero.simpson@springfield.com'
    })
    @IsEmail()
    email!:string;

    @ApiProperty({
        description:'contraseña del usuario'
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

}