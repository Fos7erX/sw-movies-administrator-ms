import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

export function CreateMoviewagger(){
    return applyDecorators(
        ApiOperation({
            summary: 'Create movie endpoint.',
            description: 'This endpoint creates a new movie.'
        })
    )
}