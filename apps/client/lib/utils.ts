import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shrinkDown(value:string, len:number=5) {
  return `${value.slice(0, len)}...${value.slice(value.length - len)}`;
}