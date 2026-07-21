const Footer = () => {
 
  const currentYear = new Date().getFullYear(); 

  return (
    <footer className="bg-gray-900 text-white px-4 py-4 text-center">
      <p>&copy; {currentYear} MNS. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
