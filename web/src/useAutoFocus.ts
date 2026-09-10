import { useEffect, useRef } from "react";

/** Moves focus to the screen's root on mount, so keyboard and
 * screen-reader users land somewhere sensible after a screen change
 * instead of keeping focus on a button that no longer exists (or nothing
 * at all) -- React doesn't manage focus across route/screen swaps itself. */
export function useAutoFocus<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return ref;
}
