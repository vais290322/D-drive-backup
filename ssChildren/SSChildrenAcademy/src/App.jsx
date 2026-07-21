import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Components/Pages/Home/Home'
import AboutUs from './Components/Pages/AboutUs/AboutUs'
import Academics from './Components/Pages/Academics/Academics'
import Activities from './Components/Pages/Activities/Activities'
import Admissions from './Components/Pages/Admissions/Admissions'
import Teachers from './Components/Pages/Teachers/Teachers'
import Testimonials from './Components/Pages/Testimonials/Testimonials'

function App() {
  return (
    <div className='h-screen w-full'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/abouts' element={<AboutUs />} />
        <Route path='/academics' element={<Academics />} />
        <Route path='/activities' element={<Activities />} />
        <Route path='/admissions' element={<Admissions />} />
        <Route path='/teachers' element={<Teachers />} />
        <Route path='/testimonials' element={<Testimonials />} />
      </Routes>
    </div>
  )
}

export default App