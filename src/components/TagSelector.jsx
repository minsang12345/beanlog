import { useState } from 'react';
import { PRESET_NOTES } from '../utils/constants';

export default function TagSelector({ value, onChange }) {
  const [custom, setCustom] = useState('');

  const toggle = (tag) => {
    onChange(value.includes(tag) ? value.filter((t) => t !== tag) : [...value, tag]);
  };

  const addCustom = () => {
    const tag = custom.trim();
    if (tag && !value.includes(tag)) { onChange([...value, tag]); }
    setCustom('');
  };

  const customTags = value.filter((t) => !PRESET_NOTES.includes(t));

  return (
    <div className="tag-selector">
      <div className="tag-grid">
        {PRESET_NOTES.map((tag) => (
          <button
            key={tag}
            type="button"
            className={`tag-chip${value.includes(tag) ? ' on' : ''}`}
            onClick={() => toggle(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {customTags.length > 0 && (
        <div className="custom-tags-row">
          {customTags.map((tag) => (
            <span key={tag} className="custom-tag">
              {tag}
              <button type="button" onClick={() => toggle(tag)}>×</button>
            </span>
          ))}
        </div>
      )}

      <div className="custom-tag-input">
        <input
          type="text"
          placeholder="직접 입력 후 Enter"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustom(); } }}
        />
        <button type="button" onClick={addCustom} disabled={!custom.trim()}>추가</button>
      </div>
    </div>
  );
}
