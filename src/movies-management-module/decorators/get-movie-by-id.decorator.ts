import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

export function GetMovieByIdSwagger(){
    return applyDecorators(
        ApiOperation({
            summary: 'Get movie by id endpoint.',
            description: 'This endpoint returns a single movie by id, and 404 if not found.'
        })
    )
}