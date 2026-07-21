// const routineApi = "http://192.168.0.141:8084/api";
// const routineApi = "http://147.93.116.69:8084/api";
const routineApi = "https://collage.vaisacademy.com/service7/api";

// export const teacherRoutine ="http://192.168.0.141:8084";
// export const teacherRoutine ="http://147.93.116.69:8084";
export const teacherRoutine ="https://collage.vaisacademy.com/service7";

const routineUrlApi = {
    // for class  routine
    getRoutine: {
        url: `${routineApi}/v1/routine`,
        method: "get", // for get and post , put, delete 
    },

    // for class time 
    getClassTime: {
        url: `${routineApi}/v1/routine/class-time`,
        method: "get", // for get and post , put, delete 
    },

    // exam routine 
    getExamRoutine: {
        url: `${routineApi}/exam-routines`,
        method: "get", // for get and post , put, delete 
    },
    addExamRoutine : {
        url: `${routineApi}/exam-routines`,
        method: "post", // for get and post , put, delete 
    },

    // exam type page 
    getExamType: {
        url: `${routineApi}/v1/routine/exam-type`,
        method: "get", // for get and post , put, delete 
    },


    // add event page 
    addEvent: {
        url: `${routineApi}/notifications`,
        method: "post", // for get and post , put, delete 
    },
    generateEventPdf: {
        url: `${routineApi}/generate-pdf`, // {id}
        method: "post", // for get and post , put, delete 
    },
}

export default routineUrlApi