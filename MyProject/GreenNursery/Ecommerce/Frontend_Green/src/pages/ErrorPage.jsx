import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaLeaf, FaHome, FaSadTear } from 'react-icons/fa'

const ErrorPage = () => {
    const navigate = useNavigate()
    
    return (
        <div className="bg-gradient-to-b from-emerald-50 to-white min-h-screen flex justify-center items-center">
            <div className="relative overflow-hidden bg-white rounded-lg shadow-xl p-8 md:p-12 max-w-2xl w-full mx-4">
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-100 rounded-full opacity-50 z-0"></div>
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-emerald-200 rounded-full opacity-40 z-0"></div>
                
                <div className="relative z-10 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="text-9xl font-extrabold text-emerald-800 opacity-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                404
                            </div>
                            <FaSadTear className="text-8xl text-emerald-600 relative z-10" />
                        </div>
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl font-bold text-emerald-800 mb-4">Oops!</h1>
                    <h2 className="text-2xl md:text-3xl font-semibold text-emerald-600 mb-6">Page Not Found</h2>
                    
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        The page you are looking for might have been removed, had its name changed, 
                        or is temporarily unavailable.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            onClick={() => navigate("/")} 
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow flex items-center justify-center gap-2"
                        >
                            <FaHome size={16} />
                            Back to Home
                        </button>
                        
                        <button 
                            onClick={() => navigate("/product-category")} 
                            className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-medium px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <FaLeaf size={16} />
                            Browse Products
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ErrorPage
