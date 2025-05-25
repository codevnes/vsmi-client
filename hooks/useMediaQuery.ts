"use client";

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // Create a media query
    const media = window.matchMedia(query);
    
    // Initial check
    setMatches(media.matches);
    
    // Add listener for changes
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };
    
    // Listen for changes
    media.addEventListener('change', listener);
    
    // Clean up
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);
  
  return matches;
} 