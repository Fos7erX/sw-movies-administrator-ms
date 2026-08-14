import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

export function CreateUserSwagger(){
    return applyDecorators(
        ApiOperation({
            summary: 'User register endpoint.',
            description: 'This endpoint registers a new user on DB.'
        })
    )
}