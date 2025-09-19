import { motion, AnimatePresence } from "framer-motion";
import { CircleCheck } from "lucide-react";

interface LoaderWithCheckProps {
  phase: "loading" | "check";
}

export default function LoaderWithCheck({ phase }: LoaderWithCheckProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-50">
      <AnimatePresence mode="wait">
        {phase === "loading" && (
          <motion.div
            key="spinner"
            className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
        )}
        {phase === "check" && (
          <motion.div
            key="check"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="flex items-center justify-center w-16 h-16 rounded-full bg-white"
          >
            <CircleCheck className="w-16 h-16 text-blue-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
