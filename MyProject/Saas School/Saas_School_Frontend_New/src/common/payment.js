// const paymentApi= "http://192.168.0.156:8099/student-admission-fee";
// const paymentApi= "https://collage.vaisacademy.com/service9/student-admission-fee";

const baseUrl = import.meta.env.VITE_REACT_SERVICE9_URL

const paymentApi= `${baseUrl}/student-admission-fee`;

const paymentUrlApi = {
    getDuePaymentApi: {
        url: `${paymentApi}/previous-due`
    },
    getPaymentHistoryApi: {
        url: `${paymentApi}/by-academic-year`
    },
    // http://192.168.0.156:8099/student-admission-fee/by-academic-year
}

export default paymentUrlApi;