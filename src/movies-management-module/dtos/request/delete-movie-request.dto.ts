import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class DeleteMovieRequestDto{
    @ApiProperty({
        name: 'id',
        description: 'Id de la película',
        required:true
    })
    @IsNumber()
    id!:number;
}