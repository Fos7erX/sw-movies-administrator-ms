import {
    Body,
  Controller,
  Delete,
  Get,
  Headers,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth-module/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth-module/guards/roles.guard';
import { MoviesManagementService } from '../services/movies-management.service';
import { Roles } from '../../auth-module/decorators/roles.decorator';
import { UserRole } from '../../database-module/entities/user.entity';
import { DeleteMovieRequestDto } from '../dtos/request/delete-movie-request.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthToken as AuthTokenDecorator } from '../decorators/auth-token.decorator';
import { GetMovieDetailsRequestDto } from '../dtos/request/get-movie-details-request.dto';
import { CreateMovieRequestDto } from '../dtos/request/create-movie-request.dto';
import { UpdateMovieRequestDto } from '../dtos/request/update-movie-request.dto';

@Controller('movies-management')
@ApiBearerAuth()
export class MoviesManagementController {
  constructor(
    private readonly moviesmanagementService: MoviesManagementService,
  ) {}

  @Get('get-all-movies')
  getAllMovies() {
    return this.moviesmanagementService.getAllMovies();
  }

  @Get('get-movie-details')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER) //Con esto determino que este endpoint está solamente habilitado para usuarios regulares
  getMovieDetails(
    @Query() getMovieDetailsRequestDto: GetMovieDetailsRequestDto,
    @AuthTokenDecorator('authorization') authorization:string) {
    return this.moviesmanagementService.getMovieDetails(getMovieDetailsRequestDto);
  }

  @Post('create-movie')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  createMovie(@Body() createMovieRequestDto: CreateMovieRequestDto) {
    return this.moviesmanagementService.createMovie(createMovieRequestDto);
  }

  @Put('update-movie')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateMovie(@Body() updateMovieRequestDto: UpdateMovieRequestDto) {
    return this.moviesmanagementService.updateMovie(updateMovieRequestDto);
  }

  @Delete('delete-movie')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteMovie(@Query() deleteMovieRequestDto: DeleteMovieRequestDto) {
    return this.moviesmanagementService.deleteMovie(deleteMovieRequestDto);
  }

  @Get('sync-movies-from-api')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  syncMoviesFromAPI() {
    return this.moviesmanagementService.syncMoviesFromAPI();
  }
}
