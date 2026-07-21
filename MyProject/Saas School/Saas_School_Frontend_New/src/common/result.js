// const resultApi = "http://192.168.0.156:8094/api";
// const searchResultApi ="http://192.168.0.156:3009"
// const examTypeApi ="http://192.168.0.156:8084"

// const resultApi = "http://147.93.116.69:8094/api";
// const searchResultApi ="http://147.93.116.69:8085/attendance"
// const examTypeApi ="http://147.93.116.69:8084"

// const resultApi = "https://collage.vaisacademy.com/service6/api";
// const searchResultApi ="https://collage.vaisacademy.com/service1/attendance"
// const searchResultApi1 ="https://collage.vaisacademy.com/service1"
// const examTypeApi ="https://collage.vaisacademy.com/service7"


const baseUrl = import.meta.env.VITE_REACT_SERVICE6_URL
const baseUrl1 = import.meta.env.VITE_REACT_SERVICE1_URL
const baseUrl2 = import.meta.env.VITE_REACT_SERVICE7_URL
const resultDateBaseUrl = import.meta.env.VITE_REACT_RESULT_DATE_API;


const resultApi = `${baseUrl}/api`;
const searchResultApi =`${baseUrl1}/attendance`
const searchResultApi1 =`${baseUrl1}`
const examTypeApi =`${baseUrl2}`;

const resultUrlApi = { 
    // for grade system 
    allGradeSystem: {
        url:`${resultApi}/grades`,  
    },

    // Mark register 
    searchStudentForMark:{
        url:`${searchResultApi}`,
    },
    searchStudentForMark1:{
        url:`${searchResultApi1}`,
    },
    markRegister:{
        url:`${resultApi}/marks-register`,
    },
    fetchExamType: {
        url:`${examTypeApi}/api/v1/routine/exam-type`,
    },

    // view marks 
    viewMarks: {
        url:`${resultApi}/marks-register`,
    },

    deleteExamRoutine:{
        url:`${examTypeApi}/api/exam-routines`,
    },
    
    

    // for Mark sheet 
    
    // Result Date
    resultDate: {
        create: { url: `${resultDateBaseUrl}/create` },
        update: { url: `${resultDateBaseUrl}/update` },
        delete: { url: `${resultDateBaseUrl}/delete` },
        getAll: { url: `${resultDateBaseUrl}/getAll` },
        search: { url: `${resultDateBaseUrl}/search` },
    }
}

export default resultUrlApi;