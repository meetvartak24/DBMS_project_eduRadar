import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { usePointerDepth } from '../../hooks/usePointerDepth.js';

export function WelcomeBanner({ profile }) {
  const target = useRef(null);
  const pointer = usePointerDepth();
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-22, 22]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-18, 12]);
  const glowX = useTransform(scrollYProgress, [0, 1], ['-15%', '35%']);

  return (
    <motion.div
      className="welcome-strip scroll-welcome"
      ref={target}
      style={pointer.tilt}
      {...pointer.handlers}
    >
      <motion.div className="pointer-spotlight" aria-hidden="true" style={pointer.spotlight} />
      <motion.div
        className="welcome-glow"
        aria-hidden="true"
        style={{ x: reducedMotion ? 0 : glowX }}
      />
      <div className="welcome-copy">
        <span className="small-badge">
          {profile.branch || 'Student'} · Semester {profile.semester}
        </span>
        <h2>Your next chapter starts with today.</h2>
        <p>Stay curious. Stay consistent. You’re making progress.</p>
      </div>
      <motion.div
        className="orb"
        aria-hidden="true"
        style={{ y: reducedMotion ? 0 : y, rotate: reducedMotion ? -10 : rotate }}
      >
        <GraduationCap size={56} />
        <span>LEARN · GROW · ACHIEVE</span>
      </motion.div>
    </motion.div>
  );
}
