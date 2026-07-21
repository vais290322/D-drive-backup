import React, { useState, useEffect } from 'react'
import { FaArrowUp } from 'react-icons/fa'
import { FaScissors } from "react-icons/fa6";

const ScrollToTopComponent = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)
    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  return (
    <>
      {isVisible && (
        <div
          onClick={scrollToTop}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            fixed bottom-8 right-8
            w-12 h-12
            flex items-center justify-center
            rounded-full
            bg-[#F4A492] hover:bg-[#f3917b]
            text-white
            cursor-pointer
            transition-all duration-300
            transform hover:scale-110
            shadow-lg
            z-50
          `}
        >
          {isHovered ? (
            <FaScissors className="text-2xl animate-bounce" />
          ) : (
            <FaArrowUp className="text-2xl animate-bounce " />
          )}
        </div>
      )}
    </>
  )
}

export default ScrollToTopComponent