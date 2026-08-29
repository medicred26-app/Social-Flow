'use client';

import React, { useEffect, useState } from 'react';

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only show custom cursor accent on fine pointer devices (desktop/laptop)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    setIsVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = !!target.closest(
          'a, button, input, select, textarea, [role="button"], label, .cursor-pointer, summary'
        );
        setIsHovered(isClickable);
      }
    };

    const onMouseDown = () => setIsMouseDown(true);
    const onMouseUp = () => setIsMouseDown(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);
    const onWindowBlur = () => setIsVisible(false);
    const onWindowFocus = () => setIsVisible(true);
    const onVisibilityChange = () => {
      if (document.hidden) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    window.addEventListener('blur', onWindowBlur);
    window.addEventListener('focus', onWindowFocus);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('blur', onWindowBlur);
      window.removeEventListener('focus', onWindowFocus);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  if (!mounted || !isVisible) return null;

  // Simple ring that follows cursor with a slight lag via CSS transition
  const size = isHovered ? 40 : isMouseDown ? 20 : 28;
  const offset = size / 2;

  return (
    <div className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden select-none mix-blend-difference">
      {/* Single subtle ring — doesn't interfere with native cursor */}
      <div
        className="fixed top-0 left-0 rounded-full border transition-all duration-200 ease-out"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderColor: isHovered ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
          borderWidth: isHovered ? '2px' : '1.5px',
          transform: `translate3d(${position.x - offset}px, ${position.y - offset}px, 0) scale(${isMouseDown ? 0.8 : 1})`,
          backgroundColor: isHovered ? 'rgba(255,255,255,0.08)' : 'transparent',
        }}
      />
    </div>
  );
}
