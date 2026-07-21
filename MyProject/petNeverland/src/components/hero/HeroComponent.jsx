import bg from "../../assets/bg.png";
import board from "../../assets/hero/board.png";
import {motion} from 'motion/react'
// Letter Images
import p from "../../assets/hero/p.png";
import e from "../../assets/hero/e.png";
import t from "../../assets/hero/t.png";
import n from "../../assets/hero/n.jpg";
import e1 from "../../assets/hero/e1.jpg";
import v from "../../assets/hero/v.jpg";
import e2 from "../../assets/hero/e2.jpg";
import r from "../../assets/hero/r.jpg";
import L from "../../assets/hero/L.png";
import a from "../../assets/hero/a.jpg";
import n1 from "../../assets/hero/n1.jpg";
import d from "../../assets/hero/d.jpg";
import Lottie from "lottie-react";

import monkey from "../../assets/monkey.json";
import parrot from "../../assets/parrot.json";
import snake1 from  "../../assets/snake1.png";
import lion from  "../../assets/lion.json";
import fish1 from  "../../assets/fish1.json";
import flamingo from  "../../assets/flamingo.json";
import tiger from  "../../assets/tiger.json";
import dog from  "../../assets/dog1.json";
import spider from  "../../assets/spider.json";
import bird from  "../../assets/bird.json";
import snake from  "../../assets/snake.json";
import snake2 from  "../../assets/snake2.json";



const HeroComponent = () => {
  return (
    <div
      className="relative w-full h-screen bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Board Image */}
      <div className="relative w-full flex justify-center items-center">
        <img src={board} alt="Board" className="w-full relative z-10" />

        

        {/* PET Letters */}
        <motion.div className="absolute top-[32%] left-1/2 transform -translate-x-1/2 flex gap-6 z-20" initial={{x:-600}} animate={{ x:-80}} transition={{ duration: 2, repeat: 1 }} >
          <img src={p} alt="P" className="w-[100px]" />
          <img src={e} alt="E" className="w-[100px]" />
          <img src={t} alt="T" className="w-[100px]" />
          <Lottie  animationData={monkey} loop={true} style={{ width: "100px", height: "100px" }} className="absolute top-[-90px] left-[135px] wave-line"/> 
          <Lottie  animationData={parrot} loop={true} style={{ width: "100px", height: "100px" }} className="absolute  top-[-25px] left-[-20px] "/> 
          <Lottie  animationData={snake} loop={true} style={{ width: "100px", height: "100px" }} className="absolute  top-[-40px] left-[240px] "/> 
          {/* <Lottie  animationData={snake2} loop={true} style={{ width: "100px", height: "100px" }} className="absolute  top-[-40px] left-[240px] "/>  */}
          {/* <motion.img src={snake1} alt="snake" className="w-[100px] absolute  top-[-50px] left-[250px]" animate={{ y: [0, 20, 0] }} transition={{ duration: 2, repeat: Infinity }} /> */}

          
        </motion.div>

        {/* NEVERLAND Letters */}
        <motion.div className="absolute top-[46%] left-[47%] transform -translate-x-1/2 flex gap-6 z-20" initial={{x:600}} animate={{ x:-500}} transition={{ duration: 2, repeat: 1 }} >
          <img src={n} alt="N" className="w-[140px]" />
          <img src={e1} alt="E" className="w-[140px]" />
          <img src={v} alt="V" className="w-[140px]" />
          <img src={e2} alt="E" className="w-[140px]" />
          <img src={r} alt="R" className="w-[140px]" />
          <img src={L} alt="L" className="w-[140px]" />
          <img src={a} alt="A" className="w-[140px]" />
          <img src={n1} alt="N" className="w-[140px]" />
          <img src={d} alt="D" className="w-[140px]" />
          <Lottie  animationData={lion} loop={true} style={{ width: "100px", height: "100px" }} className="absolute  top-[40px] left-[140px] "/> 
          <Lottie  animationData={fish1} loop={true} style={{ width: "100px", height: "100px" }} className="absolute  top-[40px] left-[30px] "/> 
          <Lottie  animationData={flamingo} loop={true} style={{ width: "100px", height: "100px" }} className="absolute  top-[40px] left-[420px] "/> 
          <Lottie  animationData={tiger} loop={true} style={{ width: "150px", height: "150px" }} className="absolute  top-[55px] left-[680px] "/> 
          <Lottie  animationData={dog} loop={true} style={{ width: "180px", height: "100px" }} className="absolute  top-[55px] left-[800px]  "  /> 
          <Lottie  animationData={bird} loop={true} style={{ width: "180px", height: "100px" }} className="absolute  top-[-20px] left-[920px]  "  /> 
          <motion.div animate={ { y: [0, 100, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute "> 
          <Lottie  animationData={spider} loop={true} style={{ width: "180px", height: "100px" }} className="absolute  top-[-30px] left-[1030px]  "  /> 
          </motion.div>

        </motion.div>

        {/* LLP Text */}
        <div className="absolute top-[60%] left-[60%] transform -translate-x-1/2 z-20">
          <h2 className="text-green-700 text-7xl font-bold">LLP</h2>
        </div>
      </div>
    </div>
  );
};

export default HeroComponent;
