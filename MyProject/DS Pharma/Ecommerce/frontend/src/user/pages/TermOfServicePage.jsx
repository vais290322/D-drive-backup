import React, { useEffect, useState } from 'react';

const TermOfServicePage = () => {
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
    transition: 'all 0.8s ease-out 0.9s',
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
      icon: '📜',
      title: 'Acceptance of Terms',
      items: [
        'By accessing and using DSPharma\'s website and services, you accept and agree to be bound by these Terms of Service.',
        'If you do not agree to these terms, please do not use our services.',
        'We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of modified terms.',
        'It is your responsibility to review these terms periodically for changes.',
      ],
    },
    {
      icon: '🛒',
      title: 'Use of Services',
      items: [
        'You must be at least 18 years old to use our services and purchase products.',
        'You agree to provide accurate, current, and complete information during registration and checkout.',
        'You are responsible for maintaining the confidentiality of your account credentials.',
        'You agree not to use our services for any unlawful or prohibited purpose.',
        'We reserve the right to refuse service or terminate accounts at our discretion.',
      ],
    },
    {
      icon: '📦',
      title: 'Product Information and Orders',
      items: [
        'We strive to provide accurate product descriptions, but we do not warrant that descriptions are error-free.',
        'All orders are subject to product availability and acceptance by DSPharma.',
        'We reserve the right to limit quantities or refuse orders at our discretion.',
        'Prescription medications require a valid prescription from a licensed healthcare provider.',
        'Prices are subject to change without notice, but confirmed orders will honor the price at the time of purchase.',
      ],
    },
    {
      icon: '💳',
      title: 'Payment and Pricing',
      items: [
        'Payment must be made in full at the time of order placement.',
        'We accept various payment methods as displayed on our website.',
        'All prices are listed in Indian Rupees (INR) and include applicable taxes unless stated otherwise.',
        'You authorize us to charge your payment method for the total amount of your order.',
        'In case of payment failure, your order may be cancelled and you will be notified.',
      ],
    },
    {
      icon: '🔄',
      title: 'Returns and Refunds',
      items: [
        'Due to the nature of pharmaceutical products, returns are subject to strict conditions and regulations.',
        'Unopened and unused products may be returned within 7 days of delivery with original packaging.',
        'Prescription medications and certain health products cannot be returned once opened for safety reasons.',
        'Refunds will be processed within 7-10 business days after receiving and inspecting returned items.',
        'Shipping costs are non-refundable unless the return is due to our error or defective products.',
      ],
    },
    {
      icon: '⚠️',
      title: 'Limitation of Liability',
      items: [
        'DSPharma is not liable for any indirect, incidental, or consequential damages arising from the use of our services.',
        'Our liability is limited to the amount you paid for the product or service in question.',
        'We do not guarantee that our services will be uninterrupted, error-free, or completely secure.',
        'You acknowledge that you use our services at your own risk and discretion.',
        'We are not responsible for delays or failures caused by circumstances beyond our reasonable control.',
      ],
    },
    {
      icon: '🚫',
      title: 'Account Termination',
      items: [
        'You may terminate your account at any time by contacting our customer support team.',
        'We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.',
        'Upon termination, your right to use our services will immediately cease.',
        'Termination does not affect any rights or obligations that arose before termination.',
        'We may retain certain information as required by law or for legitimate business purposes.',
      ],
    },
    {
      icon: '⚖️',
      title: 'Governing Law',
      items: [
        'These Terms of Service are governed by the laws of India.',
        'Any disputes arising from these terms will be subject to the exclusive jurisdiction of courts in your region.',
        'If any provision of these terms is found to be invalid, the remaining provisions will continue in full force.',
        'Our failure to enforce any right or provision does not constitute a waiver of such right or provision.',
        'These terms constitute the entire agreement between you and DSPharma regarding our services.',
      ],
    },
  ];

  return (
    <div style={containerStyle}>
      {/* Hero Section */}
      <div style={heroSectionStyle}>
        <h1 style={titleStyle}>Terms of Service</h1>
        <p style={subtitleStyle}>
          Last updated: February 2026
        </p>
        <p style={{ ...subtitleStyle, marginTop: '15px' }}>
          Please read these terms carefully before using DSPharma's services. These terms govern your use of our website and services.
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
          <h3 style={contactTitleStyle}>Questions About Our Terms?</h3>
          <p style={contactTextStyle}>
            If you have any questions or concerns about our Terms of Service, please feel free to reach out
            to our support team. We're here to assist you!
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
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default TermOfServicePage;
