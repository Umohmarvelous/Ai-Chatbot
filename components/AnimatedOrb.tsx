'use client';

import { useEffect, useRef } from 'react';

export default function AnimatedOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const colors = ['#202e32', '#85937a', '#586c5c', '#a9af90', '#dfdcb9'];
    
    const animate = () => {
      time += 0.008;
      
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Create animated liquid gradient background
      const centerX = width / 2;
      const centerY = height / 2;
      
      const gradient = ctx.createRadialGradient(
        centerX + Math.sin(time) * 40,
        centerY + Math.cos(time * 0.7) * 30,
        0,
        centerX,
        centerY,
        Math.max(width, height) * 0.9
      );

      // Animated color stops for liquid effect
      const colorOffset1 = 0.1 + Math.sin(time * 0.5) * 0.1;
      const colorOffset2 = 0.3 + Math.cos(time * 0.6) * 0.1;
      const colorOffset3 = 0.5 + Math.sin(time * 0.7) * 0.1;
      const colorOffset4 = 0.7 + Math.cos(time * 0.8) * 0.1;

      gradient.addColorStop(0, colors[0] + 'FF');
      gradient.addColorStop(colorOffset1, colors[1] + 'DD');
      gradient.addColorStop(colorOffset2, colors[2] + 'BB');
      gradient.addColorStop(colorOffset3, colors[3] + '99');
      gradient.addColorStop(colorOffset4, colors[4] + '77');
      gradient.addColorStop(1, colors[0] + '44');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw multiple animated orbs for liquid effect
      const orbCount = 4;
      for (let i = 0; i < orbCount; i++) {
        const orbTime = time + (i * 0.8);
        const angle = orbTime * 0.5;
        const radiusVariation = Math.sin(orbTime * 1.5) * 0.3;
        
        const x = centerX + Math.sin(angle) * (width * 0.25 + radiusVariation * 30);
        const y = centerY + Math.cos(angle * 0.9) * (height * 0.25 + radiusVariation * 30);
        const radius = 100 + Math.sin(orbTime * 2) * 30 + Math.cos(orbTime * 1.3) * 20;
        
        // Create liquid-like gradient for each orb
        const orbGradient = ctx.createRadialGradient(
          x, y, 0,
          x, y, radius
        );
        
        const colorIndex1 = i % colors.length;
        const colorIndex2 = (i + 1) % colors.length;
        const colorIndex3 = (i + 2) % colors.length;
        
        orbGradient.addColorStop(0, colors[colorIndex1] + 'EE');
        orbGradient.addColorStop(0.3, colors[colorIndex2] + 'AA');
        orbGradient.addColorStop(0.6, colors[colorIndex3] + '66');
        orbGradient.addColorStop(1, colors[colorIndex1] + '00');

        ctx.fillStyle = orbGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add subtle glow effect
        ctx.shadowBlur = 40;
        ctx.shadowColor = colors[colorIndex1];
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="border-2 border-red-600 w-full h-80 relative overflow-hidden">
        <div className="relative h-screen w-screen overflow-hidden bg-gray-900">
          <div className="absolute inset-0 bg-radial-[at_top_left] from-purple-900 via-gray-900 to-gray-900 opacity-50 filter blur-3xl"></div>
          
          <div className="absolute inset-0 bg-radial-[at_bottom_right] from-fuchsia-900 via-gray-900 to-gray-900 opacity-50 filter blur-3xl"></div>
          
          <div className="relative z-10 flex h-full items-center justify-center">
            <h1 className="text-6xl font-bold text-white">Liquid Gradient Background</h1>
          </div>
        </div>
      {/* <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      /> */}
      {/* Additional floating orbs for depth */}
      <div className="absolute inset-0 pointer-events-none">
        {/* <div 
          className="absolute rounded-full blur-3xl opacity-50"
          style={{
            width: '250px',
            height: '250px',
            background: 'radial-gradient(circle, #85937a88, transparent)',
            top: '15%',
            left: '15%',
            animation: 'float 8s ease-in-out infinite',
          }}
        /> */}
        {/* <div 
          className="absolute rounded-full blur-3xl opacity-50"
          style={{
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, #586c5c88, transparent)',
            top: '25%',
            right: '20%',
            animation: 'float 10s ease-in-out infinite',
            animationDelay: '1.5s',
          }}
        /> */}
        {/* <div 
          className="absolute rounded-full blur-3xl opacity-50"
          style={{
            width: '220px',
            height: '220px',
            background: 'radial-gradient(circle, #a9af9088, transparent)',
            bottom: '25%',
            left: '45%',
            animation: 'float 9s ease-in-out infinite',
            animationDelay: '3s',
          }}
        /> */}
        {/* <div 
          className="absolute rounded-full blur-2xl opacity-40"
          style={{
            width: '180px',
            height: '180px',
            background: 'radial-gradient(circle, #dfdcb988, transparent)',
            bottom: '15%',
            right: '15%',
            animation: 'float 7s ease-in-out infinite',
            animationDelay: '2s',
          }}
        /> */}
      </div>
    </div>
  );
}
