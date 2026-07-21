import React, { useEffect, useState } from 'react';

const AboutPage = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        window.scrollTo(0, 0);
    }, []);

    const containerStyle = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #afe9e4ff 0%, #9dc2bfff 100%)',
        paddingTop: '80px',
        paddingBottom: '60px',
    };

    const heroSectionStyle = {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#ffffff',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.8s ease-out',
    };

    const titleStyle = {
        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
        fontWeight: '800',
        marginBottom: '20px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        letterSpacing: '1px',
    };

    const subtitleStyle = {
        fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
        maxWidth: '800px',
        margin: '0 auto',
        lineHeight: '1.8',
        opacity: '0.95',
    };

    const contentContainerStyle = {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
    };

    const sectionStyle = {
        background: '#ffffff',
        borderRadius: '20px',
        padding: 'clamp(30px, 5vw, 60px)',
        marginBottom: '40px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.8s ease-out 0.2s',
    };

    const sectionTitleStyle = {
        fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
        fontWeight: '700',
        color: '#667eea',
        marginBottom: '25px',
        position: 'relative',
        paddingBottom: '15px',
    };

    const sectionTitleAfterStyle = {
        content: '""',
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '80px',
        height: '4px',
        background: 'linear-gradient(90deg, #667eea, #764ba2)',
        borderRadius: '2px',
    };

    const paragraphStyle = {
        fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
        lineHeight: '1.8',
        color: '#4a5568',
        marginBottom: '20px',
    };

    const valuesGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '30px',
        marginTop: '40px',
    };

    const valueCardStyle = (delay) => ({
        background: 'linear-gradient(135deg, #f6f8fb 0%, #ffffff 100%)',
        padding: '30px',
        borderRadius: '15px',
        border: '2px solid #e2e8f0',
        textAlign: 'center',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
        transition: `all 0.6s ease-out ${delay}s`,
        cursor: 'pointer',
    });

    const valueCardHoverStyle = {
        transform: 'translateY(-5px)',
        boxShadow: '0 15px 35px rgba(102, 126, 234, 0.2)',
        borderColor: '#667eea',
    };

    const iconStyle = {
        fontSize: '3rem',
        marginBottom: '15px',
    };

    const valueTitle = {
        fontSize: '1.4rem',
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: '10px',
    };

    const valueDescription = {
        fontSize: '1rem',
        color: '#718096',
        lineHeight: '1.6',
    };

    const statsGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '30px',
        marginTop: '40px',
    };

    const statCardStyle = (delay) => ({
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 20px',
        borderRadius: '15px',
        textAlign: 'center',
        color: '#ffffff',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.9)',
        transition: `all 0.6s ease-out ${delay}s`,
    });

    const statNumberStyle = {
        fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
        fontWeight: '800',
        marginBottom: '10px',
    };

    const statLabelStyle = {
        fontSize: '1.1rem',
        opacity: '0.9',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    };

    const [hoveredCard, setHoveredCard] = useState(null);

    const values = [
        {
            icon: '🎯',
            title: 'Quality First',
            description: 'We ensure all medications meet the highest quality standards and are sourced from certified manufacturers.',
        },
        {
            icon: '💚',
            title: 'Customer Care',
            description: 'Your health and satisfaction are our top priorities. We provide personalized service and expert advice.',
        },
        {
            icon: '⚡',
            title: 'Fast Delivery',
            description: 'Quick and reliable delivery service to ensure you get your medications when you need them.',
        },
        {
            icon: '🔒',
            title: 'Trust & Safety',
            description: 'We maintain strict privacy standards and ensure secure transactions for your peace of mind.',
        },
    ];

    const stats = [
        { number: '10K+', label: 'Happy Customers' },
        { number: '5K+', label: 'Products' },
        { number: '15+', label: 'Years Experience' },
        { number: '24/7', label: 'Support' },
    ];

    return (
        <div style={containerStyle}>
            {/* Hero Section */}
            <div style={heroSectionStyle}>
                <h1 style={titleStyle}>About DSPharma</h1>
                <p style={subtitleStyle}>
                    Your Trusted Partner in Health and Wellness
                </p>
            </div>

            <div style={contentContainerStyle}>
                {/* Our Story Section */}
                <div style={sectionStyle}>
                    <h2 style={sectionTitleStyle}>
                        Our Story
                        <div style={sectionTitleAfterStyle}></div>
                    </h2>
                    <p style={paragraphStyle}>
                        DSPharma was founded with a simple yet powerful mission: to make quality healthcare accessible to everyone.
                        What started as a small neighborhood pharmacy has grown into a trusted online healthcare destination,
                        serving thousands of customers across the region.
                    </p>
                    <p style={paragraphStyle}>
                        With over 15 years of experience in the pharmaceutical industry, we understand the importance of reliable,
                        affordable, and accessible healthcare. Our team of licensed pharmacists and healthcare professionals work
                        tirelessly to ensure that every product we offer meets the highest standards of quality and safety.
                    </p>
                    <p style={paragraphStyle}>
                        Today, DSPharma stands as a beacon of trust in the healthcare industry, combining traditional pharmaceutical
                        expertise with modern e-commerce convenience to serve you better.
                    </p>
                </div>

                {/* Mission & Vision Section */}
                <div style={sectionStyle}>
                    <h2 style={sectionTitleStyle}>
                        Our Mission & Vision
                        <div style={sectionTitleAfterStyle}></div>
                    </h2>
                    <p style={paragraphStyle}>
                        <strong style={{ color: '#667eea', fontSize: '1.2rem' }}>Mission:</strong><br />
                        To provide safe, effective, and affordable medications while delivering exceptional customer service
                        and expert healthcare guidance. We strive to be your first choice for all pharmaceutical needs.
                    </p>
                    <p style={paragraphStyle}>
                        <strong style={{ color: '#764ba2', fontSize: '1.2rem' }}>Vision:</strong><br />
                        To revolutionize healthcare accessibility by bridging the gap between traditional pharmacy services
                        and modern technology, making quality healthcare available to everyone, everywhere.
                    </p>
                </div>

                {/* Our Values Section */}
                <div style={sectionStyle}>
                    <h2 style={sectionTitleStyle}>
                        Our Core Values
                        <div style={sectionTitleAfterStyle}></div>
                    </h2>
                    <div style={valuesGridStyle}>
                        {values.map((value, index) => (
                            <div
                                key={index}
                                style={{
                                    ...valueCardStyle(0.4 + index * 0.1),
                                    ...(hoveredCard === index ? valueCardHoverStyle : {}),
                                }}
                                onMouseEnter={() => setHoveredCard(index)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div style={iconStyle}>{value.icon}</div>
                                <h3 style={valueTitle}>{value.title}</h3>
                                <p style={valueDescription}>{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Statistics Section */}
                <div style={sectionStyle}>
                    <h2 style={sectionTitleStyle}>
                        Our Impact
                        <div style={sectionTitleAfterStyle}></div>
                    </h2>
                    <div style={statsGridStyle}>
                        {stats.map((stat, index) => (
                            <div key={index} style={statCardStyle(0.3 + index * 0.1)}>
                                <div style={statNumberStyle}>{stat.number}</div>
                                <div style={statLabelStyle}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Why Choose Us Section */}
                <div style={sectionStyle}>
                    <h2 style={sectionTitleStyle}>
                        Why Choose DSPharma?
                        <div style={sectionTitleAfterStyle}></div>
                    </h2>
                    <p style={paragraphStyle}>
                        ✓ <strong>Licensed Pharmacists:</strong> Our team of experienced, licensed pharmacists is always available to answer your questions and provide expert advice.
                    </p>
                    <p style={paragraphStyle}>
                        ✓ <strong>Genuine Products:</strong> We source all our medications directly from certified manufacturers and authorized distributors.
                    </p>
                    <p style={paragraphStyle}>
                        ✓ <strong>Competitive Prices:</strong> We offer the best prices without compromising on quality, making healthcare affordable for all.
                    </p>
                    <p style={paragraphStyle}>
                        ✓ <strong>Secure Shopping:</strong> Your privacy and security are paramount. We use industry-standard encryption to protect your data.
                    </p>
                    <p style={paragraphStyle}>
                        ✓ <strong>Fast & Reliable Delivery:</strong> We understand that when it comes to health, time matters. Our efficient delivery system ensures your medications reach you quickly.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;