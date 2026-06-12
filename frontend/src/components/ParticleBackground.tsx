"use client";

import React, { useEffect, useState } from "react";

export default function ParticleBackground() {
  const [particles, setParticles] = useState<{ id: number; left: string; size: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    // Generate particles on client side only to avoid SSR hydration mismatches
    const generated = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 6 + 4}px`,
      delay: `${Math.random() * 8}s`,
      duration: `${Math.random() * 12 + 10}s`
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-[-20px] rounded-full bg-gold/20"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animation: `particleDrift ${p.duration} linear infinite`,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
