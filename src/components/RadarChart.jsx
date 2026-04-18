import { useEffect, useRef } from 'react';

const AXES = ['산미', '단맛', '바디감'];
const KEYS = ['acidity', 'sweetness', 'body'];

export default function RadarChart({ values, size = 220 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const cx = size / 2, cy = size / 2, r = size * 0.34, n = 3;
    ctx.clearRect(0, 0, size, size);

    const pt = (i, ratio) => {
      const a = (Math.PI * 2 * i) / n - Math.PI / 2;
      return [cx + r * ratio * Math.cos(a), cy + r * ratio * Math.sin(a)];
    };

    for (let lvl = 1; lvl <= 5; lvl++) {
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const [x, y] = pt(i, lvl / 5);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = '#ede5da';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    for (let i = 0; i < n; i++) {
      const [x, y] = pt(i, 1);
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y);
      ctx.strokeStyle = '#ede5da'; ctx.lineWidth = 1; ctx.stroke();
    }

    ctx.beginPath();
    KEYS.forEach((k, i) => {
      const [x, y] = pt(i, (values[k] || 0) / 5);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = 'rgba(165,109,59,0.22)';
    ctx.fill();
    ctx.strokeStyle = '#a56d3b';
    ctx.lineWidth = 2;
    ctx.stroke();

    KEYS.forEach((k, i) => {
      const [x, y] = pt(i, (values[k] || 0) / 5);
      ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#a56d3b'; ctx.fill();
    });

    ctx.font = `600 ${size * 0.062}px -apple-system, sans-serif`;
    ctx.fillStyle = '#5c3d1e';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    AXES.forEach((label, i) => {
      const [x, y] = pt(i, 1.28);
      ctx.fillText(label, x, y);
    });
  }, [values, size]);

  return <canvas ref={ref} style={{ width: size, height: size }} />;
}
