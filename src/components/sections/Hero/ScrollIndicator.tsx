'use client';

// ScrollIndicator — petit chevron animé en bas du Hero. Disparaît après le premier scroll user.
// PRD §3 Module 2.
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useState } from 'react';

type ScrollIndicatorProps = {
  label: string;
};

export function ScrollIndicator({ label }: ScrollIndicatorProps) {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);

  // Disparaît après 80px de scroll — premier coup de molette / swipe.
  useMotionValueEvent(scrollY, 'change', (current) => {
    setVisible(current < 80);
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-fg-muted"
          aria-hidden="true"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">{label}</span>
          {/* Chevron pulse — Tailwind animate-bounce trop bouncy, on fait du custom keyframes via Framer. */}
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
            className="block h-3 w-px bg-fg-muted"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
