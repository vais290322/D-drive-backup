import React from 'react'

import HeaderComponent from './components/Header/HeaderComponent'
import FooterComponent from './components/Footer/FooterComponent'
import { Outlet } from 'react-router'

const App = () => {
  return (
    <div>

      <HeaderComponent />


      <Outlet />

      {/* <FooterComponent /> */}
    </div>
  )
}

export default App