// const summaryApi = "http://192.168.0.156:8085";
// const summaryApi = "http://147.93.116.69:8085";
// const summaryApi = "https://collage.vaisacademy.com/service1";

const baseUrl = import.meta.env.VITE_REACT_SERVICE1_URL
const baseUrl1 = import.meta.env.VITE_REACT_SERVICE9_URL 
const baseUrl2 = import.meta.env.VITE_REACT_BASE_URL_LOCAL


const summaryApi = `${baseUrl}`;

// export const accountApi = "http://192.168.0.156:8099";
// export const accountApi = "http://147.93.116.69:8099";
// export const accountApi = "https://collage.vaisacademy.com/service9";

export const accountApi = `${baseUrl1}`;

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
    },

    createOrder: {
        url:`${summaryApi}/api/razorpay/create-order`,
        method: 'post'
    },
    verifyPayment: {
        url:`${summaryApi}/api/razorpay/verify-payment`,
        method: 'post'
    },

    promotionHistory:{
        url:`${summaryApi}/promotion-history`,
        method: 'post'
    },
    tcRequest: {
        url: `${summaryApi}/transfer-certificates/request`,
        method: 'post'
    },
    tcStatus: {
        url: `${summaryApi}/transfer-certificates/request-status`,
        method: 'get'
    },
    tcDetails: {
        url: `${summaryApi}/transfer-certificates`,
        method: 'get'
    },
     // for headmaster signature photo
    headmasterSignaturePhoto: {
        url: `${baseUrl2}/api/headmasterSignaturePhoto`,
        method: 'post'
    },

}

export default mainUrlApi;