import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

export function GetAllMoviesSwagger(){
    return applyDecorators(
        ApiOperation({
            summary: 'Get all movies endpoint.',
            description: 'This endpoint returns all movies both from db and swapi.'
        })
    )
}