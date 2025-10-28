'use client';

import * as React from 'react';
import { Progress as ProgressPrimitive } from 'radix-ui';
import { motion } from 'motion/react';

import { getStrictContext } from '@/lib/get-strict-context';

type ProgressContextType = {
  value: number | null;
};

const [ProgressProvider, useProgress] =
  getStrictContext<ProgressContextType>('ProgressContext');

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & {
  value?: number | null;
};

function Progress({ value, ...props }: ProgressProps) {
  return (
    <ProgressProvider value={{ value: value ?? 0 }}>
      <ProgressPrimitive.Root data-slot="progress" value={value ?? 0} {...props} />
    </ProgressProvider>
  );
}

const MotionProgressIndicator = motion.create(ProgressPrimitive.Indicator);

type ProgressIndicatorProps = React.ComponentProps<
  typeof MotionProgressIndicator
>;

function ProgressIndicator({
  transition = { type: 'spring', stiffness: 100, damping: 30 },
  ...props
}: ProgressIndicatorProps) {
  const { value } = useProgress();
  const isIndeterminate = value === null;

  return (
    <MotionProgressIndicator
      data-slot="progress-indicator"
      animate={
        isIndeterminate
          ? { x: ['-100%', '100%'] }
          : { x: `-${100 - (value || 0)}%` }
      }
      transition={
        isIndeterminate
          ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
          : transition
      }
      {...props}
    />
  );
}

export {
  Progress,
  ProgressIndicator,
  useProgress,
  type ProgressProps,
  type ProgressIndicatorProps,
  type ProgressContextType,
};
