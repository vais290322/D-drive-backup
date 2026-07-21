// const serviceApi= "http://192.168.0.156:8081/api/services";
// const admissionApi = `http://192.168.0.156:3009`

// const serviceApi= "https://collage.vaisacademy.com/service5/api/services";
// const admissionApi = `https://collage.vaisacademy.com/service1`


const baseUrl = import.meta.env.VITE_REACT_SERVICE5_URL
const baseUrl1 = import.meta.env.VITE_REACT_SERVICE1_URL


const serviceApi= `${baseUrl}/api/services`;
const admissionApi = `${baseUrl1}`;

const serviceUrlApi = {
    getServiceApi: {
        url: `${serviceApi}/school`
    },
    putServiceApi: {
        url: `${serviceApi}/assigned`
    },
    postServiceApi: {
        url: `${serviceApi}`
    },
    deleteServiceApi: {
        url: `${serviceApi}/assigned`
    },

     schoolAdmissionServic: {
        url : `${admissionApi}/admissions`
     }


}

export default serviceUrlApi;