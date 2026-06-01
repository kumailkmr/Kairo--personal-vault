import { Variants, Transition } from "framer-motion";

export const transitionCalm: Transition = {
  type: "spring",
  stiffness: 80,
  damping: 18,
  mass: 0.8,
};

export const transitionSleekEase: Transition = {
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number], // Custom cubic-bezier (Apple style)
  duration: 0.6,
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: transitionSleekEase
  }
};

export const transitionSlow: Transition = {
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  duration: 1.2,
};

export const fadeSlideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitionSlow
  }
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitionCalm
  }
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: transitionCalm
  }
};

export const staggerContainer = (staggerChildren = 0.05): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
    }
  }
});

export const cardHover = {
  scale: 1.006,
  y: -2,
  transition: {
    type: "spring" as const,
    stiffness: 300,
    damping: 20
  }
};

export const buttonPress = {
  scale: 0.98,
  transition: {
    type: "spring" as const,
    stiffness: 500,
    damping: 15
  }
};

export const buttonHover = {
  scale: 1.02,
  transition: {
    type: "spring" as const,
    stiffness: 400,
    damping: 15
  }
};
