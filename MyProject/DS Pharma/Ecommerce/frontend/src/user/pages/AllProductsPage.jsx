import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import LoadMoreProducts from '@/user/components/products/LoadMoreProducts';
import { SearchFilters, SortDropdown } from '@/user/components/search/SearchFilters';

const AllProductsPage = () => {
  const navigate = useNavigate();





  const handleViewAll = () => {
    // Reset URL params to remove filters
    window.location.hash = '#';
  };

  return (
    <div className="all-products-page-wrapper min-h-screen bg-gray-50/50">
      <style>{`
        .all-products-page-wrapper {
          padding-top: 30px;
          padding-bottom: 80px;
        }
        @media (min-width: 768px) {
          .all-products-page-wrapper {
            padding-top: 80px !important;
          }
        }
      `}</style>
      <div className="px-4 sm:px-6 lg:px-8" style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding:'10px' }}>
        
        {/* Header */}
        <div 
          style={{ 
            zIndex: 30, 
            backgroundColor: 'rgba(249, 250, 251, 0.95)', 
            backdropFilter: 'blur(8px)',
            paddingTop: '1rem',
            paddingBottom: '1rem',
            marginTop: '-1rem' // Compensate for padding to maintain visual flow
          }}
          className="flex flex-col md:flex-row justify-between items-start md:justify-items-center gap-4 mb-8 sticky top-[50px] sm:top-[60px] md:top-[85px]"
        >
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium p-2 rounded-lg hover:bg-gray-100"
              aria-label="Go back to previous page"
            >
              <ArrowLeft size={20} />
            </button>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                All Products
              </h1>
              <p className="text-gray-500 text-sm mt-1.5 font-medium">
                Browse our complete collection
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-8 items-start">


           {/* Load More Products Component */}
           <main className="flex-1 min-w-0 flex flex-col gap-10">
               <LoadMoreProducts initialLimit={25} initialPage={1} />
           </main>
        </div>

      </div>
    </div>
  );
};

export default AllProductsPage;