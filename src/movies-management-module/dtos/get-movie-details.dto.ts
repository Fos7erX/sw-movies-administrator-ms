import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class GetMovieDetailsDto{
    @ApiProperty({
        name: 'id',
        description: 'Id de la película.',
        example: '1',
        selfRequired: true
    })
    @IsNumber()
    id!: number;
}