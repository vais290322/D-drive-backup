import React, { useState } from 'react'
import loginIcons from '../assest/signin.gif'

import { Link, } from 'react-router-dom';
import SummaryApi from '../common/index';
import { toast } from 'react-toastify';


const ForgotPassword = () => {
    
    const [email,setEmail] = useState('')

    const handleSubmit = async(e) =>{
        e.preventDefault()

        const dataResponse = await fetch(SummaryApi.forgotPassword.url,{
            method : SummaryApi.signIn.method,
            credentials : 'include',
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({email})
            
        })
        // console.log(email)

        const dataApi = await dataResponse.json()
        console.log(dataApi)

        if(dataApi.success){
            toast.success(dataApi.message)
        }

        if(dataApi.error){
            toast.error(dataApi.message)
        }

    }

    
  return (
    <section id='login'>
        <div className='mx-auto container p-4'>

            <div className='bg-white p-5 w-full max-w-sm mx-auto'>
                    <div className='w-20 h-20 mx-auto'>
                        <img src={loginIcons} alt='login icons'/>
                    </div>

                    <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
                        <div className='grid'>
                            <label className='text-sm font-bold'>*Please enter your email address</label>
                            <div className='bg-slate-100 p-2 mt-6'>
                                <input 
                                    type='email' 
                                    placeholder='enter email' 
                                    name='email'
                                    value={email}
                                    onChange={(e)=>setEmail(e.target.value)}
                                    className='w-full h-full outline-none bg-transparent '/>
                            </div>
                        </div>

                        <Link to={'/login'} className='block text-sm text-slate-500 w-fit ml-auto hover:underline hover:text-red-600'>
                                Back to Login
                        </Link>
                        

                        <button type='submit' className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[200px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'>Reset Password</button>

                    </form>
            </div>


        </div>
    </section>
  )
}







export default ForgotPassword