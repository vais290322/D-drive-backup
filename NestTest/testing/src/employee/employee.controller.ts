import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { EmployeeService } from "./employee.service";

@Controller('api/employee')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}

    @Get('create-table')
    async createTable() {
        return this.employeeService.createEmployeeTable();
    }

    @Post()
    async create(@Body() employee: any) {
        return this.employeeService.addEmployee(employee);
    }

    @Get()
    async findAll() {
        return this.employeeService.getAllEmployees();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.employeeService.getEmployeeById(id);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() employee: any) {
        return this.employeeService.updateEmployee(id, employee);
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        return this.employeeService.deleteEmployee(id);
    }
}
