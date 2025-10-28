'use client';

import { motion, AnimatePresence } from 'motion/react';
import {
  Progress,
  ProgressIndicator,
} from '@/components/animate-ui/primitives/radix/progress';

interface FullScreenProgressProps {
  isVisible: boolean;
  message?: string;
}

export function FullScreenProgress({
  isVisible,
  message = 'Generating suggestions...',
}: FullScreenProgressProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="progress-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-64">
              <Progress value={null} className="h-1 bg-muted">
                <ProgressIndicator className="h-full bg-primary" />
              </Progress>
            </div>
            {message && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.2 }}
                className="text-center text-sm text-muted-foreground"
              >
                {message}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
