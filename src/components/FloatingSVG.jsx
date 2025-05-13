"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

function getRandomInRanges(ranges) {
  const range = ranges[Math.floor(Math.random() * ranges.length)];
  return Math.random() * (range[1] - range[0]) + range[0];
}

function getDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function isOverlapping(x, y, existingElements, minDistance) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  const pixelX = (x / 100) * viewportWidth;
  const pixelY = (y / 100) * viewportHeight;
  
  for (const element of existingElements) {
    const elementPixelX = (element.x / 100) * viewportWidth;
    const elementPixelY = (element.y / 100) * viewportHeight;
    
    const distance = getDistance(pixelX, pixelY, elementPixelX, elementPixelY);
    
    if (distance < minDistance) {
      return true; 
    }
  }
  
  return false; 
}

function getNonOverlappingPosition(region, existingElements, minDistance, maxAttempts = 50) {
  let attempts = 0;
  let x, y;
  
  do {
    x = getRandomInRanges(region.xRange);
    y = getRandomInRanges(region.yRange);
    attempts++;
    
    if (attempts >= maxAttempts) {
      console.warn("Could not find non-overlapping position after", maxAttempts, "attempts");
      break;
    }
  } while (isOverlapping(x, y, existingElements, minDistance));
  
  return { x, y };
}

const SvgElement = ({ element, mousePosition, isMouseMoving }) => {
  const [position, setPosition] = useState({ x: 0, y: 0, rotate: 0 });
  const animationRef = useRef(null);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const circleRadiusRef = useRef(element.circleRadius);
  const phaseRef = useRef(element.circleOffset);
  const prevTimeRef = useRef(Date.now());
  const lastMouseMoveTimeRef = useRef(0);
  
  const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
  const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;

  const offsetX = (mousePosition.x - centerX) / centerX;
  const offsetY = (mousePosition.y - centerY) / centerY;
  const cursorX = offsetX * element.moveFactor * 100;
  const cursorY = offsetY * element.moveFactor * 100;

  useEffect(() => {
    const animateFrame = () => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - prevTimeRef.current) / 1000;
      prevTimeRef.current = currentTime;

      if (!isMouseMoving && lastMouseMoveTimeRef.current > 0) {
        const currentX = lastPositionRef.current.x;
        const currentY = lastPositionRef.current.y;

        phaseRef.current = Math.atan2(currentY, currentX);

        const distance = Math.sqrt(currentX * currentX + currentY * currentY);
        circleRadiusRef.current = distance || element.circleRadius;
        lastMouseMoveTimeRef.current = 0;
      }

      let newX, newY, newRotate;
      
      if (isMouseMoving) {
        newX = cursorX;
        newY = cursorY;
        newRotate = position.rotate;
        
        lastPositionRef.current = { x: newX, y: newY };
        lastMouseMoveTimeRef.current = currentTime;
      } else {

        phaseRef.current += deltaTime * (Math.PI * 2) / element.circleSpeed * (element.clockwise ? 1 : -1);
        
        newX = Math.cos(phaseRef.current) * circleRadiusRef.current;
        newY = Math.sin(phaseRef.current) * circleRadiusRef.current;
        
        if (Math.abs(circleRadiusRef.current - element.circleRadius) > 0.1) {
          circleRadiusRef.current += (element.circleRadius - circleRadiusRef.current) * 0.005;
        }
        
        newRotate = (phaseRef.current / (Math.PI * 2)) * 360;
      }

      setPosition({
        x: newX,
        y: newY,
        rotate: newRotate
      });

      animationRef.current = requestAnimationFrame(animateFrame);
    };

    animationRef.current = requestAnimationFrame(animateFrame);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [element.circleRadius, element.circleSpeed, element.clockwise, isMouseMoving, cursorX, cursorY, position.rotate]);

  return (
    <div
      className="absolute transition-transform duration-50 ease-linear"
      style={{
        left: `${element.x}%`,
        top: `${element.y}%`,
        width: element.size,
        height: element.size,
        opacity: 0.5,
        transform: `translate(${position.x}px, ${position.y}px) rotate(${position.rotate}deg)`,
        filter: "drop-shadow(0 0 3px rgba(207, 98, 219, 0.2))",
      }}
    >
      <div
        className="w-full h-full bg-contain bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${element.svgPath})`,
          filter: "invert(46%) sepia(54%) saturate(3738%) hue-rotate(258deg) brightness(91%) contrast(101%)",
        }}
      />
    </div>
  );
};

const FloatingSvgs = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [elements, setElements] = useState([]);
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const mouseTimerRef = useRef(null);

  const svgPaths = [
    "/music-svgrepo-com.svg",
    "/angles-up-svgrepo-com.svg",
    "/christmas-tree-svgrepo-com.svg",
    "/cloud-rain-svgrepo-com.svg",
    "/eye-slash-svgrepo-com.svg",
    "/face-smile-svgrepo-com.svg",
    "/ghost-svgrepo-com.svg",
    "/lightbulb-alt-svgrepo-com.svg",
    "/radio-svgrepo-com.svg",
  ];

  useEffect(() => {
    const regionConfigs = [
      { xRange: [[0, 100]], yRange: [[0, 25]] },
      { xRange: [[0, 30]], yRange: [[30, 60]] },
      { xRange: [[75, 100]], yRange: [[30, 60]] },
      { xRange: [[0, 100]], yRange: [[70, 100]] },
    ];

    const generated = [];
    let idCounter = 0;
    const minDistance = 55;
    regionConfigs.forEach((region, regionIndex) => {
      const regionElements = [];
      
      svgPaths.forEach((svgPath, pathIndex) => {
        for (let i = 0; i < 3; i++) {
          const position = getNonOverlappingPosition(region, regionElements, minDistance);
          
          const element = {
            id: idCounter++,
            size: Math.floor(Math.random() * 10) + 15,
            x: position.x,
            y: position.y,
            rotation: Math.random() * 30 - 15,
            moveFactor: Math.random() * 0.08 + 0.05,
            svgPath: svgPath,
            circleRadius: Math.random() * 20 + 10, 
            circleSpeed: Math.random() * 5 + 2,    
            circleOffset: Math.random() * Math.PI * 2, 
            clockwise: Math.random() > 0.5,        
          };
          
          regionElements.push(element);
          generated.push(element);
        }
      });
    });

    setElements(generated);

    setMousePosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
      
      setIsMouseMoving(true);
      
      if (mouseTimerRef.current) {
        clearTimeout(mouseTimerRef.current);
      }
      
      mouseTimerRef.current = setTimeout(() => {
        setIsMouseMoving(false);
      }, 300);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (mouseTimerRef.current) {
        clearTimeout(mouseTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {elements.map((element) => (
        <SvgElement 
          key={element.id}
          element={element}
          mousePosition={mousePosition}
          isMouseMoving={isMouseMoving}
        />
      ))}
    </div>
  );
};

export default FloatingSvgs;