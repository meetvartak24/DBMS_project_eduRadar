import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { easeOut } from '../../constants/motion.js';

export function AttendanceRing({ attendance, hasRecords }) {
  const reducedMotion = useReducedMotion();
  const progress = `${attendance * 3.6}deg`;

  return (
    <motion.div
      className="ring"
      initial={reducedMotion ? false : { '--progress': '0deg' }}
      whileInView={{ '--progress': progress }}
      style={reducedMotion ? { '--progress': progress } : undefined}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: reducedMotion ? 0 : 1.2, ease: easeOut }}
    >
      <div>
        <strong>{hasRecords ? `${attendance}%` : '—'}</strong>
        <span>ATTENDANCE</span>
      </div>
    </motion.div>
  );
}
