import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext.tsx";

const binaryColumns = [
  "010011010101101001010010110101001011010101001",
  "101101001010011011010100101101001010010110101",
  "001011010010101101010010110100101101010010110",
  "110100101101001010110101001011010010101101001",
  "011010010110101001011010010101101001011010100",
  "100101101010010110100101011010010110101001011",
  "010110101001011010010101101001011010100101101",
  "101001011010010110101001011010010101101001011",
  "001101010010110100101011010100101101001010110",
  "110101001011010010101101001011010100101101001",
  "010010110101001011010010101101001011010100101",
  "101101001011010100101101001010110100101011010",
  "011010100101101001011010010101101001011010010",
  "100101101001010110100101101010010110100101011",
  "001011010100101101001011010100101101001010110",
  "110100101011010010110101001011010010101101001",
  "010110100101101010010110100101011010010110101",
  "101001011010010101101001011010100101101001011"
];

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

export const BinarySkullBackground = () => {
  const { theme } = useTheme();

  if (theme !== 'dark') return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-60">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_45%)]" />

      <div className="absolute inset-0 flex justify-between px-2 sm:px-6 mix-blend-screen">
        {binaryColumns.map((column, index) => (
          <motion.div
            key={`${column}-${index}`}
            className="font-mono text-[10px] sm:text-xs leading-4 sm:leading-5 text-white/45 whitespace-pre-wrap [writing-mode:vertical-rl] drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]"
            initial={{ y: index % 2 === 0 ? "-45%" : "-10%" }}
            animate={{ y: index % 2 === 0 ? ["-45%", "55%"] : ["-10%", "90%"] }}
            transition={{
              duration: 18 + (index % 6) * 3,
              repeat: Infinity,
              ease: "linear",
              delay: -(index * 1.7)
            }}
          >
            {`${column}${column}${column}`}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: [0.38, 0.62, 0.38], scale: [0.98, 1.01, 0.98] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          viewBox="0 0 420 520"
          className="w-[72vw] max-w-[720px] min-w-[320px] text-white drop-shadow-[0_0_28px_rgba(255,255,255,0.85)]"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="binary-skull-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.18" />
            </linearGradient>
          </defs>
          <path
            d="M210 42C122 42 62 104 62 190c0 53 20 91 54 119 13 11 20 27 20 44v53c0 17 14 31 31 31h18v-54h20v54h12v-54h20v54h18c17 0 31-14 31-31v-53c0-17 8-33 21-44 34-28 53-66 53-119 0-86-61-148-150-148Z"
            fill="none"
            stroke="url(#binary-skull-fade)"
            strokeWidth="7"
          />
          <path
            d="M137 197c0-25 18-45 43-45 23 0 39 18 39 42 0 27-20 47-46 47-22 0-36-17-36-44Zm102-3c0-24 16-42 39-42 25 0 43 20 43 45 0 27-14 44-36 44-26 0-46-20-46-47Z"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.75"
            strokeWidth="6"
          />
          <path
            d="M210 244l-23 50h46l-23-50ZM146 326h128M151 361h118"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.6"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {[
            { x: 120, y: 112, text: "010101" },
            { x: 210, y: 101, text: "110011" },
            { x: 287, y: 128, text: "001101" },
            { x: 106, y: 288, text: "101010" },
            { x: 211, y: 332, text: "011010" },
            { x: 291, y: 290, text: "110101" }
          ].map((item) => (
            <text
              key={`${item.x}-${item.y}`}
              x={item.x}
              y={item.y}
              textAnchor="middle"
              className="fill-white/70 font-mono text-[18px] tracking-widest"
            >
              {item.text}
            </text>
          ))}
        </svg>
      </motion.div>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.18),transparent_35%,rgba(5,5,5,0.35))]" />
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
