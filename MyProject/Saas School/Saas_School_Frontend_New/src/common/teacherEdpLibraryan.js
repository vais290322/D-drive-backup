// const summaryApi = "http://192.168.0.156:8089/api";
// const summaryApi = "http://147.93.116.69:8089/api";

const baseUrl= import.meta.env.VITE_REACT_SERVICE2_URL

const summaryApi = `${baseUrl}/api`;

const teacherEdpLibraryanUrlApi = {
    // add and manage teacher page 
    addTeacher: {
        url: `${summaryApi}/teachers`,
        method: "POST",
    },

    // add and manage edp page 
    addEdp: {
        url: `${summaryApi}/edp`,
    },
    addAccountant: {
        url: `${summaryApi}/accounts`,
    },
    // add and manage libraryan page
    addLibraryan: {
        url: `${summaryApi}/lib`,
    },
    fetchTeacherSummary: {
        url: `${summaryApi}/teacher-summary`,
        method: "GET",
    },

}

export default teacherEdpLibraryanUrlApi;