// const settingApi = "http://192.168.0.156:8090/api";
// const settingApi = "http://147.93.116.69:8090/api";
// const settingApi = "https://collage.vaisacademy.com/service3/api";

const baseUrl = import.meta.env.VITE_REACT_SERVICE3_URL

const settingApi = `${baseUrl}/api`;

const settingUrlApi ={
    // for blood group 
    getAllBloodGroup: {
        url: `${settingApi}/bloodgroups`
    },
    // for gender page 
    getAllGender: {
        url:`${settingApi}/genders`
    },
    // for religion page 
    getAllReligion:{
        url:`${settingApi}/religions`
    }
}

export default settingUrlApi;