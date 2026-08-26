'use client';

import React, { useEffect, useState } from 'react';

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isSectionHovered, setIsSectionHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only show custom cursor on fine pointer devices (desktop/laptop)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    setIsVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Detect hover state over interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = !!target.closest(
          'a, button, input, select, textarea, [role="button"], label, .cursor-pointer, summary, input[type="checkbox"], input[type="radio"], [data-hover="true"]'
        );
        const isSection = !!target.closest('.interactive-section, .interactive-card, section, article, form, [data-section="true"]');
        setIsHovered(isClickable);
        setIsSectionHovered(isSection && !isClickable);
      }
    };

    const onMouseDown = () => setIsMouseDown(true);
    const onMouseUp = () => setIsMouseDown(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  // Smooth physics lag interpolation for trailing blurred ring
  useEffect(() => {
    if (!isVisible || !mounted) return;
    let animationFrameId: number;

    const updateTrailingPos = () => {
      setTrailingPos((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.3,
          y: prev.y + dy * 0.3,
        };
      });
      animationFrameId = requestAnimationFrame(updateTrailingPos);
    };

    animationFrameId = requestAnimationFrame(updateTrailingPos);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position, isVisible, mounted]);

  if (!mounted || !isVisible) return null;

  const currentSize = isHovered ? 44 : isSectionHovered ? 56 : isMouseDown ? 24 : 32;
  const offset = currentSize / 2;

  return (
    <div className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden select-none">
      {/* Layer 1: Ambient Blurred Neon Glow Aura */}
      <div
        className={`fixed top-0 left-0 rounded-full transition-all duration-300 ease-out pointer-events-none ${
          isHovered
            ? 'w-24 h-24 bg-gradient-to-r from-pink-500/30 to-purple-500/30 blur-xl opacity-90'
            : isSectionHovered
            ? 'w-32 h-32 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-2xl opacity-75'
            : isMouseDown
            ? 'w-14 h-14 bg-pink-500/30 blur-lg opacity-80'
            : 'w-16 h-16 bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-lg opacity-60'
        }`}
        style={{
          transform: `translate3d(${trailingPos.x - (isHovered ? 48 : isSectionHovered ? 64 : isMouseDown ? 28 : 32)}px, ${
            trailingPos.y - (isHovered ? 48 : isSectionHovered ? 64 : isMouseDown ? 28 : 32)
          }px, 0)`,
        }}
      />

      {/* Layer 2: Frosted Glass Backdrop-Blur Trailing Ring */}
      <div
        className={`fixed top-0 left-0 rounded-full border pointer-events-none transition-all duration-150 ease-out backdrop-blur-md ${
          isHovered
            ? 'w-11 h-11 border-pink-400/90 bg-pink-500/20 backdrop-blur-lg scale-110 shadow-[0_0_30px_rgba(236,72,153,0.5)]'
            : isSectionHovered
            ? 'w-14 h-14 border-indigo-400/70 bg-indigo-500/10 backdrop-blur-md scale-105 shadow-[0_0_25px_rgba(99,102,241,0.3)]'
            : isMouseDown
            ? 'w-6 h-6 border-indigo-400/90 bg-indigo-500/30 backdrop-blur-sm scale-90 shadow-[0_0_15px_rgba(99,102,241,0.5)]'
            : 'w-8 h-8 border-indigo-400/40 bg-indigo-500/10 dark:bg-indigo-400/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
        }`}
        style={{
          transform: `translate3d(${trailingPos.x - offset}px, ${trailingPos.y - offset}px, 0)`,
        }}
      />

      {/* Layer 3: Ultra-High Precision Core Pointer Tip (Exact clientX / clientY Pinned) */}
      <div
        className={`fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 pointer-events-none transition-transform duration-75 ease-out shadow-[0_0_8px_rgba(99,102,241,1)] ${
          isMouseDown ? 'scale-75' : isHovered ? 'scale-125 ring-2 ring-white/50' : 'scale-100'
        }`}
        style={{
          transform: `translate3d(${position.x - 5}px, ${position.y - 5}px, 0)`,
        }}
      >
        <span className="absolute inset-0 rounded-full bg-white/60 blur-[0.5px]" />
      </div>
    </div>
  );
}
