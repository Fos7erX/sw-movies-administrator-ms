import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

export function DeleteMovieSwagger(){
    return applyDecorators(
        ApiOperation({
            summary: 'Delete movie endpoint.',
            description: 'This endpoint deletes an existing movie, and throws 404 if not found.'
        })
    )
}