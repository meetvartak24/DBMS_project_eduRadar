export const easeOut = [0.22, 1, 0.36, 1];

export const reveal = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
};

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
