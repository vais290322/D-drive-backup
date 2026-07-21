
const UserbackendDomain = "/api/v1/users"
const ProductbackendDomain="/api/v1/products"

// const UserbackendDomain = "https://mern-stack-ecommerce-backend-1-nbca.onrender.com/api/v1/users"
// const ProductbackendDomain="https://mern-stack-ecommerce-backend-1-nbca.onrender.com/api/v1/products"

// http://localhost:8080/api/v1/users/register
// http://localhost:8080/api/v1/products/upload-product




const SummaryApi = {

    // user api 
    signUP : {
        url : `${UserbackendDomain}/signup`,
        method : "post"
    },

    signIn : {
        url : `${UserbackendDomain}/signin`,
        method : "post"
    },

    current_user : {
        url : `${UserbackendDomain}/user-details`,
        method : "get"
    },

    logout_user : {
        url : `${UserbackendDomain}/userLogout`,
        method : 'get'
    },

    forgotPassword : {
        url : `${UserbackendDomain}/forgot-password`,
        method : 'post'
    },

    resetPassword : {
        url : `${UserbackendDomain}/reset-password`,
        method : 'post'
    },

    saveAddress : {
        url : `${UserbackendDomain}/save-address`,
        method : 'post'
    },
    userOrders:{
        url: `${UserbackendDomain}/user-orders`,
        method: 'get'
    },

    // admin api 

    allUser : {
        url : `${UserbackendDomain}/all-user`,
        method : 'get'
    },

    updateUser : {
        url : `${UserbackendDomain}/update-user`,
        method : "post"
    },

    allOrders:{
        url:`${UserbackendDomain}/all-orders`,
        method:"get"
    },

    updateOrders:{
        url:`${UserbackendDomain}/update-order`,
        method:"post"
    },

    deleteOrder:{
        url:`${UserbackendDomain}/delete-order`,
        method:"post"
    },

    
    // user cart api 

    addToCartProduct : {
        url : `${UserbackendDomain}/addtocart`,
        method : 'post'
    },

    addToCartProductCount : {
        url : `${UserbackendDomain}/countAddToCartProduct`,
        method : 'get'
    },

    addToCartProductView : {
        url : `${UserbackendDomain}/view-card-product`,
        method : 'get'
    },

    updateCartProduct : {
        url : `${UserbackendDomain}/update-cart-product`,
        method : 'post'
    },

    deleteCartProduct : {
        url : `${UserbackendDomain}/delete-cart-product`,
        method : 'post'
    },

    createOrder:{
        url : `${UserbackendDomain}/create-order`,
        method:"post"
    },

    // for online payment 

    createRazorpayOrder : {
        url : `${UserbackendDomain}/create-payment`,
        method : 'post'
    },

    verifyRazorpayPayment : {
        url : `${UserbackendDomain}/verify-payment`,
        method : 'post'
    },

    // product api


    uploadProduct : {
        url : `${ProductbackendDomain}/upload-product`,
        method : 'post'
    },
    
    allProduct : {
        url : `${ProductbackendDomain}/get-product`,
        method : 'get'
    },
    updateProduct : {
        url : `${ProductbackendDomain}/update-product`,
        method  : 'post'
    },
    categoryProduct : {
        url : `${ProductbackendDomain}/get-categoryProduct`,
        method : 'get'
    },
    categoryWiseProduct : {
        url : `${ProductbackendDomain}/category-product`,
        method : 'post'
    },
    productDetails : {
        url : `${ProductbackendDomain}/product-details`,
        method : 'post'
    },
    searchProduct : {
        url : `${ProductbackendDomain}/search`,
        method : 'get'
    },
    filterProduct : {
        url : `${ProductbackendDomain}/filter-product`,
        method : 'post'
    }
}


export default SummaryApi