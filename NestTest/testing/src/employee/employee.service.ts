import { Inject, Injectable } from "@nestjs/common";
import {Pool} from 'pg';
import { apiResponse } from "src/common/api-response";

@Injectable()

export class EmployeeService {
    constructor(@Inject('PG_CONNECTION') private pool:Pool){
    }


    // create employee table if not exists
    async createEmployeeTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS employee (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(255) NOT NULL,
                role VARCHAR(255) NOT NULL,
                age INT NOT NULL,
                salary DECIMAL(10,2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await this.pool.query(query);
    }

    // add employee
    async addEmployee(employee: any) {
        const query = `
            INSERT INTO employee (name, email, phone, role, age, salary)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        if(!employee.name || !employee.email || !employee.phone || !employee.role || !employee.age || !employee.salary){
           return apiResponse(false, 400, 'All fields are required', null);
        }
        await this.pool.query(query, [employee.name, employee.email, employee.phone, employee.role, employee.age, employee.salary]);
        return apiResponse(true, 201, 'Employee added successfully', null);
    }

    // get all employees
    async getAllEmployees(){
        const result = await this.pool.query('select * from employee order by id desc')
        if(result.rows.length === 0){
            return apiResponse(true, 200, 'No employee found', []);
        }
        return apiResponse(true, 200, 'Employee fetched successfully', result.rows);
    }

    // get employee by id
    async getEmployeeById(id: number){
        if(id === null || id === undefined){
          return apiResponse(false, 400, 'Employee id is required', null);
        }
        const result = await this.pool.query('select * from employee where id = $1', [id])
        if(result.rows.length === 0){
            return apiResponse(false, 404, 'Employee not found', null);
        }
        return apiResponse(true, 200, 'Employee fetched successfully', result.rows[0]);
    }

    // update employee
    async updateEmployee(id: number, employee: any){
        if(id === null || id === undefined){
          return apiResponse(false, 400, 'Employee id is required', null);
        }
        if(employee.name === '' || employee.email === '' || employee.phone === '' || employee.role === '' || employee.age === '' || employee.salary === ''){
          return apiResponse(false, 400, 'All fields are required', null);
        }
        const query = `
            UPDATE employee
            SET name = $1, email = $2, phone = $3, role = $4, age = $5, salary = $6
            WHERE id = $7
        `;
        await this.pool.query(query, [employee.name, employee.email, employee.phone, employee.role, employee.age, employee.salary, id]);

        return apiResponse(true, 200, 'Employee updated successfully', null);
    }

    // delete employee
    async deleteEmployee(id: number){
        if(id === null || id === undefined){
          return apiResponse(false, 400, 'Employee id is required', null);
        }
        await this.pool.query('delete from employee where id = $1', [id])
       
        return apiResponse(true, 200, 'Employee deleted successfully', null);
    }



}
