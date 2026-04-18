import { useState, useEffect } from 'react';
import ProcessingBadge from './ProcessingBadge';
import TagTooltip from './TagTooltip';
import { FEELING_CATEGORIES, TAG_DESCRIPTIONS, PROCESSING_MAP, ORIGIN_DESCRIPTIONS } from '../utils/constants';

const TAG_COLOR = {};
FEELING_CATEGORIES.forEach((cat) => {
  cat.tags.forEach((tag) => { TAG_COLOR[tag] = { color: cat.color, bg: cat.bg }; });
});

export default function BeanModal({ bean, userTopTags = [], onClose, onRecord }) {
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!bean) return null;

  const processing = bean.processing ? PROCESSING_MAP[bean.processing] : null;
  const originDesc = ORIGIN_DESCRIPTIONS[bean.origin];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />

        {/* 헤더 */}
        <div className="modal-header">
          <div className="modal-title-group">
            <h2 className="modal-bean-name">{bean.koreanName}</h2>
            <span className="modal-bean-en-name">{bean.name}</span>
            <span className="modal-origin">{bean.origin}</span>
          </div>
          {bean.processing && <ProcessingBadge value={bean.processing} showTooltip />}
        </div>

        {/* 매칭 점수 */}
        {bean.score !== null && bean.score !== undefined && (
          <div className="modal-score-bar">
            <span className="modal-score-label">내 취향과의 일치</span>
            <div className="modal-score-track">
              <div className="modal-score-fill" style={{ width: `${bean.score}%` }} />
            </div>
            <span className="modal-score-pct">{bean.score}%</span>
          </div>
        )}

        {/* 설명 */}
        <p className="modal-desc">{bean.description}</p>

        {/* 태그 */}
        <div className="modal-tags">
          {bean.tags.map((tag) => {
            const style = TAG_COLOR[tag]
              ? { background: TAG_COLOR[tag].bg, borderColor: TAG_COLOR[tag].color, color: TAG_COLOR[tag].color }
              : {};
            const isMatch = userTopTags.includes(tag);
            return (
              <TagTooltip key={tag} text={TAG_DESCRIPTIONS[tag]}>
                <span className={`modal-tag${isMatch ? ' match' : ''}`} style={style}>
                  {isMatch && <span className="match-dot" />}
                  {tag}
                </span>
              </TagTooltip>
            );
          })}
        </div>

        {/* 더 알아보기 */}
        {(originDesc || processing) && (
          <div className="modal-more-wrap">
            <button
              className={`modal-more-toggle${showMore ? ' open' : ''}`}
              onClick={() => setShowMore((v) => !v)}
            >
              이 커피 더 알아보기
              <span className="modal-more-arrow">{showMore ? '▲' : '▼'}</span>
            </button>
            {showMore && (
              <div className="modal-more-body">
                {originDesc && (
                  <div className="modal-more-row">
                    <span className="modal-more-label">산지</span>
                    <span className="modal-more-text">{originDesc}</span>
                  </div>
                )}
                {processing && (
                  <div className="modal-more-row">
                    <span className="modal-more-label">가공법</span>
                    <span className="modal-more-text">{processing.description}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <button className="btn-primary modal-cta" onClick={onRecord}>
          이 원두 마셨어요 →
        </button>

        <button className="modal-close-btn" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}
