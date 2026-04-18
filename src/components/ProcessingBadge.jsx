import TagTooltip from './TagTooltip';
import { PROCESSING_MAP } from '../utils/constants';

export default function ProcessingBadge({ value, showTooltip = false }) {
  const m = PROCESSING_MAP[value];
  if (!m) return null;
  const badge = (
    <span className="processing-badge" style={{ color: m.color, background: m.bg }}>
      {m.label}
    </span>
  );
  if (showTooltip && m.description) {
    return <TagTooltip text={m.description}>{badge}</TagTooltip>;
  }
  return badge;
}
