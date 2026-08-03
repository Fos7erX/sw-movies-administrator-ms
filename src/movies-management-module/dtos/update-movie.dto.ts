import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateMovieDto {
  @ApiProperty({
    description: 'Id de la película a actualizar',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @ApiProperty({
    description: 'Título de la película actualizado',
    example: 'A New Hope',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Descripción de la película actualizada',
    example: 'The Rebel Alliance makes a risky move to steal plans…',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Director de la película actualizado',
    example: 'George Lucas',
    required: false,
  })
  @IsString()
  @IsOptional()
  director?: string;

  @ApiProperty({
    description: 'Productor de la película actualizado',
    example: 'Gary Kurtz, Rick McCallum',
    required: false,
  })
  @IsString()
  @IsOptional()
  producer?: string;

  @ApiProperty({
    description: 'Fecha de estreno actualizada',
    example: '1977-05-25',
    required: false,
  })
  @IsString()
  @IsOptional()
  releaseDate?: string;
}