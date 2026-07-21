import SummaryApi from "../common/index"
import { toast } from 'react-toastify'

const addToCart = async(e,id) =>{
    e?.stopPropagation()
    e?.preventDefault()
    console.log("id",id)

    const response = await fetch(SummaryApi.addToCartProduct.url,{
        method : SummaryApi.addToCartProduct.method,
        credentials : 'include',
        headers : {
            "content-type" : 'application/json'
        },
        body : JSON.stringify(
            { productId : id }
        )
    })

    const responseData = await response.json()
    console.log("responseData",responseData)

    if(responseData.success){
        toast.success(responseData.message)
    }

    if(responseData.error){
        toast.error(responseData.message)
        // toast.error("Product already added to cart12")
    }


    return responseData

}


export default addToCart