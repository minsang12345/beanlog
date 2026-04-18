import { useState, useMemo } from 'react';
import StarRating from '../components/StarRating';
import ProcessingBadge from '../components/ProcessingBadge';
import { PROCESSING_METHODS } from '../utils/constants';

function RecordCard({ record, onDelete }) {
  const [open, setOpen] = useState(false);
  const d = new Date(record.date);
  const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;

  return (
    <article className={`record-card${open ? ' expanded' : ''}`} onClick={() => setOpen((v) => !v)}>
      <div className="rc-top">
        <div>
          <span className="rc-cafe">{record.cafe}</span>
          {record.processing && <ProcessingBadge value={record.processing} />}
        </div>
        <span className="rc-date">{dateStr}</span>
      </div>

      <div className="rc-bean">
        <span className="rc-bean-name">{record.bean}</span>
        {record.origin && <span className="rc-origin">{record.origin}</span>}
      </div>

      <div className="rc-row">
        <StarRating value={record.rating} readOnly size="sm" />
        {record.topNotes?.length > 0 && (
          <div className="rc-notes">
            {record.topNotes.slice(0, 3).map((n) => (
              <span key={n} className="note-pill">{n}</span>
            ))}
            {record.topNotes.length > 3 && (
              <span className="note-pill muted">+{record.topNotes.length - 3}</span>
            )}
          </div>
        )}
      </div>

      <div className="rc-flavors">
        <FlavorDot label="산미" value={record.acidity} />
        <FlavorDot label="단맛" value={record.sweetness} />
        <FlavorDot label="바디" value={record.body} />
      </div>

      {open && (
        <div className="rc-expanded" onClick={(e) => e.stopPropagation()}>
          {record.memo && <p className="rc-memo">"{record.memo}"</p>}
          <button className="btn-delete" onClick={() => onDelete(record.id)}>삭제</button>
        </div>
      )}
    </article>
  );
}

function FlavorDot({ label, value }) {
  return (
    <span className="flavor-dot">
      {label} <strong>{value}</strong>
    </span>
  );
}

export default function Home({ records, onDelete, onNavigate }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterProc, setFilterProc] = useState('');

  const filtered = useMemo(() => {
    let list = [...records];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((r) =>
        r.cafe?.toLowerCase().includes(q) ||
        r.bean?.toLowerCase().includes(q) ||
        r.origin?.toLowerCase().includes(q)
      );
    }
    if (filterProc) {
      list = list.filter((r) => r.processing === filterProc);
    }
    if (sortBy === 'newest') list.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [records, search, sortBy, filterProc]);

  return (
    <div className="page">
      <header className="page-head home-head">
        <div>
          <h1>beanlog</h1>
          <p className="page-sub">{records.length}개의 원두 기록</p>
        </div>
      </header>

      {/* 검색 */}
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="search" placeholder="카페, 원두, 원산지 검색..."
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
        {search && <button className="search-clear" onClick={() => setSearch('')}>×</button>}
      </div>

      {/* 가공법 필터 */}
      <div className="filter-row">
        <button
          className={`filter-chip${!filterProc ? ' on' : ''}`}
          onClick={() => setFilterProc('')}
        >전체</button>
        {PROCESSING_METHODS.map((m) => (
          <button
            key={m.value}
            className={`filter-chip${filterProc === m.value ? ' on' : ''}`}
            style={filterProc === m.value ? { background: m.bg, borderColor: m.color, color: m.color } : {}}
            onClick={() => setFilterProc(filterProc === m.value ? '' : m.value)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* 정렬 */}
      <div className="sort-row">
        {['newest', 'rating'].map((s) => (
          <button
            key={s}
            className={`sort-btn${sortBy === s ? ' on' : ''}`}
            onClick={() => setSortBy(s)}
          >
            {s === 'newest' ? '최신순' : '별점순'}
          </button>
        ))}
        <span className="result-count">{filtered.length}개</span>
      </div>

      {records.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">☕</div>
          <p>아직 기록이 없어요</p>
          <button className="btn-primary" style={{ width: 'auto', padding: '12px 28px' }}
            onClick={() => onNavigate('add')}>
            첫 원두 기록하기
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🔍</div>
          <p>검색 결과가 없어요</p>
        </div>
      ) : (
        <div className="record-list">
          {filtered.map((r) => (
            <RecordCard key={r.id} record={r} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
