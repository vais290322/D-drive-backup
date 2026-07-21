import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
    {/* Animated 404 text */}
        <div className="relative mb-4 pt-10">
          <h1 className="text-[120px] sm:text-[250px] font-black text-gray-200 leading-none select-none">
            404
          </h1>
        </div>
      <div className="w-full max-w-md text-center">
        
        <div className=''>
           {/* Content */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Gyrotrope' }}>
          Oops! Page Not Found
        </h2>
        <p className="text-gray-500 mb-10 leading-relaxed" style={{ fontFamily: 'Gyrotrope' }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        </div>
       

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex items-center justify-center gap-1 px-8 py-3.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all active:scale-95"
            style={{ fontFamily: 'Gyrotrope', padding:' 2px 10px' }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span style={{ marginTop:'3px'}}>Go Back</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
            style={{ fontFamily: 'Gyrotrope', padding: '2px 10px' }}
          >
            <Home className="w-5 h-5" />
            <span style={{ marginTop:'3px'}}>Back to Home</span>
          </button>
        </div>

        {/* Quick Links / Suggestions */}
        <div className="mt-16 pt-8 border-t border-gray-100" style={{ marginTop: '20px' }}>
          <p className="text-md font-medium text-gray-400 uppercase tracking-widest mb-4">
            Try searching for products
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            {['Medicines', 'Vitamins', 'Care', 'Deals'].map((item) => (
              <button
                key={item}
                onClick={() => navigate(`/search?query=${item.toLowerCase()}`)}
                className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                style={{ fontFamily: 'Gyrotrope', padding: '2px 10px' }}
              >
                <span style={{ marginTop:'3px'}}>{item}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
