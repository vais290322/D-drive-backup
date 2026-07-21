import React, { useEffect, useState } from 'react';

const PrivacyPolicyPage = () => {
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
        textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
        letterSpacing: '1px',
    };

    const subtitleStyle = {
        fontSize: 'clamp(1rem, 2vw, 1.3rem)',
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

    const sectionStyle = (delay) => ({
        background: '#ffffff',
        borderRadius: '20px',
        padding: 'clamp(30px, 5vw, 50px)',
        marginBottom: '30px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `all 0.8s ease-out ${delay}s`,
    });

    const sectionHeaderStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '25px',
    };

    const iconContainerStyle = {
        width: '60px',
        height: '60px',
        background: 'linear-gradient(135deg, #afe9e4ff 0%, #9dc2bfff 100%)',
        borderRadius: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        flexShrink: 0,
    };

    const sectionTitleStyle = {
        fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
        fontWeight: '700',
        color: '#2d3748',
        margin: 0,
    };

    const listStyle = {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    };

    const listItemStyle = {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '15px',
        marginBottom: '15px',
        fontSize: 'clamp(1rem, 1.5vw, 1.1rem)',
        lineHeight: '1.7',
        color: '#4a5568',
    };

    const bulletStyle = {
        width: '8px',
        height: '8px',
        background: 'linear-gradient(135deg, #afe9e4ff 0%, #9dc2bfff 100%)',
        borderRadius: '50%',
        marginTop: '8px',
        flexShrink: 0,
    };

    const contactSectionStyle = {
        background: 'linear-gradient(135deg, #ffffff 0%, #f7fffe 100%)',
        borderRadius: '20px',
        padding: 'clamp(40px, 5vw, 60px)',
        textAlign: 'center',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.95)',
        transition: 'all 0.8s ease-out 0.8s',
    };

    const contactTitleStyle = {
        fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
        fontWeight: '700',
        color: '#2d3748',
        marginBottom: '20px',
    };

    const contactTextStyle = {
        fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
        color: '#718096',
        marginBottom: '30px',
        maxWidth: '700px',
        margin: '0 auto 30px',
        lineHeight: '1.7',
    };

    const buttonStyle = {
        display: 'inline-block',
        padding: '18px 45px',
        fontSize: '1.1rem',
        fontWeight: '700',
        color: '#ffffff',
        background: 'linear-gradient(135deg, #afe9e4ff 0%, #9dc2bfff 100%)',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 5px 20px rgba(159, 194, 191, 0.4)',
        textDecoration: 'none',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    };

    const [hoveredButton, setHoveredButton] = useState(false);

    const buttonHoverStyle = {
        transform: 'translateY(-3px)',
        boxShadow: '0 8px 30px rgba(159, 194, 191, 0.5)',
    };

    const sections = [
        {
            icon: '🗂️',
            title: 'Information We Collect',
            items: [
                'Personal information such as name, email address, phone number, and shipping address when you create an account or place an order.',
                'Payment information processed securely through our payment partners.',
                'Browsing data including IP address, browser type, and pages visited to improve our services.',
                'Health-related information you provide when ordering prescription medications (handled with utmost confidentiality).',
            ],
        },
        {
            icon: '🔧',
            title: 'How We Use Your Information',
            items: [
                'To process and fulfill your orders efficiently and accurately.',
                'To communicate with you about your orders, account, and our services.',
                'To improve our website, products, and customer service experience.',
                'To send promotional emails and updates (only if you opt-in).',
                'To comply with legal obligations and prevent fraudulent activities.',
            ],
        },
        {
            icon: '🔒',
            title: 'Data Security',
            items: [
                'We implement industry-standard security measures to protect your personal information.',
                'All sensitive data is encrypted using SSL/TLS technology during transmission.',
                'Payment information is processed through PCI-DSS compliant payment gateways.',
                'Access to personal data is restricted to authorized personnel only.',
                'Regular security audits and updates to maintain the highest level of protection.',
            ],
        },
        {
            icon: '🤝',
            title: 'Information Sharing',
            items: [
                'We do not sell, trade, or rent your personal information to third parties.',
                'We may share information with trusted service providers who assist in operating our website and conducting our business.',
                'We may disclose information when required by law or to protect our rights and safety.',
                'All third-party partners are bound by strict confidentiality agreements.',
                'You will be notified of any significant changes to our data sharing practices.',
            ],
        },
        {
            icon: '✅',
            title: 'Your Rights',
            items: [
                'Access and review your personal information at any time through your account dashboard.',
                'Request correction or deletion of your personal data by contacting our support team.',
                'Opt-out of marketing communications at any time through email preferences.',
                'Request a copy of your data in a portable format for your records.',
                'Lodge a complaint with the relevant data protection authority if needed.',
            ],
        },
        {
            icon: '🍪',
            title: 'Cookies and Tracking',
            items: [
                'We use cookies to enhance your browsing experience and analyze website traffic patterns.',
                'Essential cookies are necessary for the website to function properly and cannot be disabled.',
                'Analytics cookies help us understand how visitors interact with our website to improve user experience.',
                'You can control cookie preferences through your browser settings at any time.',
                'Disabling certain cookies may affect the functionality and features of our website.',
            ],
        },
    ];

    return (
        <div style={containerStyle}>
            {/* Hero Section */}
            <div style={heroSectionStyle}>
                <h1 style={titleStyle}>Privacy Policy</h1>
                <p style={subtitleStyle}>
                    Last updated: February 2026
                </p>
                <p style={{ ...subtitleStyle, marginTop: '15px' }}>
                    At DSPharma, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.
                </p>
            </div>

            <div style={contentContainerStyle}>
                {/* Content Sections */}
                {sections.map((section, index) => (
                    <div key={index} style={sectionStyle(0.2 + index * 0.1)}>
                        <div style={sectionHeaderStyle}>
                            <div style={iconContainerStyle}>
                                <span>{section.icon}</span>
                            </div>
                            <h2 style={sectionTitleStyle}>{section.title}</h2>
                        </div>
                        <ul style={listStyle}>
                            {section.items.map((item, idx) => (
                                <li key={idx} style={listItemStyle}>
                                    <span style={bulletStyle}></span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                {/* Contact Section */}
                <div style={contactSectionStyle}>
                    <h3 style={contactTitleStyle}>Questions About Privacy?</h3>
                    <p style={contactTextStyle}>
                        If you have any questions or concerns about our privacy policy or how we handle your data,
                        please don't hesitate to contact us. We're here to help!
                    </p>
                    <a
                        href="/contact"
                        style={{
                            ...buttonStyle,
                            ...(hoveredButton ? buttonHoverStyle : {}),
                        }}
                        onMouseEnter={() => setHoveredButton(true)}
                        onMouseLeave={() => setHoveredButton(false)}
                    >
                        Contact Us
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
