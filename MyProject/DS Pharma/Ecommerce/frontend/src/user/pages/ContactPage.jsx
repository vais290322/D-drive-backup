import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const ContactPage = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        message: '',
        contactDetails: '',
    });
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setIsVisible(true);
        window.scrollTo(0, 0);
    }, []);

    const containerStyle = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #c3dfd8ff 0%, #789993ff 100%)',
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

    const contactCardsContainerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '30px',
        marginBottom: '40px',
    };

    const contactCardStyle = (delay) => ({
        background: '#ffffff',
        borderRadius: '20px',
        padding: '40px 30px',
        textAlign: 'center',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
        transition: `all 0.6s ease-out ${delay}s`,
        cursor: 'pointer',
    });

    const contactCardHoverStyle = {
        transform: 'translateY(-10px) scale(1.02)',
        boxShadow: '0 20px 50px rgba(102, 126, 234, 0.3)',
    };

    const iconContainerStyle = {
        width: '80px',
        height: '80px',
        margin: '0 auto 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2.5rem',
    };

    const contactTitleStyle = {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#2d3748',
        marginBottom: '10px',
    };

    const contactTextStyle = {
        fontSize: '1.1rem',
        color: '#718096',
        lineHeight: '1.6',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
        maxWidth: '100%',
    };

    const mainContentGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '40px',
        marginBottom: '40px',
    };

    const formContainerStyle = {
        background: '#ffffff',
        borderRadius: '20px',
        padding: 'clamp(30px, 5vw, 50px)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
        transition: 'all 0.8s ease-out 0.3s',
    };

    const formTitleStyle = {
        fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
        fontWeight: '700',
        color: '#667eea',
        marginBottom: '30px',
        position: 'relative',
        paddingBottom: '15px',
    };

    const formTitleAfterStyle = {
        content: '""',
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '80px',
        height: '4px',
        background: 'linear-gradient(90deg, #667eea, #764ba2)',
        borderRadius: '2px',
    };

    const formGroupStyle = {
        marginBottom: '25px',
    };

    const labelStyle = {
        display: 'block',
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: '10px',
    };

    const inputStyle = {
        width: '100%',
        padding: '15px 20px',
        fontSize: '1rem',
        border: '2px solid #e2e8f0',
        borderRadius: '10px',
        outline: 'none',
        transition: 'all 0.3s ease',
        boxSizing: 'border-box',
        fontFamily: 'inherit',
    };

    const inputFocusStyle = {
        borderColor: '#667eea',
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
    };

    const textareaStyle = {
        ...inputStyle,
        minHeight: '150px',
        resize: 'vertical',
    };

    const errorStyle = {
        color: '#e53e3e',
        fontSize: '0.9rem',
        marginTop: '5px',
    };

    const buttonStyle = {
        width: '100%',
        padding: '18px 40px',
        fontSize: '1.2rem',
        fontWeight: '700',
        color: '#ffffff',
        background: loading ? '#a0aec0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        borderRadius: '10px',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 5px 15px rgba(102, 126, 234, 0.3)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    };

    const buttonHoverStyle = {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
    };

    const mapContainerStyle = {
        background: '#ffffff',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(30px)',
        transition: 'all 0.8s ease-out 0.3s',
    };

    const mapTitleStyle = {
        fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
        fontWeight: '700',
        color: '#667eea',
        marginBottom: '20px',
    };

    const iframeStyle = {
        width: '100%',
        height: '400px',
        border: 'none',
        borderRadius: '15px',
    };

    const alertStyle = (type) => ({
        padding: '15px 20px',
        borderRadius: '10px',
        marginBottom: '20px',
        fontSize: '1rem',
        fontWeight: '500',
        background: type === 'success' ? '#c6f6d5' : '#fed7d7',
        color: type === 'success' ? '#22543d' : '#742a2a',
        border: `2px solid ${type === 'success' ? '#9ae6b4' : '#fc8181'}`,
    });

    const [hoveredCard, setHoveredCard] = useState(null);
    const [focusedInput, setFocusedInput] = useState(null);
    const [isButtonHovered, setIsButtonHovered] = useState(false);

    const contactInfo = [
        {
            icon: '📞',
            title: 'Phone',
            text: '+91 9382713623',
            link: 'tel:+9382713623',
        },
        {
            icon: '📧',
            title: 'Email',
            text: 'dscommunication3@gmail.com',
            link: 'mailto:dscommunication3@gmail.com',
        },
        {
            icon: '📍',
            title: 'Address',
            text: 'Berachapa Haroa Road North 24 Pargana, 19-West Bengal',
            link: null,
        },
    ];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }



        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
        }

        if (!formData.contactDetails.trim()) {
            newErrors.contactDetails = 'Contact details are required';
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$|^\+?[\d\s-]{10,}$/.test(formData.contactDetails.trim())) {
            newErrors.contactDetails = 'Please enter a valid email or phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setSubmitStatus({ type: '', message: '' });

        try {
            const response = await axios.post(`${apiUrl}/contact`, formData);

            setSubmitStatus({
                type: 'success',
                message: 'Thank you for contacting us! We will get back to you soon.',
            });

            // Reset form
            setFormData({
                name: '',
                subject: '',
                message: '',
                contactDetails: '',
            });

            // Clear success message after 5 seconds
            setTimeout(() => {
                setSubmitStatus({ type: '', message: '' });
            }, 5000);

        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus({
                type: 'error',
                message: error.response?.data?.message || 'Failed to send message. Please try again later.',
            });

            // Clear error message after 5 seconds
            setTimeout(() => {
                setSubmitStatus({ type: '', message: '' });
            }, 5000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            {/* Hero Section */}
            <div style={heroSectionStyle}>
                <h1 style={titleStyle}>Contact Us</h1>
                <p style={subtitleStyle}>
                    We're here to help! Reach out to us for any questions or concerns.
                </p>
            </div>

            <div style={contentContainerStyle}>
                {/* Contact Info Cards */}
                <div style={contactCardsContainerStyle}>
                    {contactInfo.map((info, index) => (
                        <div
                            key={index}
                            style={{
                                ...contactCardStyle(0.2 + index * 0.1),
                                ...(hoveredCard === index ? contactCardHoverStyle : {}),
                            }}
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                            onClick={() => info.link && window.open(info.link, '_self')}
                        >
                            <div style={iconContainerStyle}>
                                <span>{info.icon}</span>
                            </div>
                            <h3 style={contactTitleStyle}>{info.title}</h3>
                            <p style={contactTextStyle}>{info.text}</p>
                        </div>
                    ))}
                </div>

                {/* Main Content: Form and Map */}
                <div style={mainContentGridStyle}>
                    {/* Contact Form */}
                    <div style={formContainerStyle}>
                        <h2 style={formTitleStyle}>
                            Send us a Message
                            <div style={formTitleAfterStyle}></div>
                        </h2>

                        {submitStatus.message && (
                            <div style={alertStyle(submitStatus.type)}>
                                {submitStatus.message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div style={formGroupStyle}>
                                <label htmlFor="name" style={labelStyle}>
                                    Your Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    style={{
                                        ...inputStyle,
                                        ...(focusedInput === 'name' ? inputFocusStyle : {}),
                                    }}
                                    onFocus={() => setFocusedInput('name')}
                                    onBlur={() => setFocusedInput(null)}
                                    placeholder="Enter your full name"
                                />
                                {errors.name && <div style={errorStyle}>{errors.name}</div>}
                            </div>

                            <div style={formGroupStyle}>
                                <label htmlFor="contactDetails" style={labelStyle}>
                                    Email or Phone *
                                </label>
                                <input
                                    type="text"
                                    id="contactDetails"
                                    name="contactDetails"
                                    value={formData.contactDetails}
                                    onChange={handleChange}
                                    style={{
                                        ...inputStyle,
                                        ...(focusedInput === 'contactDetails' ? inputFocusStyle : {}),
                                    }}
                                    onFocus={() => setFocusedInput('contactDetails')}
                                    onBlur={() => setFocusedInput(null)}
                                    placeholder="Enter your email or phone number"
                                />
                                {errors.contactDetails && (
                                    <div style={errorStyle}>{errors.contactDetails}</div>
                                )}
                            </div>

                            <div style={formGroupStyle}>
                                <label htmlFor="subject" style={labelStyle}>
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    style={{
                                        ...inputStyle,
                                        ...(focusedInput === 'subject' ? inputFocusStyle : {}),
                                    }}
                                    onFocus={() => setFocusedInput('subject')}
                                    onBlur={() => setFocusedInput(null)}
                                    placeholder="What is this regarding?"
                                />
                                {errors.subject && <div style={errorStyle}>{errors.subject}</div>}
                            </div>

                            <div style={formGroupStyle}>
                                <label htmlFor="message" style={labelStyle}>
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    style={{
                                        ...textareaStyle,
                                        ...(focusedInput === 'message' ? inputFocusStyle : {}),
                                    }}
                                    onFocus={() => setFocusedInput('message')}
                                    onBlur={() => setFocusedInput(null)}
                                    placeholder="Tell us more about your inquiry..."
                                />
                                {errors.message && <div style={errorStyle}>{errors.message}</div>}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    ...buttonStyle,
                                    ...(isButtonHovered && !loading ? buttonHoverStyle : {}),
                                }}
                                onMouseEnter={() => setIsButtonHovered(true)}
                                onMouseLeave={() => setIsButtonHovered(false)}
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>

                    {/* Google Map */}
                    <div style={mapContainerStyle}>
                        <h2 style={mapTitleStyle}>Find Us Here</h2>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!3m2!1sen!2sin!4v1770182757272!5m2!1sen!2sin!6m8!1m7!1s0knJhVHjpNIOHhj2vGdsnA!2m2!1d22.69556046065944!2d88.68839523584774!3f162.34388722885188!4f-1.664648503036645!5f0.7820865974627469"
                            style={iframeStyle}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="DSPharma Location"
                        ></iframe>
                        <p style={{ ...contactTextStyle, marginTop: '20px', textAlign: 'center' }}>
                            Visit us during business hours: Mon-Sat, 9:00 AM - 8:00 PM
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;