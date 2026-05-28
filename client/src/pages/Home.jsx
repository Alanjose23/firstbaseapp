import React from 'react';
import { motion } from 'framer-motion';
import { AuroraBackground } from '../components/ui/aurora-background';
import '../styling/Home.css';

/* ── Heart shape definitions ─────────────────────────────────────────── */

const HeartFilled = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const HeartOutline = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const HeartDoubleOutline = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke={color} strokeWidth="2.2" />
    <path d="M12 18.2l-1.1-1C6.7 13.5 4 10.9 4 8.5 4 6.57 5.57 5 7.5 5c1.04 0 2.04.49 2.7 1.26L12 8.15l1.8-1.89C14.46 5.49 15.46 5 16.5 5 18.43 5 20 6.57 20 8.5c0 2.4-2.7 5-7.1 8.7l-.9.7-.9-.7z" stroke={color} strokeWidth="0.8" opacity="0.5" />
  </svg>
);

const HeartGradient = ({ id, colorA, colorB, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <defs>
      <linearGradient id={`hg-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={colorA} />
        <stop offset="100%" stopColor={colorB} />
      </linearGradient>
    </defs>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={`url(#hg-${id})`} />
  </svg>
);

const HeartSparkle = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <path d="M16 28l-1.9-1.74C7.2 20.3 3 16.6 3 11.5 3 7.36 6.36 4 10.5 4c2.3 0 4.5 1.08 5.5 2.78C17 4.08 19.2 3 21.5 3 25.64 3 29 6.36 29 10.5c0 5.1-4.2 8.8-11.1 14.76L16 28z" fill={color} />
    <line x1="16" y1="1" x2="16" y2="4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="16" y1="28" x2="16" y2="31" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="1" y1="16" x2="4" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="28" y1="16" x2="31" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const HeartDashed = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke={color} strokeWidth="1.6" strokeDasharray="2.5 2" />
  </svg>
);

const HeartGlow = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <defs>
      <filter id={`glow-${color.replace('#', '')}`}>
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={color} filter={`url(#glow-${color.replace('#', '')})`} />
  </svg>
);

const HeartRainbow = ({ id, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <defs>
      <linearGradient id={`rb-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#ff0000" />
        <stop offset="16%"  stopColor="#ff7700" />
        <stop offset="33%"  stopColor="#ffee00" />
        <stop offset="50%"  stopColor="#00cc44" />
        <stop offset="66%"  stopColor="#0066ff" />
        <stop offset="83%"  stopColor="#8800ff" />
        <stop offset="100%" stopColor="#ff0099" />
      </linearGradient>
    </defs>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={`url(#rb-${id})`} />
  </svg>
);

const HeartHollow = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.4" />
  </svg>
);

const HeartStriped = ({ color, id, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <defs>
      <pattern id={`stripe-${id}`} patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="4" stroke={color} strokeWidth="2" />
      </pattern>
      <clipPath id={`clip-${id}`}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </clipPath>
    </defs>
    <rect width="24" height="24" fill={`url(#stripe-${id})`} clipPath={`url(#clip-${id})`} />
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke={color} strokeWidth="1.2" />
  </svg>
);

/* ── Heart data ──────────────────────────────────────────────────────────
   `anim` picks one of five CSS keyframe curves (a–e) so each heart moves
   with a distinct rhythm while staying on the compositor thread.          */
const HEARTS = [
  { id: 1,  variant: 'filled',        color: '#e63946',                left: '4%',  top: '12%', size: 36, dur: '7s',  delay: '0s',    anim: 'a' },
  { id: 2,  variant: 'outline',       color: '#ff69b4',                left: '88%', top: '8%',  size: 28, dur: '9s',  delay: '-1.2s', anim: 'b' },
  { id: 3,  variant: 'gradient',      colorA: '#f97316', colorB: '#facc15', left: '22%', top: '80%', size: 42, dur: '8s',  delay: '-0.5s', anim: 'c' },
  { id: 4,  variant: 'rainbow',                                        left: '76%', top: '72%', size: 38, dur: '11s', delay: '-2s',   anim: 'd' },
  { id: 5,  variant: 'doubleOutline', color: '#a855f7',                left: '55%', top: '6%',  size: 30, dur: '7s',  delay: '-3s',   anim: 'e' },
  { id: 6,  variant: 'sparkle',       color: '#06b6d4',                left: '10%', top: '55%', size: 44, dur: '10s', delay: '-1.8s', anim: 'a' },
  { id: 7,  variant: 'glow',          color: '#10b981',                left: '90%', top: '42%', size: 34, dur: '8s',  delay: '-0.8s', anim: 'b' },
  { id: 8,  variant: 'dashed',        color: '#f59e0b',                left: '38%', top: '90%', size: 26, dur: '9s',  delay: '-2.5s', anim: 'c' },
  { id: 9,  variant: 'hollow',        color: '#ec4899',                left: '67%', top: '20%', size: 40, dur: '6s',  delay: '-1.5s', anim: 'd' },
  { id: 10, variant: 'striped',       color: '#8b5cf6',                left: '48%', top: '75%', size: 32, dur: '12s', delay: '-0.3s', anim: 'e' },
  { id: 11, variant: 'filled',        color: '#ef4444',                left: '80%', top: '56%', size: 22, dur: '8s',  delay: '-4s',   anim: 'a' },
  { id: 12, variant: 'gradient',      colorA: '#ec4899', colorB: '#8b5cf6', left: '15%', top: '28%', size: 48, dur: '10s', delay: '-1.1s', anim: 'b' },
  { id: 13, variant: 'glow',          color: '#f43f5e',                left: '62%', top: '88%', size: 28, dur: '7s',  delay: '-3.5s', anim: 'c' },
  { id: 14, variant: 'outline',       color: '#34d399',                left: '3%',  top: '82%', size: 36, dur: '9s',  delay: '-2.2s', anim: 'd' },
  { id: 15, variant: 'rainbow',                                        left: '93%', top: '22%', size: 44, dur: '13s', delay: '-0.7s', anim: 'e' },
  { id: 16, variant: 'sparkle',       color: '#fb923c',                left: '30%', top: '5%',  size: 30, dur: '8s',  delay: '-4.5s', anim: 'b' },
  { id: 17, variant: 'hollow',        color: '#38bdf8',                left: '72%', top: '48%', size: 26, dur: '6s',  delay: '-1.9s', anim: 'c' },
  { id: 18, variant: 'dashed',        color: '#a3e635',                left: '45%', top: '18%', size: 34, dur: '10s', delay: '-3.2s', anim: 'd' },
  { id: 19, variant: 'doubleOutline', color: '#f472b6',                left: '20%', top: '65%', size: 40, dur: '9s',  delay: '-0.9s', anim: 'a' },
  { id: 20, variant: 'striped',       color: '#fb7185',                left: '85%', top: '85%', size: 30, dur: '11s', delay: '-2.8s', anim: 'e' },
];

function HeartShape({ h }) {
  switch (h.variant) {
    case 'filled':        return <HeartFilled        color={h.color}  size={h.size} />;
    case 'outline':       return <HeartOutline       color={h.color}  size={h.size} />;
    case 'doubleOutline': return <HeartDoubleOutline color={h.color}  size={h.size} />;
    case 'gradient':      return <HeartGradient      id={h.id} colorA={h.colorA} colorB={h.colorB} size={h.size} />;
    case 'sparkle':       return <HeartSparkle       color={h.color}  size={h.size} />;
    case 'dashed':        return <HeartDashed        color={h.color}  size={h.size} />;
    case 'glow':          return <HeartGlow          color={h.color}  size={h.size} />;
    case 'rainbow':       return <HeartRainbow       id={h.id}        size={h.size} />;
    case 'hollow':        return <HeartHollow        color={h.color}  size={h.size} />;
    case 'striped':       return <HeartStriped       color={h.color}  id={h.id}     size={h.size} />;
    default:              return null;
  }
}

/* ── Page ─────────────────────────────────────────────────────────────── */
const Home = () => (
  <AuroraBackground className="!bg-[#EADEDA] min-h-screen">
    {/* Red radial background glow */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(ellipse 70% 55% at 50% 55%, rgba(180,30,40,0.22) 0%, rgba(138,48,51,0.10) 45%, transparent 72%)',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />

    {/* Floating hearts — CSS-animated, runs on compositor thread */}
    {HEARTS.map((h) => (
      <div
        key={h.id}
        className="floating-heart"
        style={{
          left: h.left,
          top: h.top,
          zIndex: 1,
          animation: `heart-float-${h.anim} ${h.dur} ${h.delay} ease-in-out infinite`,
        }}
      >
        <HeartShape h={h} />
      </div>
    ))}

    {/* Hero content — framer-motion used only for the one-shot entrance */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
      style={{ position: 'relative', zIndex: 10 }}
    >
      <div className="hero">
        <div className="hero-content">
          <span className="hero-badge">Dating &amp; Connections</span>
          <h1 className="hero-title">First Base</h1>
          <p className="hero-subtitle">
            Where every great love story begins.
            <br />
            Connect, share, and cherish your moments together.
          </p>
          <div className="hero-divider">♥ ♥ ♥</div>
          <div className="hero-image-wrap">
            <img
              src="https://img.freepik.com/premium-vector/couple-hands-with-love-heart-shape-marry-marriage-affection-wedding-valentine-romantic-logo_358185-399.jpg?w=2000"
              alt="First Base — couple with heart"
            />
          </div>
        </div>
      </div>
    </motion.div>
  </AuroraBackground>
);

export default Home;
