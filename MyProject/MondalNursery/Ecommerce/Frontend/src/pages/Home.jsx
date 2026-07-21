import React, { useEffect } from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'
import SummaryApi from '../common'
import { useDispatch, useSelector } from 'react-redux';
import { setCategory } from '../store/categorySlice'
import AllProductCard from '../components/AllProductCard'

const Home = () => {
  const dispatch = useDispatch()
  

  const fetchCategory = async()=>{
    const response = await fetch(SummaryApi.fetchCategory.url)
    const dataResponse = await response.json()
    // console.log("categorys", dataResponse.categories);
    
    if(response){
      dispatch(setCategory(dataResponse.categories))
    }
    
  }
  const fetchallProduct = async()=>{
    const response = await fetch(SummaryApi.fetchallProduct.url)
    const dataResponse = await response.json()
    // console.log("allProduct", dataResponse);
    
    if(response){
      dispatch(setCategory(dataResponse.categories))
    }
    
  }

  useEffect(()=>{
    fetchCategory();
    fetchallProduct();
  },[])

  return (
    <div >
      <CategoryList/>
      <BannerProduct/>

      <HorizontalCardProduct category={"Low maintenance"} heading={"Low Maintenance"}/>
      <HorizontalCardProduct category={"Medium Plants"} heading={"Medium Plants"}/>

      <VerticalCardProduct category={"Large Plants"} heading={"Large Plants"}/>
      <VerticalCardProduct category={"Plant bundle"} heading={"Plant Bundle"}/>
      <VerticalCardProduct category={"Small Plants"} heading={"Small Plants"}/>
      <VerticalCardProduct category={"Interior Plants"} heading={"Interior Plants"}/>
      <VerticalCardProduct category={"All Plants"} heading={"All Plants"}/>
      <AllProductCard category={"All Plantskfljds"} heading={"All Nursery Plants"}/>
      {/* <VerticalCardProduct category={"speakers"} heading={"Bluetooth Speakers"}/> */}
      {/* <VerticalCardProduct category={"refrigerator"} heading={"Refrigerator"}/> */}
      {/* <VerticalCardProduct category={"trimmers"} heading={"Trimmers"}/> */}
    </div>
  )
}

export default Home