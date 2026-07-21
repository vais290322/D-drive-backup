import React, { useState } from 'react'
import loginIcons from '../assest/signin.gif'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate, useParams } from 'react-router-dom';
import SummaryApi from '../common/index';
import { toast } from 'react-toastify';



const ResePassword = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassrod] = useState('');
    const navigate = useNavigate();
    const { id, token } = useParams();
    const url = `${SummaryApi.resetPassword.url}/${id}/${token}`
    // console.log("url=",url);


    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password === confirmPassword) {
            const dataResponse = await fetch(url, {
                method: SummaryApi.signIn.method,
                credentials: 'include',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ password })
            })

            const dataApi = await dataResponse.json()

            if (dataApi.success) {
                toast.success(dataApi.message)
                navigate('/login')
            }

            if (dataApi.error) {
                toast.error(dataApi.message)
            }
        }
        else{
            toast.error("Please check password and confirm password")
        }
    }


    return (
        <section id='login'>
            <div className='mx-auto container p-4'>

                <div className='bg-white p-5 w-full max-w-sm mx-auto'>
                    <div className='w-20 h-20 mx-auto'>
                        <img src={loginIcons} alt='login icons' />
                    </div>

                    <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>


                        <div>

                            <div className='bg-slate-100 p-2 flex mb-4'>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder='New Password'
                                    value={password}
                                    name='password'
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className='w-full h-full outline-none bg-transparent' />
                                <div className='cursor-pointer text-xl' onClick={() => setShowPassword((preve) => !preve)}>
                                    <span>
                                        {
                                            showPassword ? (
                                                <FaEyeSlash />
                                            )
                                                :
                                                (
                                                    <FaEye />
                                                )
                                        }
                                    </span>
                                </div>
                            </div>

                            <div className='bg-slate-100 p-2 flex mb-4'>
                                <input
                                    type="password"
                                    placeholder='Confirm New Password'
                                    value={confirmPassword}
                                    name='ConfirmPassword'
                                    onChange={(e) => setConfirmPassrod(e.target.value)}
                                    required
                                    className='w-full h-full outline-none bg-transparent' />

                            </div>

                        </div>

                        <button type='submit' className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[200px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'>Reset Password</button>

                    </form>


                </div>


            </div>
        </section>
    )
}







export default ResePassword
