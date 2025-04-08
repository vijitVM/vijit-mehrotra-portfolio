import { useEffect, useState, RefObject } from 'react';
import { useInView } from 'framer-motion';

export function useSectionObserver({ 
  ref, 
  threshold = 0.2, 
  once = false 
}: { 
  ref: RefObject<HTMLElement>; 
  threshold?: number; 
  once?: boolean; 
}) {
  const isInView = useInView(ref, { once, amount: threshold });
  return { isInView };
}