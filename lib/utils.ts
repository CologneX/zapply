import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Wraps a Next.js Server Action promise.
 * It inspects the result and throws a client-side error if the action
 * returned an object with an `error` property.
 * This allows React Query's `error` state and `onError` callback to be triggered.
 * @param actionPromise The promise returned by calling a server action.
 * @returns The successful result of the server action.
 * @throws {Error} Throws an error with the message provided by the server action.
 */
export const ActionErrorWrapper = async <T>(
  actionPromise: Promise<(T & { error?: string; }) | void>
): Promise<T | void> => {
  const result = await actionPromise;

  if (result?.error) {
    throw new Error(result.error);
  }

  return result;
};