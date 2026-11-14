"use client";

import { useEffect, useState } from "react";

// Slightly slower than the source clip for a calmer background.
const PLAYBACK_RATE = 0.8;

// Renders the looping hero video only when the user has not requested reduced motion.
// Until mounted (and when reduced motion is on) nothing renders, so the static image shows.
export default function HeroVideo() {
  const [allowMotion, setAllowMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAllowMotion(!query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  if (!allowMotion) return null;

  return (
    <video
      className="absolute inset-0 h-full w-full object-cover"
      src="/hero-bg.mp4"
      poster="/hero-bg.png"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      onLoadedMetadata={(e) => {
        e.currentTarget.playbackRate = PLAYBACK_RATE;
      }}
    />
  );
}
