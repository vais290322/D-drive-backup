import { createSlice } from "@reduxjs/toolkit"

const initialState={
    employees:[],
    loading:false,
    error:null
}

const employeeSlice=createSlice({
    name:'employee',
    initialState,
    reducers:{
        setEmployees:(state,action)=>{
           state.employees=action.payload
        },
        addEmployee:(state,action)=>{
            state.employees.push(action.payload);
            state.loading=false;
        },
        updateEmployee: (state, action) => {
            const updatedEmployee = action.payload;
            const index = state.employees.findIndex(employee => employee.id === updatedEmployee.id);

            if (index !== -1) {
                state.employees[index] = updatedEmployee;
            }
            state.loading = false;
        },
        setLoading:(state)=>{
             state.loading=true;
        },
        setError:(state,action)=>{
            state.error=action.payload;
            state.loading=false
        },
        clearError:(state)=>{
            state.error=null

        }
    }

});
export const {setEmployees,addEmployee,setLoading,setError,clearError,updateEmployee}=employeeSlice.actions;
export default employeeSlice.reducer;