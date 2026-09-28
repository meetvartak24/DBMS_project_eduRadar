import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { easeOut } from '../../constants/motion.js';

export function ScrollReveal({ children, className, delay = 0 }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.section
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 28, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reducedMotion ? 0 : 0.6, delay, ease: easeOut }}
    >
      {children}
    </motion.section>
  );
}
