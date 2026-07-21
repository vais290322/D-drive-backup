import React from 'react'
import { Button } from './components/ui/button'
import HeaderComponent from './components/Header/HeaderComponent'
import FooterComponent from './components/Footer/FooterComponent'
import { Outlet } from 'react-router'

const App = () => {
  return (
    <div>
      
      <HeaderComponent />

      <Button variant="default" className="bg-red-600 font-bold hover:bg-amber-600 text-gren-600 h-96 " >Click me </Button>
      <Outlet />

      <FooterComponent />
    </div>
  )
}

export default App