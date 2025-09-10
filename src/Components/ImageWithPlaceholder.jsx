// ImageWithPlaceholder.jsx
import { useEffect, useState } from "react";
import placeholder from "../Images/PlaceHolder.jpeg";
/**
 * Preloads `src` and shows `placeholder` until the real image is loaded.
 * - Use width/height or CSS to avoid layout shift.
 * - Provides lazy loading and onError fallback.
 */
export function ImageWithPlaceholder({
  src,
  alt = "",
  placeholder = placeholder,
  className = "",
  width,
  height,
  ...rest
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsLoaded(false);
    setHasError(false);

    if (!src) {
      setHasError(true);
      return;
    }

    const img = new Image();
    img.src = src;

    if (img.complete && img.naturalWidth > 0) {
      if (mounted) setIsLoaded(true);
    } else {
      img.onload = () => { if (mounted) setIsLoaded(true); };
      img.onerror = () => { if (mounted) setHasError(true); };
    }

    return () => {
      mounted = false;
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  const displaySrc = isLoaded && !hasError ? src : placeholder;

  return (
    <img
      src={displaySrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading="lazy"
      onError={(e) => { e.currentTarget.src = placeholder; }}
      {...rest}
    />
  );
}
