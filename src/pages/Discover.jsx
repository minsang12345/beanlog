import { useState, useMemo } from 'react';
import MoodFilter from '../components/MoodFilter';
import BeanModal from '../components/BeanModal';
import ProcessingBadge from '../components/ProcessingBadge';
import TagTooltip from '../components/TagTooltip';
import { BEANS } from '../data/beans';
import { getTopNotes, filterAndSort } from '../utils/recommend';
import { FEELING_CATEGORIES, TAG_DESCRIPTIONS } from '../utils/constants';

const QUALIFY_THRESHOLD = 3; // 취향 분석에 필요한 rating≥4 기록 수

// 태그 색상 조회용 맵
const TAG_COLOR = {};
FEELING_CATEGORIES.forEach((cat) => {
  cat.tags.forEach((t) => { TAG_COLOR[t] = { color: cat.color, bg: cat.bg }; });
});

function BeanCard({ bean, onSelect }) {
  return (
    <article className="bean-card" onClick={() => onSelect(bean)}>
      <div className="bean-card-top">
        <div className="bean-card-titles">
          <span className="bean-card-name">{bean.koreanName}</span>
          <span className="bean-card-en-name">{bean.name}</span>
          <span className="bean-card-origin">{bean.origin}</span>
        </div>
        <div className="bean-card-right">
          {bean.score !== null && (
            <span className={`match-badge${bean.score >= 67 ? ' high' : bean.score >= 34 ? ' mid' : ' low'}`}>
              {bean.score}%
            </span>
          )}
          {bean.processing && <ProcessingBadge value={bean.processing} showTooltip />}
        </div>
      </div>

      <p className="bean-card-desc">{bean.description}</p>

      <div className="bean-card-tags">
        {bean.tags.slice(0, 3).map((tag) => {
          const c = TAG_COLOR[tag];
          return (
            <TagTooltip key={tag} text={TAG_DESCRIPTIONS[tag]}>
              <span
                className="bean-tag-pill"
                style={c ? { background: c.bg, color: c.color } : {}}
              >
                {tag}
              </span>
            </TagTooltip>
          );
        })}
      </div>
    </article>
  );
}

export default function Discover({ records, onNavigate, onPrefill }) {
  const [search, setSearch] = useState('');
  const [moodTags, setMoodTags] = useState([]);
  const [selectedBean, setSelectedBean] = useState(null);

  // 취향 분석
  const rating4Count = useMemo(
    () => records.filter((r) => r.rating >= 4).length,
    [records]
  );
  const hasEnoughData = rating4Count >= QUALIFY_THRESHOLD;
  const userTopTags = useMemo(
    () => (hasEnoughData ? getTopNotes(records) : []),
    [records, hasEnoughData]
  );

  // 원두 필터 + 정렬
  const displayBeans = useMemo(
    () => filterAndSort(BEANS, moodTags, userTopTags, search),
    [moodTags, userTopTags, search]
  );

  const handleRecord = () => {
    if (!selectedBean) return;
    onPrefill({ bean: selectedBean.koreanName, origin: selectedBean.origin });
    setSelectedBean(null);
    onNavigate('add');
  };

  const remainingForAnalysis = QUALIFY_THRESHOLD - rating4Count;

  return (
    <div className="page discover-page">

      {/* 검색바 */}
      <div className="disc-search-wrap">
        <span className="search-icon">🔍</span>
        <input
          type="search"
          placeholder="원두 이름, 산지, 태그로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="search-clear" onClick={() => setSearch('')}>×</button>
        )}
      </div>

      {/* 취향 상태 배너 */}
      {hasEnoughData ? (
        <div className="taste-banner">
          <span className="taste-banner-label">내 취향 태그</span>
          <div className="taste-top-tags">
            {userTopTags.map((tag) => {
              const c = TAG_COLOR[tag];
              return (
                <span
                  key={tag}
                  className="taste-top-chip"
                  style={c ? { background: c.bg, borderColor: c.color, color: c.color } : {}}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="progress-banner">
          <div className="progress-text">
            <span className="progress-main">
              {remainingForAnalysis > 0
                ? `🫘 ${remainingForAnalysis}잔만 더 기록하면 내 취향을 알 수 있어요`
                : '취향 분석 준비 완료!'}
            </span>
          </div>
          <div className="cup-track">
            {Array.from({ length: QUALIFY_THRESHOLD }, (_, i) => (
              <span key={i} className={`cup-icon${i < rating4Count ? ' filled' : ''}`}>☕</span>
            ))}
          </div>
        </div>
      )}

      {/* 기분 태그 필터 */}
      <div className="disc-section">
        <div className="disc-section-head">
          <h2 className="disc-section-title">오늘 어떤 느낌의 커피?</h2>
          {moodTags.length > 0 && (
            <button className="clear-mood" onClick={() => setMoodTags([])}>초기화</button>
          )}
        </div>
        <MoodFilter value={moodTags} onChange={setMoodTags} />
      </div>

      {/* 원두 목록 */}
      <div className="disc-section">
        <div className="disc-section-head">
          <h2 className="disc-section-title">
            {moodTags.length > 0 || search
              ? '검색 결과'
              : hasEnoughData
              ? '내 취향에 맞는 원두'
              : '모든 원두'}
          </h2>
          <span className="disc-count">{displayBeans.length}개</span>
        </div>

        {displayBeans.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">☕</div>
            <p>조건에 맞는 원두가 없어요</p>
          </div>
        ) : (
          <div className="bean-list">
            {displayBeans.map((bean) => (
              <BeanCard
                key={bean.id}
                bean={bean}
                onSelect={setSelectedBean}
              />
            ))}
          </div>
        )}
      </div>

      {/* 원두 상세 모달 */}
      {selectedBean && (
        <BeanModal
          bean={selectedBean}
          userTopTags={userTopTags}
          onClose={() => setSelectedBean(null)}
          onRecord={handleRecord}
        />
      )}
    </div>
  );
}
