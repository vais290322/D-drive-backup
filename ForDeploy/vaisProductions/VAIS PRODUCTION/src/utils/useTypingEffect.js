import { useEffect, useRef, useState } from "react";

function useTypingEffect(text, speed = 150, delay = 1000) {
    const [visibleText, setVisibleText] = useState("");
    const indexRef = useRef(0);
    const directionRef = useRef(1); // 1 = typing, -1 = deleting
  
    useEffect(() => {
      const interval = setInterval(() => {
        setVisibleText(() => {
          const currentIndex = indexRef.current;
          const direction = directionRef.current;
  
          if (direction === 1) {
            const next = text.slice(0, currentIndex + 1);
            indexRef.current += 1;
            if (indexRef.current === text.length) {
              directionRef.current = -1;
              setTimeout(() => {}, delay);
            }
            return next;
          } else {
            const next = text.slice(0, currentIndex - 1);
            indexRef.current -= 1;
            if (indexRef.current === 0) {
              directionRef.current = 1;
            }
            return next;
          }
        });
      }, speed);
  
      return () => clearInterval(interval);
    }, [text, speed, delay]);
  
    return visibleText;
  }

  export default useTypingEffect;