import React, { useEffect, useState } from 'react'
import { FaArrowUp, FaLeaf } from "react-icons/fa";

const GotoTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const goToBtn = () => {
        window.scrollTo({top: 0, left: 0, behavior: "smooth"});
    }

    const listToScroll = () => {
        let heightToHidden = 200;
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;

        if(winScroll > heightToHidden) {
            setIsVisible(true);
        }
        else {
            setIsVisible(false);
        }
    }

    useEffect(() => {
        window.addEventListener("scroll", listToScroll);
        return () => window.removeEventListener("scroll", listToScroll);
    }, []);

    return (
        <div className='relative'> 
            {isVisible && (
                <button 
                    onClick={goToBtn}
                    className="fixed bottom-8 right-6 z-50 bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-white w-10 h-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group overflow-hidden"
                    aria-label="Scroll to top"
                >
                    <div className="absolute inset-0 bg-yellow-500 transition-transform duration-300 transform translate-y-full group-hover:translate-y-0"></div>
                    <FaArrowUp className="text-white text-lg relative z-10" />
                    <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <FaLeaf className="text-white text-lg" />
                    </span>
                </button>
            )}
        </div>
    )
}

export default GotoTop
