import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PharmacyProductCard } from '@/user/components/product';

const SuggestedItemsSection = ({
    title = "Suggested Items",
    items = [],
    className = "",
    containerStyle = {},
    titleStyle = {}
}) => {
    const navigate = useNavigate();

    // Default styles that can be overridden
    const defaultTitleStyle = {
        fontFamily: 'Gyrotrope',
        fontSize: '15px sm:20px',
        fontWeight: 600,
        color: '#000000',
        marginBottom: '1.5rem',
        marginTop: '2rem',
        ...titleStyle
    };

    const defaultSpanStyle = {
        textDecoration: 'underline',
        textDecorationSkipInk: 'auto',
        textUnderlineOffset: '4px',
        display: 'inline-block'
    };

    const handleProductClick = (item) => {
        navigate(`/product/${item.id}`);
    };

    return (
        <div className={className} style={containerStyle}>
            <h2 style={defaultTitleStyle}>
                <span style={defaultSpanStyle}>
                    {title}
                </span>
            </h2>
            <div
                className="flex w-full overflow-x-auto pb-4 hide-scrollbar gap-4 px-4 sm:gap-6 lg:gap-8"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    marginBottom: '2rem'
                }}
            >
                {items.map((item) => {
                    // Force display of MRP and Discount if missing (User Request)
                    const price = Number(item.price) || 0;
                    let mrp = Number(item.mrp || item.originalPrice) || 0;
                    let discount = Number(item.discount) || 0;

                    // If no valid MRP exist or MRP is not greater than price, synthesize it to ensure visual consistency
                    if (mrp <= price) {
                        // If we have a discount, calculate MRP from it, otherwise assume random 10-30% discount
                        const syntheticDiscount = discount || Math.floor(Math.random() * (30 - 10 + 1)) + 10; 
                        discount = syntheticDiscount;
                        mrp = Math.ceil(price * (100 / (100 - syntheticDiscount)));
                    }

                    return (
                        <div
                            key={item.id}
                            className="w-40 shrink-0 sm:w-[230px]"
                        >
                            <PharmacyProductCard
                                id={item.id}
                                name={item.name}
                                price={price}
                                originalPrice={mrp}
                                mrp={mrp}
                                discount={discount}
                                quantity="1 piece"
                                imageUrl={item.image}
                                onCardClick={() => handleProductClick(item)}
                                className="w-full h-full"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SuggestedItemsSection;
