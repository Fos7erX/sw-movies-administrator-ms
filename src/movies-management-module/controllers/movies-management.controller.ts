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
import { DeleteMovieDto } from '../dtos/delete-movie.dto';
import { GetMovieDetailsDto } from '../dtos/get-movie-details.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthToken as AuthTokenDecorator } from '../decorators/auth-token.decorator';
import { CreateMovieDto } from '../dtos/create-movie.dto';
import { UpdateMovieDto } from '../dtos/update-movie.dto';

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
    @Query() getMovieDetailsDto: GetMovieDetailsDto,
    @AuthTokenDecorator('authorization') authorization:string) {
    return this.moviesmanagementService.getMovieDetails(getMovieDetailsDto);
  }

  @Post('create-movie')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  createMovie(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesmanagementService.createMovie(createMovieDto);
  }

  @Put('update-movie')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateMovie(@Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesmanagementService.updateMovie(updateMovieDto);
  }

  @Delete('delete-movie')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  deleteMovie(@Query() deleteMovieDto: DeleteMovieDto) {
    return this.moviesmanagementService.deleteMovie(deleteMovieDto);
  }

  @Get('sync-movies-from-api')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  syncMoviesFromAPI() {
    return this.moviesmanagementService.syncMoviesFromAPI();
  }
}
