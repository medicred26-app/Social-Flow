'use client';

import React, { useEffect, useState } from 'react';

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hoverType, setHoverType] = useState<'clickable' | 'info' | 'default'>('default');

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
        // Detect clickable elements
        const isClickable = !!target.closest(
          'a, button, input, select, textarea, [role="button"], label, .cursor-pointer, summary, [onClick]'
        );

        // Detect informational panels, cards, statistics, widgets, containers, navigation items
        const isInfoPanel = !!target.closest(
          '.interactive-card, .interactive-section, .interactive-stat-card, .interactive-panel, [data-interactive="true"], article, section, .card-hover, .stat-card, .nav-item'
        );

        if (isClickable) {
          setIsHovered(true);
          setHoverType('clickable');
        } else if (isInfoPanel) {
          setIsHovered(true);
          setHoverType('info');
        } else {
          setIsHovered(false);
          setHoverType('default');
        }
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

  // Ring sizes based on interaction type
  const size = hoverType === 'clickable' ? 44 : hoverType === 'info' ? 36 : isMouseDown ? 20 : 28;
  const offset = size / 2;

  return (
    <div className="pointer-events-none fixed inset-0 z-[999999] overflow-hidden select-none mix-blend-difference">
      {/* Dynamic ring following cursor with smooth transition */}
      <div
        className="fixed top-0 left-0 rounded-full border transition-all duration-200 ease-out"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderColor: hoverType === 'clickable'
            ? 'rgba(255,255,255,0.95)'
            : hoverType === 'info'
            ? 'rgba(255,255,255,0.75)'
            : 'rgba(255,255,255,0.45)',
          borderWidth: hoverType === 'clickable' ? '2px' : '1.5px',
          transform: `translate3d(${position.x - offset}px, ${position.y - offset}px, 0) scale(${isMouseDown ? 0.82 : 1})`,
          backgroundColor: hoverType === 'clickable'
            ? 'rgba(255,255,255,0.12)'
            : hoverType === 'info'
            ? 'rgba(255,255,255,0.06)'
            : 'transparent',
        }}
      />
    </div>
  );
}
