// const resultApi = "http://192.168.0.141:8094/api";
// const searchResultApi ="http://192.168.0.141:8085/attendance"
// const examTypeApi ="http://192.168.0.141:8084/api/v1/routine/exam-type"

// const resultApi = "http://147.93.116.69:8094/api";
// const searchResultApi ="http://147.93.116.69:8085/attendance"
// const examTypeApi ="http://147.93.116.69:8084/api/v1/routine/exam-type"
const resultApi = "https://vaisacademy.com/service6/api";
const searchResultApi ="https://vaisacademy.com/service1/attendance"
const examTypeApi ="https://vaisacademy.com/service7/api/v1/routine/exam-type"

const resultUrlApi = { 
    // for grade system 
    allGradeSystem: {
        url:`${resultApi}/grades`,  
    },

    // Mark register 
    searchStudentForMark:{
        url:`${searchResultApi}`,
    },
    markRegister:{
        url:`${resultApi}/marks-register`,
    },
    fetchExamType: {
        url:`${examTypeApi}`,
    },

    // view marks 
    viewMarks: {
        url:`${resultApi}/marks-register`,
    },

    // for Mark sheet 
    
}

export default resultUrlApi;