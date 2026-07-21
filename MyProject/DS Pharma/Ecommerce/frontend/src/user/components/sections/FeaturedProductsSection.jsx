import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import productService from '@/services/productService';
import { PharmacyProductCard } from '@/user/components/product';

const FeaturedProductsSection = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchFeatured = async () => {
            setLoading(true);
            setError(false);
            try {
                console.log('[FeaturedProductsSection] Fetching featured products...');
                const data = await productService.getFeaturedProducts();
                console.log('[FeaturedProductsSection] Received data:', data);
                console.log('[FeaturedProductsSection] Data length:', data?.length);
                
                if (isMounted) {
                    // Filter and map products
                    const validProducts = (data || [])
                        .filter(product => {
                            const isValid = product && product.name && (product.id || product._id) && product.price;
                            if (!isValid) {
                                console.warn('[FeaturedProductsSection] Invalid product filtered out:', product);
                            }
                            return isValid;
                        })
                        .map(p => ({
                            ...p,
                            quantity: p.quantity || '1',
                            unit: p.unit || 'box',
                            imageUrl: p.image || p.imageUrl,
                            discount: p.discount || 0
                        }));
                    console.log('[FeaturedProductsSection] Valid products after filtering:', validProducts);
                    console.log('[FeaturedProductsSection] Valid products count:', validProducts.length);
                    setProducts(validProducts);
                }
            } catch (err) {
                console.error("[FeaturedProductsSection] Failed to load featured products:", err);
                if (isMounted) setError(true);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchFeatured();
        return () => { isMounted = false; };
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const handleProductClick = (product) => {
        navigate(`/product/${product.id || product._id}`);
    };

    const handleViewAll = () => {
        navigate('/featured');
    };

    // Don't render if loading, error, or no products
    if (loading || error || products.length === 0) return null;

    return (
        <>
            <style>{`
                @media (max-width: 639px) {
                    .highlighted-category-section {
                        padding-left: 5px !important;
                        padding-right: 5px !important;
                    }
                }
                @media (min-width: 640px) and (max-width: 1290px) {
                    .highlighted-category-section {
                        padding-left: 5px !important;
                        padding-right: 5px !important;
                    }
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
            <section
                className="highlighted-category-section w-full sm:py-16 min-h-[300px] sm:min-h-[350px] lg:py-24 mb-8 flex justify-center items-center"
                style={{
                    width: '100%',
                    backgroundColor: '#FFF6D3',
                    marginBottom: '3rem'
                }}
            >
                <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="w-full flex flex-row items-start justify-between sm:flex-row sm:items-center mb-4 lg:mb-6 gap-3 sm:gap-4">
                        <h2
                            className="text-left sm:text-left flex-1"
                            style={{
                                fontFamily: 'Gyrotrope',
                                fontWeight: 600,
                                fontSize: '22px',
                                lineHeight: '100%',
                                letterSpacing: '0%',
                                color: '#111827',
                                marginBottom: '15px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <span
                                style={{
                                    textDecoration: 'underline',
                                    textDecorationSkipInk: 'auto',
                                    textUnderlineOffset: '4px',
                                    textDecorationThickness: '2px',
                                    textDecorationColor: '#111827',
                                    display: 'inline-block',
                                    lineHeight: '1.2',
                                }}
                            >
                                Featured Products
                            </span>
                        </h2>
                        <button
                            onClick={handleViewAll}
                            className="bg-linear-to-r text-[10px] sm:text-xs from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 sm:px-10 sm:py-3 lg:px-12 lg:py-3.5 rounded-md shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 whitespace-nowrap"
                            aria-label="View all products"
                            style={{
                                fontFamily: 'Gyrotrope',
                                fontWeight: 600,
                                lineHeight: '100%',
                                letterSpacing: '0%',
                                padding: '6px 12px'
                            }}
                        >
                            View All
                        </button>
                    </div>

                    {/* Products Grid - Horizontal Scroll */}
                    <div className="w-full flex justify-center relative">
                        <Motion.div
                            className="flex w-full overflow-x-auto pb-4 hide-scrollbar gap-4 px-4 sm:gap-6 lg:gap-8"
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                            }}
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-20px" }}
                        >
                            {products.slice(0, 5).map((product, index) => (
                                <Motion.div
                                    key={product.id || product._id}
                                    variants={itemVariants}
                                    transition={{
                                        delay: index * 0.08,
                                        duration: 0.5,
                                        ease: "easeOut"
                                    }}
                                    className="w-40 shrink-0 sm:w-[230px]"
                                >
                                    <PharmacyProductCard
                                        {...product}
                                        onCardClick={() => handleProductClick(product)}
                                        className="h-full w-full bg-transparent"
                                    />
                                </Motion.div>
                            ))}
                        </Motion.div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default FeaturedProductsSection;
