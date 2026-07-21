const BASE_AVI=import.meta.env.VITE_BASE_URL_D
const BASE_KARFA=import.meta.env.VITE_BASE_URL_S
const BASE_RAHUL=import.meta.env.VITE_BASE_URL_R
const BASE_NEEL=import.meta.env.VITE_BASE_URL_N1

const urls={
    getAllInventoryURL: `${BASE_AVI}/api/v1/inventory/all-inventory-current-items`,
    createInvoiceURL: `${BASE_RAHUL}/api/v1/mns/bill/create`,
    getAllInvoicesUrl:`${BASE_RAHUL}/api/v1/mns/bill`,
    createTaxUrl:`${BASE_RAHUL}/api/v1/bills/tax`,
    allTaxUrl:`${BASE_RAHUL}/api/v1/bills/all`,
    updateDateUrl:`${BASE_RAHUL}/api/v1/bills/update`,
    updatActiveUrl:`${BASE_RAHUL}/api/v1/bills/activated`,
    deleteUrl:`${BASE_RAHUL}/api/v1/bills/delete`,
    creatCouponUrl:`${BASE_RAHUL}/api/v1/coupons/create`,
    getAllCoupon:`${BASE_RAHUL}/api/v1/coupons`,
    deleteCouponUrl:`${BASE_RAHUL}/api/v1/coupons/delete`,
    getEmployeeUrl:`${BASE_NEEL}/api/employees/search?email=`,
    createResourceUrl:`${BASE_RAHUL}/api/v1/resources/create`,
    getResourceUrl:`${BASE_RAHUL}/api/v1/resources/view`,
    deleteResourceUrl:`${BASE_RAHUL}/api/v1/resources/delete`,
    updateResourceUrl:`${BASE_RAHUL}/api/v1/resources/update`,
    getAllCustomerUrl:`${BASE_RAHUL}/api/v1/mns/crm`,
    createCustomerUrl:`${BASE_RAHUL}/api/v1/mns/crm/create`,
    deleteCustomerUrl:`${BASE_RAHUL}/api/v1/mns/crm/delete`,
    updateCustomerUrl:`${BASE_RAHUL}/api/v1/mns/crm/update`


}

export default urls;


// console.log(urls.deleteCouponUrl)