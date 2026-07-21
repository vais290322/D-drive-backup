import React, { useEffect, useState } from 'react'
import { FaArrowUp } from "react-icons/fa6";
const GotoTop = () => {

    const [isVisible, setIsVisible] = useState(false);

    const goToBtn=()=>{
        window.scrollTo({top:0, left:0, behavior:"smooth"});
    }

    const listToScroll=()=>{
        let heightToHidden= 200;
        const winScroll=document.body.scrollTop || document.documentElement.scrollTop;

        if(winScroll>heightToHidden){
            setIsVisible(true);
        }
        else{
            setIsVisible(false);
        }
    }

    useEffect(()=>{
        window.addEventListener("scroll", listToScroll);

        return ()=> window.removeEventListener("scroll", listToScroll);
    },[]);
  return (
    <div className='flex jusrify-center items-center'> 
        {isVisible && (
    <div className=" bg-blue-600 font-medium w-8 h-8 rounded-full fixed bottom-5 right-5 z-50 flex justify-center items-center cursor-pointer" onClick={goToBtn}>
        <button>
        <FaArrowUp className="text-white animate-bounce "/>
        </button>
      
    </div>
     )}
     </div>
    
  )
}


export default GotoTop
