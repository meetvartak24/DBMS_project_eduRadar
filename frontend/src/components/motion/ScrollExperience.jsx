import React, { useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export function ScrollExperience() {
  const reducedMotion = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 30 });
  const [showTop, setShowTop] = useState(false);

  useMotionValueEvent(scrollY, 'change', (position) => {
    setShowTop(position > 450);
  });

  return (
    <>
      <motion.div
        className="scroll-progress"
        aria-hidden="true"
        style={{ scaleX: reducedMotion ? scrollYProgress : progress }}
      />
      <AnimatePresence>
        {showTop && (
          <motion.button
            className="back-to-top"
            aria-label="Back to top"
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' })
            }
          >
            <ArrowUp size={18} />
            <span>Back to top</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
