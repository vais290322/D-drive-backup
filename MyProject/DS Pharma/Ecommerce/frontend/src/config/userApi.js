const config = {
    userProfileBaseUrl: `${import.meta.env.VITE_URL}/user`,
    userUpdateBaseUrl: `${import.meta.env.VITE_URL}/updateuser`,
    userAddressBaseUrl: `${import.meta.env.VITE_URL}/address`,
    setAddressBaseUrl: `${import.meta.env.VITE_URL}/setaddress`,
    orderBaseUrl: `${import.meta.env.VITE_URL}/userorder`,
    cartBaseUrl: `${import.meta.env.VITE_URL}`,
    searchProductsBaseUrl: `${import.meta.env.VITE_MEDIA_CLOUD_BASE_URL}/api/v1/products`,
};

export const userProfileUrl = {
    getUserProfile: `${config.userProfileBaseUrl}`,
    updateUserProfile: `${config.userUpdateBaseUrl}`,
};

export const paymentUrl = {
    createPayment: `${config.cartBaseUrl}/payment`,
    verifyPayment: `${config.cartBaseUrl}/verify`,
}
export const userAddressUrl = {
    getAllAddresses: `${config.userAddressBaseUrl}`,
    addAddress: `${config.userAddressBaseUrl}`,
    updateAddress: (id) => `${config.userAddressBaseUrl}/${id}`,
    deleteAddress: (id) => `${config.userAddressBaseUrl}/${id}`,
    setDefaultAddress: (id) => `${config.setAddressBaseUrl}/${id}`,
};

export const dashboardUrl = {
    getDashboard: `${config.cartBaseUrl}/totals`,
}
export const customerUrl = {
    getCustomers: `${config.cartBaseUrl}/getadmincustomer`,
}
export const adminOrderUrl = {
    getAllOrders: `${config.cartBaseUrl}/getallorder`,
    updateOrderStatus: `${config.cartBaseUrl}/orderstatusupdate`,
};
export const userOrderUrl = {
    getAllOrders: `${config.orderBaseUrl}`,
};
//for order
export const cartUrl = {
    checkout: `${config.cartBaseUrl}/addorder`,
    getCart: `${config.cartBaseUrl}/cartget`,
    updateCart: `${config.cartBaseUrl}/cartupdate`,
    removeFromCart: `${config.cartBaseUrl}/cartdelete`,
};

export const searchUrl = {
    searchProducts: `${config.searchProductsBaseUrl}`,
}

// export const wishlistUrl ={
//     addToWishlist: `${config.cartBaseUrl}/addwishlist`,
//     removeFromWishlist: `${config.cartBaseUrl}/deletewishlist`,
//     getWishlist: `${config.cartBaseUrl}/getwishlist`,
// }