import { HttpModule, HttpService } from "@nestjs/axios";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000
    }),
  ],
  exports: [HttpModule],
})
export class ApiExternalModule {}   