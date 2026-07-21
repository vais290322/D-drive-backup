// import React from 'react';
// import { motion } from 'framer-motion';

// const Animation = () => {
//   const leafAnimation = {
//     swing: {
//       rotate: [0, 10, -10, 0],
//       transition: {
//         repeat: Infinity,
//         duration: 3,
//         ease: 'easeInOut',
//       },
//     },
//   };

//   const animalAnimation = {
//     float: {
//       y: [0, -10, 0],
//       transition: {
//         repeat: Infinity,
//         duration: 2,
//         ease: 'easeInOut',
//       },
//     },
//   };

//   return (
//     <div className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: "url('/path-to-your-forest-bg.jpg')" }}>
//       {/* Main Container */}
//       <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8">
//         {/* Signboard */}
//         <motion.div
//           className="bg-yellow-100 rounded-lg p-6 shadow-lg relative"
//           initial={{ scale: 0.9 }}
//           animate={{ scale: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <h1 className="text-4xl font-bold flex space-x-2">
//             {['P', 'E', 'T', ' ', 'N', 'E', 'V', 'E', 'R', 'L', 'A', 'N', 'D'].map((char, i) => (
//               <motion.span
//                 key={i}
//                 animate={{ y: [0, -10, 0] }}
//                 transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
//                 className="inline-block"
//               >
//                 {char}
//               </motion.span>
//             ))}
//           </h1>
//           <p className="text-xl text-center text-green-700 mt-2">LLP</p>
//         </motion.div>

//         {/* Leaves */}
//         <motion.img
//           src="/path-to-leaf1.png"
//           alt="Leaf 1"
//           className="absolute top-10 left-5 w-32"
//           variants={leafAnimation}
//           animate="swing"
//         />
//         <motion.img
//           src="/path-to-leaf2.png"
//           alt="Leaf 2"
//           className="absolute top-10 right-5 w-32"
//           variants={leafAnimation}
//           animate="swing"
//         />

//         {/* Animals */}
//         <motion.img
//           src="/path-to-animal1.png"
//           alt="Animal 1"
//           className="absolute bottom-10 left-10 w-24"
//           variants={animalAnimation}
//           animate="float"
//         />
//         <motion.img
//           src="/path-to-animal2.png"
//           alt="Animal 2"
//           className="absolute bottom-10 right-10 w-24"
//           variants={animalAnimation}
//           animate="float"
//         />
//       </div>
//     </div>
//   );
// };

// export default Animation;


// import React from "react";
// import { motion } from "framer-motion";

// const leaves = [
//     "https://upload.wikimedia.org/wikipedia/commons/a/a5/Leaf_1_web.png",
//     "https://upload.wikimedia.org/wikipedia/commons/7/77/Green_leaf_icon.png",
//     "https://upload.wikimedia.org/wikipedia/commons/d/d6/Leaf_icon_vector.svg",
//     "https://upload.wikimedia.org/wikipedia/commons/4/47/Leaf_svg.png",
//     "https://upload.wikimedia.org/wikipedia/commons/6/6a/Transparent_green_leaf.png",
//   ];
  
// const Animation = () => {
//   const randomPosition = () => Math.random() * 100 + "%";
//   const randomDuration = () => Math.random() * 5 + 3;

//   return (
//     <div className="relative w-full h-screen bg-gradient-to-b from-green-300 to-green-600 overflow-hidden">
//       <div className="absolute inset-0 flex justify-center items-center">
//         <h1 className="text-4xl md:text-6xl font-bold text-white">
//           Pet Neverland LLP
//         </h1>
//       </div>

//       {leaves.map((leaf, index) => (
//         <motion.img
//           key={index}
//           src={leaf}
//           alt={`Leaf ${index}`}
//           className="absolute w-20 h-20 md:w-32 md:h-32"
//           style={{
//             left: randomPosition(),
//             top: randomPosition(),
//           }}
//           initial={{ opacity: 0, y: 50 }}
//           animate={{
//             opacity: 1,
//             y: [0, -100, 0],
//             rotate: [0, 360],
//           }}
//           transition={{
//             duration: randomDuration(),
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// export default Animation;


import { motion } from 'framer-motion';

const NeverlandScene = () => {
  // Leaf component with random animations
  const Leaf = ({ initialX }) => (
    <motion.div
      initial={{ 
        y: -100,
        x: initialX,
        rotate: Math.random() * 360 
      }}
      animate={{ 
        y: window.innerHeight + 100,
        rotate: Math.random() * 360 
      }}
      transition={{
        duration: 4 + Math.random() * 5,
        repeat: Infinity,
        ease: "linear"
      }}
      className="absolute text-4xl"
    >
      🍃
    </motion.div>
  );

  // Cat component with bouncing animation
  const Cat = () => (
    <motion.div
      animate={{ 
        y: ["0%", "-30%", "0%"],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="text-6xl absolute bottom-0"
    >
      🐈
    </motion.div>
  );

  // Bird component with flying animation
  const Bird = () => (
    <motion.div
      initial={{ x: -100 }}
      animate={{ 
        x: window.innerWidth + 100,
        y: ["0%", "10%", "-10%", "0%"]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }}
      className="text-4xl absolute"
    >
      🕊️
    </motion.div>
  );

  return (
    <div className="relative h-screen w-full bg-gradient-to-b from-blue-200 to-green-100 overflow-hidden">
      {/* Title */}
      <h1 className="text-center text-6xl font-bold pt-8 text-emerald-800">
        NEVERLAND
      </h1>

      {/* Floating leaves */}
      {[...Array(15)].map((_, i) => (
        <Leaf key={i} initialX={Math.random() * window.innerWidth} />
      ))}

      {/* Moving cats */}
      <div className="absolute bottom-0 left-1/4">
        <Cat />
      </div>
      <div className="absolute bottom-0 right-1/4">
        <Cat />
      </div>

      {/* Flying birds */}
      <div className="absolute top-1/4">
        <Bird />
      </div>
      <div className="absolute top-1/3">
        {/* <Bird /> */}
      </div>

      {/* Animated special elements */}
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-6xl absolute top-1/2 left-1/2"
      >
        
      </motion.div>

      {/* Grass layer
      <div className="absolute bottom-0 w-full h-32 bg-green-600">
        <div className="animate-marquee whitespace-nowrap text-4xl">
          🌿 🌱 🍃 🌿 🌱 🍃 🌿 🌱 �
        </div>
      </div> */}
    </div>
  );
};

export default NeverlandScene;