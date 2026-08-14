import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class GetMovieDetailsRequestDto{
    @ApiProperty({
        name: 'id',
        description: 'Id de la película.',
        example: '1',
        selfRequired: true
    })
    @IsNumber()
    id!: number;
}