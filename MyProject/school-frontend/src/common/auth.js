// const authApi = "http://147.93.116.69:8092/api";
const authApi = "http://192.168.0.141:8092/api";
// const authApi = "https://vaisacademy.com/service4/api";

// for reset password page
// https://vaisacademy.com/service4/api/auth/forgot-password

// for create password page
// https://vaisacademy.com/service4/api/auth/reset-password?token=029b2a99-856f-4424-831b-d722fbf063f2

const authUrlApi = {
    login: {
        url: `${authApi}/auth/login`,
        method: 'post'
    },
    logout: {
        url: `${authApi}/auth/logout`,
        method: 'post'
    },
    forgotPassword: {
        url: `${authApi}/auth/forgot-password`,
        method: 'post'
    },
    resetPassword: {
        url: `${authApi}/auth/reset-password`,
        method: 'post'
    },
    
}

export default authUrlApi;