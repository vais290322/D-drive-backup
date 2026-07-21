import React from 'react'
import { Outlet } from 'react-router'
import HeaderComponent from './components/Header/HeaderComponent'
import FooterComponent from './components/Footer/FooterComponent'

const App = () => {
  return (
    <div className="min-h-screen flex flex-col pt-16">
      <HeaderComponent />
      <main className="flex-1">
        <Outlet />
      </main>
      <FooterComponent />
    </div>
  )
}

export default App