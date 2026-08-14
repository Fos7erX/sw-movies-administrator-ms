import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMovieRequestDto {
  @ApiProperty({
    description: 'Título de la película',
    example: 'A New Hope',
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    description: 'Descripción de la película',
    example: 'The Rebel Alliance makes a risky move to steal plans…',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Director de la película',
    example: 'George Lucas',
    required: false,
  })
  @IsString()
  @IsOptional()
  director?: string;

  @ApiProperty({
    description: 'Productor de la película',
    example: 'Gary Kurtz, Rick McCallum',
    required: false,
  })
  @IsString()
  @IsOptional()
  producer?: string;

  @ApiProperty({
    description: 'Fecha de estreno',
    example: '1977-05-25',
    required: false,
  })
  @IsString()
  @IsOptional()
  releaseDate?: string;
}