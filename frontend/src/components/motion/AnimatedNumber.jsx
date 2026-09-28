import React, { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';
import { easeOut } from '../../constants/motion.js';

/** Keep the real value accessible while the decorative counter catches up. */
export function AnimatedNumber({ value, enabled = true }) {
  const element = useRef(null);
  const visible = useInView(element, { once: true, amount: 0.5 });
  const reducedMotion = useReducedMotion();
  const text = String(value);

  useEffect(() => {
    const match = text.match(/^(\d+)(?:\.(\d+))?(%)?$/);
    if (!enabled || !visible || reducedMotion || !match) return;

    const decimals = match[2]?.length || 0;
    const width = match[1].startsWith('0') ? match[1].length : 1;
    const unit = match[3] || '';
    const animation = animate(0, Number.parseFloat(text), {
      duration: 0.95,
      ease: easeOut,
      onUpdate: (current) => {
        if (!element.current) return;
        const formatted = current.toFixed(decimals);
        element.current.textContent =
          formatted.padStart(width + (decimals ? decimals + 1 : 0), '0') + unit;
      },
      onComplete: () => {
        if (element.current) element.current.textContent = text;
      },
    });

    return () => {
      animation.stop();
      if (element.current) element.current.textContent = text;
    };
  }, [text, visible, reducedMotion, enabled]);

  return (
    <span className="animated-number">
      <span className="sr-only">{text}</span>
      <span ref={element} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
