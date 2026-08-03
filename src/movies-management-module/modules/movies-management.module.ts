import { Module } from "@nestjs/common";
import { MoviesManagementController } from "../controllers/movies-management.controller";
import { MoviesManagementService } from "../services/movies-management.service";
import { HttpModule, HttpService } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Movie } from "../../database-module/entities/movie.entity";

@Module({
    imports:[HttpModule,
         TypeOrmModule.forFeature([Movie]),
    ],
    controllers:[MoviesManagementController],
    providers:[MoviesManagementService],
    exports:[]
})
export class MoviesManagementModule{};
