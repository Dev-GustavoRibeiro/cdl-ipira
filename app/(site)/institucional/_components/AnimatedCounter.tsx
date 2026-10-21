'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
}

/** Conta de 0 até `end` quando entra na tela. Com movimento reduzido mostra o valor final direto. */
const AnimatedCounter = ({ end, duration = 2000, suffix = '' }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const total = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : duration;
    let startTime: number | undefined;
    let frame = 0;
    const animate = (currentTime: number) => {
      startTime ??= currentTime;
      const progress = total ? Math.min((currentTime - startTime) / total, 1) : 1;
      // Desacelera no fim (easeOutCubic)
      setCount(Math.round((1 - Math.pow(1 - progress, 3)) * end));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref}>
      {/* O leitor de tela lê só o valor final, não cada passo da contagem */}
      <span aria-hidden="true">
        {count}
        {suffix}
      </span>
      <span className="sr-only">
        {end}
        {suffix}
      </span>
    </span>
  );
};

export default AnimatedCounter;
