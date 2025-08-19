/**
 * Utility functions for formatting various data types
 */

/**
 * Formats a file size in bytes to a human-readable string (KB, MB, GB)
 * @param bytes - The size in bytes to format
 * @returns A formatted string with the appropriate unit (B, KB, MB, GB, TB)
 */
import { type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge";

export function cn(p0: string, p1: string, inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 0) return 'Invalid size';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  // Don't exceed the available units
  const unitIndex = Math.min(i, units.length - 1);
  
  // Convert to the appropriate unit and round to 2 decimal places
  const size = bytes / Math.pow(1024, unitIndex);
  
  // Format with 2 decimal places for larger units, but no decimals for bytes
  return unitIndex === 0 
    ? `${Math.round(size)} ${units[unitIndex]}` 
    : `${size.toFixed(2)} ${units[unitIndex]}`;
}

export const generateUUID = () => crypto.randomUUID()
