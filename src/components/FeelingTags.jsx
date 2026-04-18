import { FEELING_CATEGORIES } from '../utils/constants';

export default function FeelingTags({ value, onChange, hasError }) {
  const toggle = (tag) =>
    onChange(value.includes(tag) ? value.filter((t) => t !== tag) : [...value, tag]);

  return (
    <div className={`feeling-tags${hasError ? ' feeling-tags-err' : ''}`}>
      {FEELING_CATEGORIES.map((cat) => (
        <div key={cat.id} className="feeling-cat">
          <span className="feeling-cat-label" style={{ color: cat.color }}>
            {cat.label}
          </span>
          <div className="feeling-chips">
            {cat.tags.map((tag) => {
              const on = value.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  className={`feeling-chip${on ? ' on' : ''}`}
                  style={on ? { background: cat.bg, borderColor: cat.color, color: cat.color } : {}}
                  onClick={() => toggle(tag)}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
