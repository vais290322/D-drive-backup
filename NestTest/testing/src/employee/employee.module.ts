import { Module } from "@nestjs/common";
import { EmployeeController } from "./employee.controller";
import { EmployeeService } from "./employee.service";
import { databaseProvider } from "src/db/database.provider";



@Module({
    imports: [],
    controllers: [EmployeeController],
    providers: [EmployeeService,databaseProvider],
    exports: [EmployeeService],
})
export class EmployeeModule {}