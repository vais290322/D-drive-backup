
import './App.css';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import SummaryApi from './common/index';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';
import GotoTop from './components/GotoTop';

function App() {
  const dispatch = useDispatch()
  const [cartProductCount,setCartProductCount] = useState(0)
  const location=useLocation();
  const noFooterPaths = ['/checkout',];

  const fetchUserDetails = async()=>{
      const dataResponse = await fetch(SummaryApi.current_user.url,{
        method : SummaryApi.current_user.method,
        credentials : 'include'
      })

      const dataApi = await dataResponse.json()

      if(dataApi.success){
        dispatch(setUserDetails(dataApi.data))
      }
  }

  const fetchUserAddToCart = async()=>{
    const dataResponse = await fetch(SummaryApi.addToCartProductCount.url,{
      method : SummaryApi.addToCartProductCount.method,
      credentials : 'include'
    })

    const dataApi = await dataResponse.json()
    // console.log("dataApi",dataApi.data)

    setCartProductCount(dataApi?.data)
  }

  useEffect(()=>{
    /**user Details */
    fetchUserDetails()
    /**user Details cart product */
    fetchUserAddToCart()

  },[])
  return (
    <>
      <Context.Provider value={{
          fetchUserDetails, // user detail fetch 
          cartProductCount, // current user add to cart product count,
          fetchUserAddToCart
      }}>
        <ToastContainer 
          position='top-center'
        />
        
        {/* <Header/> */}
        {!noFooterPaths.includes(location.pathname) && <Header />} 
        <main className='min-h-[calc(100vh-120px)] pt-16 '>
          <Outlet/>
        </main>
        {!noFooterPaths.includes(location.pathname) && <Footer />} 
        <GotoTop/>
      </Context.Provider>
    </>
  );
}

export default App;