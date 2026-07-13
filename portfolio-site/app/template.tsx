"use client";
import { motion } from "framer-motion";

const ease = [0.7, 0, 0.3, 1] as const;

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <motion.div
        aria-hidden
        className="fixed inset-0 z-[80] pointer-events-none"
        style={{ background: "var(--accent)" }}
        initial={{ clipPath: "inset(0 0 0 0)" }}
        animate={{ clipPath: "inset(0 0 100% 0)" }}
        transition={{ duration: 0.5, ease }}
      />
      <motion.div
        aria-hidden
        className="fixed inset-0 z-[80] pointer-events-none"
        style={{ background: "var(--wipe)" }}
        initial={{ clipPath: "inset(0 0 0 0)" }}
        animate={{ clipPath: "inset(0 0 100% 0)" }}
        transition={{ duration: 0.6, ease, delay: 0.08 }}
      />
    </>
  );
}
