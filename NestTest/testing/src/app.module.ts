import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import { databaseProvider } from './db/database.provider';
import { EmployeeModule } from './employee/employee.module';


@Module({
  imports: [EmployeeModule],
  controllers: [AppController],
  providers: [AppService, databaseProvider],
})

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes it available everywhere
    }),
  ],
})
export class AppModule {}
