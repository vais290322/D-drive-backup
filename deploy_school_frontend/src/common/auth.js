// const authApi = "http://147.93.116.69:8092/api";
const authApi = "https://vaisacademy.com/service4/api";

const authUrlApi = {
    login: {
        url: `${authApi}/auth/login`,
        method: 'post'
    },
    logout: {
        url: `${authApi}/auth/logout`,
        method: 'post'
    },
    
}

export default authUrlApi;