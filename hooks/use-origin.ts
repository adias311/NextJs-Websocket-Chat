import { useState, useEffect } from "react";


export function useOrigin() {

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const origin = typeof window !== 'undefined' && window.location.origin && mounted ? window.location.origin : '';

  return origin

}