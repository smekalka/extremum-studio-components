import { RefObject, useEffect } from "react";

export function useOutsideClick<T>(
  ref: RefObject<T>,
  callback: (ref: RefObject<T>) => void,
  updateDependency?: any[]
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // @ts-ignore
      if (ref.current && !ref.current.contains(event.target)) {
        callback(ref);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, ...(updateDependency || [])]);
}
