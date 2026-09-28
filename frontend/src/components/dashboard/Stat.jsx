import React from 'react';
import { motion } from 'framer-motion';
import { reveal } from '../../constants/motion.js';
import { AnimatedNumber } from '../motion/AnimatedNumber.jsx';

export function Stat({ label, value, suffix, icon: Icon, detail, animateValue = true }) {
  return (
    <motion.section className="stat" variants={reveal} whileHover={{ y: -3 }}>
      <div>
        <span>{label}</span>
        <Icon size={19} />
      </div>
      <strong>
        <AnimatedNumber value={value} enabled={animateValue} />
        <small>{suffix}</small>
      </strong>
      <p>{detail}</p>
    </motion.section>
  );
}
