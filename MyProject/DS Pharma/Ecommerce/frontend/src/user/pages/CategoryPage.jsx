import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Package, ArrowRight } from 'lucide-react';

const apiurl = import.meta.env.VITE_MEDIA_CLOUD_BASE_URL;

const CategoryPage = () => {
    const [allCategory, setAllCategory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const getAllCategory = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiurl}/api/v1/categories`);
            setAllCategory(response.data?.data?.categories || []);
            setError(null);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Failed to load categories. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllCategory();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white pt-24">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
                        <LayoutGrid className="absolute inset-0 m-auto text-primary-600 animate-pulse" size={24} />
                    </div>
                    <p className="text-gray-500 font-medium tracking-wide">Refining Collections...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 pt-24">
                <div className="text-center max-w-md">
                    <div className="bg-red-50 text-red-600 p-6 rounded-3xl mb-6 shadow-sm border border-red-100">
                        <p className="font-medium text-lg">{error}</p>
                    </div>
                    <button
                        onClick={getAllCategory}
                        className="px-8 py-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-600/30 flex items-center gap-2 mx-auto"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/30 pt-32 pb-20 px-4 sm:px-6 lg:px-8 " style={{ marginTop: '10rem', marginLeft: '8rem',  }}>
            <div className="max-w-7xl mx-auto">
                {/* Modern Hero Section */}
                <div className="relative  text-center" style={{ marginBottom: '2rem' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-primary-700 font-medium text-sm mb-6"
                    >
                        <LayoutGrid size={16} />
                        <span className="uppercase tracking-widest text-[10px]">Curated Selection</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-4"
                    >
                        Shop by <span className="relative inline-block text-primary-600">
                            Category
                            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
                            </svg>
                        </span>
                    </motion.h1>

                   
                </div>

                {/* Categories Grid - Refined Modern Style */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8"
                >
                    {allCategory.map((category) => (
                        <motion.div
                            key={category._id}
                            variants={itemVariants}
                            whileHover={{ y: -10 }}
                            className="bg-white rounded-[2.5rem] p-4 shadow-xl shadow-gray-200/40 border border-white hover:border-primary-100 transition-all duration-300 group cursor-pointer"
                            onClick={() => navigate(`/category/${category._id}`)}
                        >
                            {/* Image Container */}
                            <div className="relative h-64 w-full rounded-[2rem] overflow-hidden mb-6 bg-gray-100">
                                <img
                                    src={category.images?.[0]?.url || 'https://via.placeholder.com/400x500?text=Category'}
                                    alt={category.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Soft Overlay on Hover */}
                                <div className="absolute inset-0 bg-primary-900/0 group-hover:bg-primary-900/10 transition-colors duration-300" />

                                {/* Item Count or Icon Badge */}
                                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-white/50">
                                    <Package size={20} className="text-primary-600" />
                                </div>
                            </div>

                            {/* Details Container */}
                            <div className="px-2 pb-2">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                                        {category.name}
                                    </h3>
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                                        <ArrowRight size={18} />
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm font-medium tracking-tight">
                                    Tap to view products
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Empty State */}
                <AnimatePresence>
                    {allCategory.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 shadow-inner"
                        >
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                <LayoutGrid size={48} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Expanding Collections</h3>
                            <p className="text-gray-500 px-6">We're currently updating our catalog with new categories. Check back soon!</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CategoryPage;
