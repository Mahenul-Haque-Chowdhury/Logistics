"use client";
import { useEffect, useRef } from 'react';

interface MiniNetworkProps {
  className?: string;
  density?: number; // number of nodes base
  animate?: boolean;
}

// Lightweight decorative network (no resize listener, lower frame cost)
export function MiniNetwork({ className = '', density = 18, animate = true }: MiniNetworkProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
  const canvas = ref.current; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return;
    let frame = 0; let raf: number;
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const w = canvas.clientWidth; const h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);

    // Node set
    const nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    for (let i = 0; i < density; i++) {
      nodes.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random()-0.5)*0.25, vy: (Math.random()-0.5)*0.25 });
    }

    function draw() {
      if (!ctx) return;
      frame++;
      ctx.clearRect(0,0,w,h);
      // Links
      for (let i=0;i<nodes.length;i++) {
        for (let j=i+1;j<nodes.length;j++) {
          const a = nodes[i]; const b = nodes[j];
          const dx = a.x - b.x; const dy = a.y - b.y; const dist = Math.hypot(dx,dy);
          if (dist < 110) {
            const alpha = 1 - dist/110;
            ctx.strokeStyle = `rgba(42,137,255,${0.25*alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      // Nodes
      for (const n of nodes) {
        if (animate) {
          n.x += n.vx; n.y += n.vy;
          if (n.x < -20) n.x = w + 10; else if (n.x > w+20) n.x = -10;
          if (n.y < -20) n.y = h + 10; else if (n.y > h+20) n.y = -10;
        }
        const pulse = (Math.sin((frame/40)+n.x*0.01+n.y*0.01)+1)/2; // 0..1
        const r = 2 + pulse*1.5;
        const grd = ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,r*3);
        grd.addColorStop(0,'rgba(42,137,255,0.8)');
        grd.addColorStop(1,'rgba(42,137,255,0)');
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(n.x,n.y,r*3,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.beginPath(); ctx.arc(n.x,n.y,r*0.6,0,Math.PI*2); ctx.fill();
      }
      if (animate) raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [density, animate]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <canvas ref={ref} className="absolute inset-0 w-full h-full" aria-hidden />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(42,137,255,0.08),transparent_70%)]" />
    </div>
  );
}
