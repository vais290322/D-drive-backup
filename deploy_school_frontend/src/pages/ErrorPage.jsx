import AdmitCardComponent from '@/components/ForCard/AdmitCardComponent';
import { Button } from '@/components/ui/button'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const ErrorPage = () => {
    const navigate = useNavigate();
  return (
    <div>
        <Button className="mt-4 text-5xl text-amber-600" variant="link" onClick={() => navigate("/login")}>Back to Home</Button>
        {/* <AdmitCardComponent /> */}
    </div>
  )
}

export default ErrorPage