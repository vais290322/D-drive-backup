const summaryApi = "http://192.168.0.141:8089/api";
// const summaryApi = "http://147.93.116.69:8089/api";
// const summaryApi = "https://vaisacademy.com/service2/api";

const teacherEdpLibraryanUrlApi ={
    // add and manage teacher page 
    addTeacher: {
        url: `${summaryApi}/teachers`,
        method: "POST",
    },

    // add and manage edp page 
    addEdp:{
        url:`${summaryApi}/edp`,
    },
    // add and manage libraryan page
    addLibraryan:{
        url:`${summaryApi}/lib`,
    },
}

export default teacherEdpLibraryanUrlApi;