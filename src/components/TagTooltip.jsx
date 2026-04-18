import { useState, useEffect, useRef } from 'react';

export default function TagTooltip({ children, text }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', close, true);
    return () => document.removeEventListener('pointerdown', close, true);
  }, [open]);

  return (
    <span
      ref={ref}
      className="tooltip-wrap"
      onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
    >
      {children}
      {open && <span className="tooltip-bubble" role="tooltip">{text}</span>}
    </span>
  );
}
