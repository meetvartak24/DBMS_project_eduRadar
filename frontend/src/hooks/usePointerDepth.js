import { useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

/** Decorative pointer feedback only; touch and pen input keep the banner still. */
export function usePointerDepth() {
  const reducedMotion = useReducedMotion();
  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(50);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const visibility = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 140, damping: 22 });
  const rotateY = useSpring(tiltY, { stiffness: 140, damping: 22 });
  const opacity = useSpring(visibility, { stiffness: 180, damping: 25 });
  const background = useMotionTemplate`radial-gradient(340px circle at ${pointerX}% ${pointerY}%, #b0e3f02b, transparent 75%)`;

  function reset() {
    tiltX.set(0);
    tiltY.set(0);
    visibility.set(0);
  }

  function onPointerMove(event) {
    if (reducedMotion || event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
    pointerX.set(x * 100);
    pointerY.set(y * 100);
    tiltX.set((0.5 - y) * 4);
    tiltY.set((x - 0.5) * 4);
    visibility.set(1);
  }

  return {
    handlers: { onPointerMove, onPointerLeave: reset, onPointerCancel: reset },
    tilt: {
      rotateX: reducedMotion ? 0 : rotateX,
      rotateY: reducedMotion ? 0 : rotateY,
      transformPerspective: 1100,
    },
    spotlight: { background, opacity: reducedMotion ? 0 : opacity },
  };
}
