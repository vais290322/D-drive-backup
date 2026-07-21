import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useTheme } from '../../context/ThemeContext'
import busImage from '../../assets/bus.jpg'
import { motion, useAnimation } from 'framer-motion' // Add useAnimation import

const ErrorPage = () => {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const controls = useAnimation()
  const [leaves, setLeaves] = useState([])

  // Generate random leaves/particles for wind effect
  useEffect(() => {
    const newLeaves = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 10 + 5,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }))
    setLeaves(newLeaves)
  }, [])

  // Continuous animation for the 404 text
  useEffect(() => {
    const startAnimation = async () => {
      while (true) {
        await controls.start({
          y: [0, -10, 0],
          rotate: [0, 2, 0, -2, 0],
          transition: { duration: 5, ease: "easeInOut" }
        })
      }
    }
    
    startAnimation()
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Full background image with overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${busImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Wind effect particles */}
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute z-10 rounded-full bg-white/30"
          style={{
            width: `${leaf.size}px`,
            height: `${leaf.size}px`,
            top: `${leaf.y}%`,
            left: `-5%`,
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
          }}
          animate={{
            x: ['0vw', '105vw'],
            y: [`${leaf.y}%`, `${leaf.y + (Math.random() * 20 - 10)}%`],
            opacity: [0, 1, 1, 0],
            rotate: [0, 360 * Math.round(Math.random() * 3 + 1)]
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
      
      {/* Content container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 max-w-md w-full flex flex-col items-center text-center space-y-8 p-8 bg-white/10 rounded-xl shadow-2xl border border-white/20"
      >
        {/* Error code with continuous animation */}
        <motion.h1 
          animate={controls}
          className="text-9xl font-extrabold tracking-tighter text-white drop-shadow-lg"
        >
          404
        </motion.h1>
        
        {/* Improved message */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white drop-shadow-md">Oops! Page not found</h2>
          <p className="text-white/90 text-lg">
            The page you're looking for seems to have taken a different route.
          </p>
        </div>

        {/* Enhanced action button with continuous animation */}
        <div className="w-full mt-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              boxShadow: ['0px 0px 8px rgba(255,255,255,0.3)', '0px 0px 16px rgba(255,255,255,0.6)', '0px 0px 8px rgba(255,255,255,0.3)'] 
            }}
            transition={{ 
              boxShadow: { 
                repeat: Infinity, 
                duration: 2 
              } 
            }}
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-6 py-3 rounded-full cursor-pointer bg-white text-gray-900 font-medium transition-all hover:bg-white/90 shadow-lg"
          >
            Back to home
          </motion.button>
        </div>
      </motion.div>
      
      {/* Decorative elements with subtle animation */}
      <motion.div 
        className="absolute bottom-4 left-4 text-white/70 text-sm z-10"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        © {new Date().getFullYear()} Your Company
      </motion.div>
    </div>
  )
}

export default ErrorPage