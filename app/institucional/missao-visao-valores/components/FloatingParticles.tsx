'use client';

import React from 'react';

const particles = [
  { left: '5%', top: '10%', delay: '0s', duration: '8s' },
  { left: '15%', top: '80%', delay: '1s', duration: '10s' },
  { left: '25%', top: '30%', delay: '2s', duration: '7s' },
  { left: '35%', top: '60%', delay: '0.5s', duration: '9s' },
  { left: '45%', top: '20%', delay: '1.5s', duration: '11s' },
  { left: '55%', top: '70%', delay: '2.5s', duration: '8s' },
  { left: '65%', top: '40%', delay: '3s', duration: '10s' },
  { left: '75%', top: '90%', delay: '0.8s', duration: '7s' },
  { left: '85%', top: '50%', delay: '1.8s', duration: '9s' },
  { left: '95%', top: '15%', delay: '2.8s', duration: '12s' },
  { left: '10%', top: '45%', delay: '3.5s', duration: '8s' },
  { left: '30%', top: '85%', delay: '4s', duration: '10s' },
  { left: '50%', top: '5%', delay: '0.3s', duration: '11s' },
  { left: '70%', top: '65%', delay: '1.3s', duration: '9s' },
  { left: '90%', top: '35%', delay: '2.3s', duration: '7s' },
];

const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {particles.map((p, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
        style={{
          left: p.left,
          top: p.top,
          animationDelay: p.delay,
          animationDuration: p.duration,
        }}
      />
    ))}
  </div>
);

export default FloatingParticles;



