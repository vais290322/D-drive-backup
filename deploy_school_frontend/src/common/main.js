// const summaryApi = "http://192.168.0.141:8085";
// const summaryApi = "http://147.93.116.69:8085";
const summaryApi = "https://vaisacademy.com/service1";

const mainUrlApi ={
    // for admission page 
    admissioin :{
        url:`${summaryApi}/admissions`,
        method: 'post'
    },
    // for student info page 
    studentInfo :{
        url:`${summaryApi}/admissions`,
        method: 'post'
    },

    // for institute information page 
    instituteInfo :{
        url:`${summaryApi}/api/schools`,
        method: 'post'
    },
    // for id card page 
    searchIdCard :{
        url:`${summaryApi}`,
        method: 'post'
    },
    // for admit card page 
    searchAdmitCard :{
        url:`${summaryApi}`,
        method: 'post'
    },

    // for attendance page
    attendance :{
        url:`${summaryApi}`,
        method: 'post'
    },

    // for signup page

    signUp:{
        url:`${summaryApi}/api/signups`,
        method: 'post'
    },

    totalStudent: {
        url:`${summaryApi}/admissions/total-students`,
        method: 'post'
    }
}

export default mainUrlApi;