"use client";
import { useEffect, useState } from "react";

function getRandomInRanges(ranges) {
  const range = ranges[Math.floor(Math.random() * ranges.length)];
  return Math.random() * (range[1] - range[0]) + range[0];
}

const FloatingSvgs = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [elements, setElements] = useState([]);

  const svgPath = "/music-svgrepo-com.svg";

  useEffect(() => {
    const regionConfigs = [
      { xRange: [[0, 100]], yRange: [[0, 25]] },
      { xRange: [[0, 30]], yRange: [[30, 75]] },
      { xRange: [[75, 100]], yRange: [[30, 75]] },
      { xRange: [[0, 100]], yRange: [[75, 100]] },
    ];

    const generated = [];
    let idCounter = 0; // Ensure unique IDs

    regionConfigs.forEach((region) => {
      for (let i = 0; i < 10; i++) {
        generated.push({
          id: idCounter++,
          size: Math.floor(Math.random() *10) + 10, 
          x: getRandomInRanges(region.xRange),
          y: getRandomInRanges(region.yRange),
          rotation: Math.random() * 30 - 15,
          moveFactor: Math.random() * 0.08 + 0.05,
        });
      }
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
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {elements.map((element) => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const offsetX = (mousePosition.x - centerX) / centerX;
        const offsetY = (mousePosition.y - centerY) / centerY;

        const moveX = offsetX * element.moveFactor * 100;
        const moveY = offsetY * element.moveFactor * 100;

        return (
          <div
            key={element.id}
            className="absolute transition-transform duration-300 ease-out"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: element.size,
              height: element.size,
              opacity: 0.5,
              transform: `translate(${moveX}px, ${moveY}px) rotate(${element.rotation}deg)`,
              filter: "drop-shadow(0 0 3px rgba(207, 98, 219, 0.2))",
            }}
          >
            <div
              className="w-full h-full bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${svgPath})`,
                filter: "invert(46%) sepia(54%) saturate(3738%) hue-rotate(258deg) brightness(91%) contrast(101%)",



              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default FloatingSvgs;
