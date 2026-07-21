// const academicApi = "http://192.168.0.141:8081/api/v1/Academic";
// const academicApi = "http://147.93.116.69:8081/api/v1/Academic";
const academicApi = "https://vaisacademy.com/service5/api/v1/Academic";

const academicUrlApi = { 
        //  for class  
    getAllClass:{
        url:`${academicApi}/classes`,
        method:"get" // for get and post , put, delete addnew class and fetch all class
    },
    
    // for section
    getAllSection: {
        url:`${academicApi}/sections`,
       
    },
    
    // for subject
    getAllSubject: {
        url:`${academicApi}/subjects`,
       
    },
    
    // for subject assign
    SubjectAssign: {
        url:`${academicApi}/subject-assign`,
        
    },
    
    // for class room 
    getAllClassRoom: {
        url:`${academicApi}/class-room`,
        
    },
    
}

export {academicUrlApi};