'use client';

import React, { useEffect, useState } from 'react';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show custom cursor on fine pointer devices (desktop/laptop)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    setIsVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if target is clickable
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = !!target.closest(
          'a, button, input, select, textarea, [role="button"], .cursor-pointer, input[type="checkbox"]'
        );
        setIsHovered(isClickable);
      }
    };

    const onMouseDown = () => setIsMouseDown(true);
    const onMouseUp = () => setIsMouseDown(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
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

  // Smooth lag effect for the trailing ring
  useEffect(() => {
    if (!isVisible) return;
    let animationFrameId: number;

    const updateTrailingPos = () => {
      setTrailingPos((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.25,
          y: prev.y + dy * 0.25,
        };
      });
      animationFrameId = requestAnimationFrame(updateTrailingPos);
    };

    animationFrameId = requestAnimationFrame(updateTrailingPos);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Central Pointer Dot */}
      <div
        className={`fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pointer-events-none z-[9999] transition-transform duration-75 ease-out shadow-md shadow-indigo-500/50 ${
          isMouseDown ? 'scale-75' : isHovered ? 'scale-150' : 'scale-100'
        }`}
        style={{
          transform: `translate3d(${position.x - 5}px, ${position.y - 5}px, 0)`,
        }}
      />

      {/* Trailing Outer Ring */}
      <div
        className={`fixed top-0 left-0 rounded-full border pointer-events-none z-[9998] transition-all duration-150 ease-out ${
          isHovered
            ? 'w-10 h-10 border-pink-500/80 bg-pink-500/10 scale-110 shadow-lg shadow-pink-500/20'
            : isMouseDown
            ? 'w-6 h-6 border-indigo-400/90 bg-indigo-500/20 scale-90'
            : 'w-8 h-8 border-indigo-500/40 bg-indigo-500/5 scale-100'
        }`}
        style={{
          transform: `translate3d(${trailingPos.x - (isHovered ? 20 : isMouseDown ? 12 : 16)}px, ${
            trailingPos.y - (isHovered ? 20 : isMouseDown ? 12 : 16)
          }px, 0)`,
        }}
      />
    </>
  );
}
