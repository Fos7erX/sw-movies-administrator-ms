import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

export function UserLoginSwagger(){
    return applyDecorators(
        ApiOperation({
            summary: 'User login endpoint.',
            description: 'This endpoint logs in an existing user on DB.'
        })
    )
}