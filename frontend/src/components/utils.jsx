// All utilies will be stored here
import { useState, useCallback } from "react";

export function useAnimatedToggle(duration = 300) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const open = useCallback(() => {
    setVisible(true);
    setAnimating(true);
  }, []);
  const close = useCallback(() => {
    setAnimating(false);
    setTimeout(() => setVisible(false), duration);
  }, [duration]);
  const shouldRender = visible || animating;
  return { visible, animating, open, close, shouldRender };
}
