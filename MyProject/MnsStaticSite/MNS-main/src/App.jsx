import React from 'react'
import Home from './Utils/Components/Pages/Home/Home'
import { Route, Routes} from 'react-router-dom'
import About from './Utils/Components/Pages/About/About'
import Contact from './Utils/Components/Pages/Contact'
import Service from './Utils/Components/Pages/Services/Service'
import TotalSecurity from './Utils/Components/Pages/Services/TotalSecurity'
import Gallary from './Utils/Components/Pages/Gallary/Gallary'
import ElectroMechanical from './Utils/Components/Pages/Services/ElectroMechanical'
import PayrollManagement from './Utils/Components/Pages/Services/PayrollManagement'
import ElectricalPlumbingMaintainance from './Utils/Components/Pages/Services/ElectricalPlumbingMaintainance'
import FireSafety from './Utils/Components/Pages/Services/FireSafety'
import EventManagement from './Utils/Components/Pages/Services/EventManagement'
import IntegratedFacility from './Utils/Components/Pages/Services/IntegratedFacility'
import ErrorPage from './Utils/Components/Error/ErrorPage'


function App() {
  return (
    <div className='font-ubuntu'>
     <Routes>
     <Route path='*' element={<ErrorPage />} />
      <Route path='/' element={<Home />} />
      <Route path='/about' element={<About />} />
      <Route path='/gallary' element={<Gallary />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/service' element={<Service />} />
      <Route path='/total-security' element={<TotalSecurity />} />
      <Route path='/electro-mechanical' element={<ElectroMechanical />} />
      <Route path='/payroll' element={<PayrollManagement />} />
      <Route path='/electrical-plumbing' element={<ElectricalPlumbingMaintainance />} />
      <Route path='/fire-safety' element={<FireSafety />} />
      <Route path='/event-management' element={<EventManagement />} />
      <Route path='/integrated-facility' element={<IntegratedFacility />} />
     </Routes> 
    </div>
  )
}

export default App