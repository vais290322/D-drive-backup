import React from 'react';

// Importing images
import heroImage from '../assets/gallery/Rectangle 1.png';
import img1 from '../assets/gallery/Rectangle 37.png';
import img2 from '../assets/gallery/Rectangle 38.png';
import img3 from '../assets/gallery/Rectangle 39.png';
import img4 from '../assets/gallery/Rectangle 40.png';
import img5 from '../assets/gallery/Rectangle 41.png';
import img6 from '../assets/gallery/Rectangle 42.png';
import img7 from '../assets/gallery/Rectangle 43.png';
import img8 from '../assets/gallery/Rectangle 44.png';

const galleryImages = [
  { src: img1, alt: 'Gallery image 1', className: 'col-span-1 row-span-2' },
  { src: img2, alt: 'Gallery image 2', className: 'col-span-1 row-span-1' },
  { src: img3, alt: 'Gallery image 3', className: 'col-span-1 row-span-2' },
  { src: img4, alt: 'Gallery image 4', className: 'col-span-1 row-span-1' },
  { src: img5, alt: 'Gallery image 5', className: 'col-span-2 row-span-2' },
  { src: img6, alt: 'Gallery image 6', className: 'col-span-1 row-span-2' },
  { src: img7, alt: 'Gallery image 7', className: 'col-span-1 row-span-1' },
  { src: img8, alt: 'Gallery image 8', className: 'col-span-1 row-span-1' },
];

const GalleryPage = () => {
  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Hero Section */}
      <div
        className="relative h-[80vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* <div className="absolute inset-0 bg-black opacity-50"></div> */}
        <div className="absolute z-10  md:left-48 ">
          <h1 className="text-4xl md:text-6xl 2xl:text-7xl  mb-4 font-['playfair_display'] animate-fade-in animation-delay-300">Our Work Speaks <br />for Itself</h1>
          <p className="text-lg md:text-xl 2xl:text-3xl max-w-2xl mx-auto font-['playfair_display'] leading-tight animate-slide-up animation-delay-600">
            Explore our creative transformations and <br /> calming spaces where beauty begins.
          </p>
        </div> 
      </div>

      {/* Gallery Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 ">
        
        <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl 2xl:text-7xl  mb-12 font-['playfair_display']">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((image, index) => (
                    <div key={index} className={image.className}>
                        <img src={image.src} alt={image.alt} className="w-full h-full object-cover rounded-lg shadow-lg" />
                    </div>
                ))}
            </div>
        </div>
      </div>

      
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .hover\\:shadow-3xl:hover {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};

export default GalleryPage;


