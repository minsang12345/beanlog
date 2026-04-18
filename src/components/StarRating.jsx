export default function StarRating({ value, onChange, readOnly = false, size = 'md' }) {
  return (
    <div className={`star-rating star-${size}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`star${n <= value ? ' filled' : ''}`}
          onClick={() => !readOnly && onChange(n)}
          disabled={readOnly}
        >★</button>
      ))}
    </div>
  );
}
