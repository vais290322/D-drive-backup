import React from 'react';
import { motion as Motion } from 'framer-motion';

const FacebookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50975H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50975H7.19795L7.19795 13.4901H9.19795V21.5Z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Footer = () => {
  const quickLinks = [
    { id: 1, label: 'Home', href: '/' },
    { id: 2, label: 'About', href: '/about' },
    { id: 3, label: 'Contact', href: '/contact' },
    { id: 4, label: 'Categories', href: '/categories' },
    { id: 5, label: 'Privacy Policy', href: '/privacy-policy' },
    { id: 6, label: 'Terms of Service', href: '/terms-of-service' }
  ];

  const socialLinks = [
    { id: 1, icon: FacebookIcon, href: '#', label: 'Facebook' },
    { id: 2, icon: InstagramIcon, href: '#', label: 'Instagram' },
    { id: 3, icon: XIcon, href: '#', label: 'X' }
  ];

  return (
    <footer
      id="contact"
      className="flex items-center justify-center w-full"
      style={{
        width: '100%',
        backgroundColor: '#D1F5EB', // Light green color from image
        paddingTop: '2rem',
        paddingBottom: '4rem'
      }}
    >
      <div className="w-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid items-start grid-cols-2 gap-8 md:grid-cols-12">

          {/* Logo Section */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-start justify-center col-span-2 md:justify-start md:col-span-4"
          >
            <div
              style={{
                background: '#D9D9D9', // Light gray background
                padding: '1.5rem 3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                maxWidth: '300px'
              }}
            >
              <span
                style={{
                  fontFamily: 'Gyrotrope',
                  fontSize: '24px',
                  fontWeight: 600,
                  color: '#000000',
                  letterSpacing: '0.05em'
                }}
              >
                Logo
              </span>
            </div>
          </Motion.div>

          {/* Quick Links Section */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center md:items-center col-span-1 md:col-span-4 " 
          >
            <div className="flex flex-col items-start md:text-start">
              <h3
                style={{
                  fontFamily: 'Gyrotrope',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#000000',
                  marginBottom: '12px',
                  letterSpacing: '0em'
                }}
              >
                Quick Links
              </h3>
              <nav className="flex flex-col" style={{ gap: '8px' }}>
                {quickLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    style={{
                      fontFamily: 'Gyrotrope',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#000000',
                      textDecoration: 'none',
                      transition: 'opacity 0.2s ease',
                      lineHeight: '1.4'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </Motion.div>

          {/* Contact Info Section */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-start col-span-1 md:col-span-4 md:pl-12"
          >
            <h3
              style={{
                fontFamily: 'Gyrotrope',
                fontSize: '16px',
                fontWeight: 600,
                color: '#000000',
                marginBottom: '12px',
                letterSpacing: '0em'
              }}
            >
              Contact Info
            </h3>

            {/* Contact Details */}
            <div className="flex flex-col mb-8" style={{ gap: '8px' }}>
              <p
                style={{
                  fontFamily: 'Gyrotrope',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#000000',
                  margin: 0,
                  lineHeight: '1.4'
                }}
              >
                dscommunication3@gmail.com
              </p>
              <p
                style={{
                  fontFamily: 'Gyrotrope',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#000000',
                  margin: 0,
                  lineHeight: '1.4'
                }}
              >
                9382713623 / 9564200437
              </p>
              <p
                style={{
                  fontFamily: 'Gyrotrope',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#000000',
                  margin: 0,
                  lineHeight: '1.4'
                }}
              >
                Berachapa Haroa Road North 24 Pargana, 19-West Bengal
              </p>
            </div>

            {/* Social Media */}
            <div>
              <h4
                style={{
                  fontFamily: 'Gyrotrope',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#000000',
                  marginBottom: '12px',
                  letterSpacing: '0em'
                }}
              >
                Social Media
              </h4>
              <div className="flex items-center" style={{ gap: '16px' }}>
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.id}
                      href={social.href}
                      aria-label={social.label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#000000',
                        transition: 'transform 0.2s ease, opacity 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.opacity = '0.8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.opacity = '1';
                      }}
                    >
                      <Icon />
                    </a>
                  );
                })}
              </div>
            </div>
          </Motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;