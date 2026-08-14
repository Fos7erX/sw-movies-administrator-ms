import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

export function UpdateMovieSwagger(){
    return applyDecorators(
        ApiOperation({
            summary: 'Update movie endpoint.',
            description: 'This endpoint updates an existing movie, and throws 404 if not found.'
        })
    )
}