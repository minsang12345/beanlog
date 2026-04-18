const DESCS = ['', '매우 약함', '약함', '보통', '강함', '매우 강함'];

export default function SliderInput({ label, value, onChange }) {
  return (
    <div className="slider-wrap">
      <div className="slider-head">
        <span className="slider-name">{label}</span>
        <span className="slider-val">{value} <small>{DESCS[value]}</small></span>
      </div>
      <input
        type="range" min={1} max={5} step={1} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider"
      />
      <div className="slider-ticks">
        {[1,2,3,4,5].map((n) => (
          <span key={n} className={n === value ? 'tick on' : 'tick'}>{n}</span>
        ))}
      </div>
    </div>
  );
}
