import React, { useState, useEffect } from 'react'
import { ArrowUp, ChevronUp, Phone } from 'lucide-react'

const GoToTop = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.scrollY > 150) {   // lowered threshold for better testing
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  // Scroll to top smoothly
  const scrollToTop = (e) => {
    e.stopPropagation()
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
        <button
          onClick={scrollToTop}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`

            z-50 
            fixed
            bottom-24 
            right-4 
            p-2 
            rounded-full 
            transition-all 
            duration-300 
            cursor-pointer
            backdrop-blur-md
            border
            border-white/20
            shadow-md
            ${isHovered ? 'bg-gradient-to-r from-red-500 to-pink-500 scale-110' : 'bg-blue-500 scale-100'}
          `}
          aria-label="Go to top"
        >
          {isHovered ? (
            <Phone className="w-6 h-6 text-white animate-bounce" />
          ) : (
            <ArrowUp className="w-6 h-6 text-white animate-pulse " />
          )}
        </button>
      )}
    </>
  )
}

export default GoToTop
