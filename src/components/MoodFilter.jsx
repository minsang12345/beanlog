import { FEELING_CATEGORIES } from '../utils/constants';

export default function MoodFilter({ value, onChange }) {
  const toggle = (tag) =>
    onChange(value.includes(tag) ? value.filter((t) => t !== tag) : [...value, tag]);

  return (
    <div className="mood-filter">
      {FEELING_CATEGORIES.map((cat) =>
        cat.tags.map((tag) => {
          const on = value.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              className={`mood-chip${on ? ' on' : ''}`}
              style={on ? { background: cat.bg, borderColor: cat.color, color: cat.color } : {}}
              onClick={() => toggle(tag)}
            >
              {tag}
            </button>
          );
        })
      )}
    </div>
  );
}
