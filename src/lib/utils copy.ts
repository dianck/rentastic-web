import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// src/lib/utils.ts
// export function cn(...inputs: (string | undefined | null | false)[]): string {
//   return inputs.filter(Boolean).join(' ')
// }
