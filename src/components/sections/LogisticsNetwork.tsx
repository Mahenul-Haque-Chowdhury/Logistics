"use client";
import { useEffect, useRef } from 'react';

interface Node { id: number; x: number; y: number; vx: number; vy: number; }
interface Link { a: number; b: number; }

// Lightweight animated logistics network visualization (no heavy deps)
export function LogisticsNetwork() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const linksRef = useRef<Link[]>([]);
  const frameRef = useRef<number | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return; // idempotent
    mountedRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const DPR = window.devicePixelRatio || 1;
    function resize() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * DPR;
      canvas.height = rect.height * DPR;
      ctx.setTransform(1,0,0,1,0,0);
      ctx.scale(DPR, DPR);
    }
    resize();
    window.addEventListener('resize', resize);

    // Initialize nodes in a loose radial cluster
    const NODE_COUNT = 26;
    const nodes: Node[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const angle = (i / NODE_COUNT) * Math.PI * 2;
      const radius = 80 + Math.random() * 120;
      nodes.push({
        id: i,
        x: 240 + Math.cos(angle) * radius + (Math.random() * 40 - 20),
        y: 160 + Math.sin(angle) * radius * 0.6 + (Math.random() * 30 - 15),
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      });
    }

    const links: Link[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 150 && Math.random() > 0.55) {
          links.push({ a: i, b: j });
        }
      }
    }
    nodesRef.current = nodes;
    linksRef.current = links;

    function step() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Draw links first
  ctx.lineWidth = 1;
      linksRef.current.forEach(l => {
        const a = nodesRef.current[l.a];
        const b = nodesRef.current[l.b];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        const alpha = Math.max(0, 1 - dist / 160);
        ctx.strokeStyle = `rgba(42,137,255,${alpha * 0.35})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      });

      // Update + draw nodes
      nodesRef.current.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        // gentle pull to center
        n.vx += (240 - n.x) * 0.0005;
        n.vy += (160 - n.y) * 0.0005;
        // friction
        n.vx *= 0.995;
        n.vy *= 0.995;

        // bounds wrap
        if (n.x < 0) n.x = rect.width; else if (n.x > rect.width) n.x = 0;
        if (n.y < 0) n.y = rect.height; else if (n.y > rect.height) n.y = 0;

        // glow
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 14);
        g.addColorStop(0, 'rgba(42,137,255,0.9)');
        g.addColorStop(1, 'rgba(42,137,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, 3.2, 0, Math.PI * 2);
        ctx.fill();
      });

      frameRef.current = requestAnimationFrame(step);
    }
    step();

    return () => {
      window.removeEventListener('resize', resize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className="relative w-full h-64 md:h-80 lg:h-[420px] rounded-xl overflow-hidden ring-1 ring-border/60 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 pointer-events-none mix-blend-screen bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_70%)]" />
      <div className="absolute bottom-3 left-4 text-xs uppercase tracking-wide text-neutral-400/80 font-medium">Network Flow</div>
    </div>
  );
}
