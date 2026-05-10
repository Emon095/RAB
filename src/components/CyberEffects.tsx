import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext.tsx";

export const GlitchText = ({ text, className }: { text: string; className?: string }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={`relative inline-block ${className}`}>
      <motion.span
        className="relative z-10 block"
        initial={{ opacity: 1 }}
        animate={{
          x: [0, -2, 2, -1, 0],
          transition: { repeat: Infinity, duration: 0.2, repeatDelay: 4 },
        }}
      >
        {text}
      </motion.span>
      {!isLight && (
        <>
          <motion.span
            className="absolute top-0 left-0 -z-10 text-red-500 opacity-70 block"
            animate={{
              x: [0, -3, 3, -3, 0],
              y: [0, 2, -2, 2, 0],
              transition: { repeat: Infinity, duration: 0.15 },
            }}
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 35%, 0 35%)" }}
          >
            {text}
          </motion.span>
          <motion.span
            className="absolute top-0 left-0 -z-10 text-cyan-500 opacity-70 block"
            animate={{
              x: [0, 3, -3, 3, 0],
              y: [0, -2, 2, -2, 0],
              transition: { repeat: Infinity, duration: 0.2 },
            }}
            style={{ clipPath: "polygon(0 70%, 100% 70%, 100% 100%, 0 100%)" }}
          >
            {text}
          </motion.span>
        </>
      )}
    </div>
  );
};

export const CircuitLines = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={`absolute inset-0 -z-20 overflow-hidden pointer-events-none ${isLight ? 'opacity-5' : 'opacity-10'}`}>
      <svg width="100%" height="100%" className="text-red-500">
        <defs>
          <pattern
            id="circuit-pattern"
            x="0"
            y="0"
            width="200"
            height="200"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 20 L 180 20 L 180 180 L 20 180 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <circle cx="20" cy="20" r="2" fill="currentColor" />
            <circle cx="180" cy="180" r="2" fill="currentColor" />
            <path d="M 100 20 V 60 M 180 100 H 140 M 20 100 H 60 M 100 180 V 140" stroke="currentColor" strokeWidth="0.5" />
            <motion.path 
              d="M 20 100 L 180 100" 
              stroke="currentColor" 
              strokeWidth="1"
              animate={{ pathLength: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
      </svg>
    </div>
  );
};

export const DigitalMapBackground = () => {
  return (
    <div className="fixed inset-0 -z-30 overflow-hidden pointer-events-none opacity-10">
      <svg
        viewBox="0 0 1000 1000"
        className="w-full h-full text-cyber-red/20"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="map-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Stylized dots for the map - abstract representation */}
        {Array.from({ length: 150 }).map((_, i) => {
          const x = Math.random() * 800 + 100;
          const y = Math.random() * 800 + 100;
          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r={1}
              fill="currentColor"
              initial={{ opacity: 0.1 }}
              animate={{ 
                opacity: [0.1, 0.5, 0.1],
                scale: [1, 1.5, 1],
              }}
              transition={{ 
                duration: Math.random() * 3 + 2, 
                repeat: Infinity,
                delay: Math.random() * 2 
              }}
            />
          );
        })}

        {/* Animated connection lines (data streams) */}
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.path
            key={`line-${i}`}
            d={`M ${Math.random() * 1000} ${Math.random() * 1000} L ${Math.random() * 1000} ${Math.random() * 1000}`}
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 1, 0],
              opacity: [0, 0.4, 0.4, 0]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              delay: i * 2,
              ease: "linear"
            }}
          />
        ))}

        {/* Pulse nodes */}
        {[
          { x: 500, y: 400 }, // Central hub
          { x: 300, y: 600 },
          { x: 700, y: 300 }
        ].map((pos, i) => (
          <g key={`node-${i}`}>
            <circle cx={pos.x} cy={pos.y} r="4" fill="currentColor" className="animate-pulse" />
            <motion.circle
              cx={pos.x}
              cy={pos.y}
              r="4"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              animate={{ r: [4, 40], opacity: [0.8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

export const GlitchOverlay = () => {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.9) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 200);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!glitch) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden opacity-20">
      <div className="absolute top-1/4 left-0 w-full h-1 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)] animate-pulse" />
      <div className="absolute top-1/2 left-0 w-full h-2 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,1)] translate-x-4" />
      <div className="absolute top-3/4 left-0 w-full h-1 bg-white opacity-50" />
    </div>
  );
};
