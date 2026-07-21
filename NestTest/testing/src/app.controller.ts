import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-db')
  testDB() {
    return this.appService.testConnection();
  }

  @Get('tables')
  getTables() {
    return this.appService.getAllTables();
  }

  @Get('tables-with-size')
  getTablesWithSize() {
    return this.appService.getAllTablesWithSize();
  }


}
