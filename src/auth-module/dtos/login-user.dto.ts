import { ApiProperty } from "@nestjs/swagger";
import {IsNumber, IsString, IsStrongPassword, minLength} from 'class-validator';

export class LoginUserDto{
    
    @ApiProperty({
        description:'email de usuario.',
        example:'homero.simpson@springfield.com'
    })
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