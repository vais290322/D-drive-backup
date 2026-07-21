import React from 'react'
import Navbar from '../../navbar'
import Hero from './Hero'
import Next2 from './Next2'
import Next3 from './Next3'
import Next4 from './Next4'
import Next5 from './Next5'
import Next6 from './Next6'
import Next1 from './next1'
import Next7 from './next7'
import Footer from '../../footer'

const Home = () => {
  return (
    <div className="w-full h-screen">
      <Navbar />
        <Hero />
        <Next1 />
        <Next2 />
        <Next3 />
        <Next4 />
        <Next5 />
        <Next6 />
        <Next7 />
        <Footer />
    </div>
  )
}

export default Home