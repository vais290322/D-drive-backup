const baseUrl = 'http://192.168.0.123:5000'

export const categoryUrl = {
    getAllCategories: `${baseUrl}/allcategory`,
    getPaginatedCategories: `${baseUrl}/category`,
}

export const productUrl = {
    getAllProducts: `${baseUrl}/product`,
    deleteProduct: `${baseUrl}/product`,
    addProduct: `${baseUrl}/product`,
    updateProduct: `${baseUrl}/product`,
}
