import './App.css'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'

import { BreadcrumbProvider } from './context/BreadCrumbContext'

function App() {


  return (
    <>
     
        <BreadcrumbProvider>
          <main>
            <Outlet />
            <Toaster position='top-right' />
          </main>
        </BreadcrumbProvider>
      

    </>
  )
}

export default App
