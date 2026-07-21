const Footer = () => {
  const currentYear = new Date().getFullYear(); 

  return (
    <footer className="bg-slate-800 text-white px-4 py-4 text-center border-t border-teal-800 shadow-inner">
      <p className="text-gray-300">&copy; 2025 to {currentYear} <span className="text-teal-400 font-medium">Tamannaah </span>. All Rights Reserved. || <a href="https://vais.co.in" target="_blank" className="underline hover:text-teal-400 text-amber-400">created by vais</a></p>
    </footer>
  );
};

export default Footer;
