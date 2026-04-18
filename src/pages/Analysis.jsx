import RadarChart from '../components/RadarChart';
import { PROCESSING_METHODS } from '../utils/constants';

function avg(arr, key) {
  if (!arr.length) return 0;
  return arr.reduce((s, r) => s + (r[key] || 0), 0) / arr.length;
}

function StatBar({ label, value, max = 5 }) {
  return (
    <div className="stat-bar">
      <div className="stat-bar-head">
        <span>{label}</span><span className="stat-num">{value.toFixed(1)}</span>
      </div>
      <div className="stat-track">
        <div className="stat-fill" style={{ width: `${((value - 1) / (max - 1)) * 100}%` }} />
      </div>
    </div>
  );
}

function NoteBar({ label, count, max }) {
  return (
    <div className="note-bar">
      <span className="note-bar-label">{label}</span>
      <div className="note-bar-track">
        <div className="note-bar-fill" style={{ width: `${(count / max) * 100}%` }} />
      </div>
      <span className="note-bar-count">{count}</span>
    </div>
  );
}

export default function Analysis({ records, onNavigate }) {
  if (records.length === 0) {
    return (
      <div className="page">
        <header className="page-head"><h1>취향 분석</h1></header>
        <div className="empty">
          <div className="empty-icon">◎</div>
          <p>기록이 쌓이면 취향을 분석해드려요</p>
          <button className="btn-primary" style={{ width: 'auto', padding: '12px 28px' }}
            onClick={() => onNavigate('add')}>
            원두 기록하기
          </button>
        </div>
      </div>
    );
  }

  const avgFlavor = {
    acidity:   avg(records, 'acidity'),
    sweetness: avg(records, 'sweetness'),
    body:      avg(records, 'body'),
  };
  const avgRating = avg(records, 'rating');

  // 탑 노트 빈도
  const noteFreq = {};
  records.forEach((r) => r.topNotes?.forEach((n) => { noteFreq[n] = (noteFreq[n] || 0) + 1; }));
  const topNotes = Object.entries(noteFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const maxNoteCount = topNotes[0]?.[1] || 1;

  // 가공법 분포
  const procFreq = {};
  records.forEach((r) => { if (r.processing) procFreq[r.processing] = (procFreq[r.processing] || 0) + 1; });

  // 취향 경향
  const tendency = (() => {
    const { acidity, sweetness, body } = avgFlavor;
    const max = Math.max(acidity, sweetness, body);
    if (max === acidity) return '산미가 밝은 커피를 좋아해요';
    if (max === sweetness) return '달콤한 커피를 선호해요';
    return '묵직한 바디감의 커피를 즐겨요';
  })();

  const topBean = [...records].sort((a, b) => b.rating - a.rating)[0];

  return (
    <div className="page">
      <header className="page-head">
        <h1>취향 분석</h1>
        <p className="page-sub">{records.length}개 기록 기반</p>
      </header>

      {/* 레이더 차트 */}
      <section className="card analysis-card">
        <h2 className="sec-title">나의 커피 프로필</h2>
        <div className="radar-wrap">
          <RadarChart values={avgFlavor} size={210} />
        </div>
        <div className="stat-bars">
          <StatBar label="산미" value={avgFlavor.acidity} />
          <StatBar label="단맛" value={avgFlavor.sweetness} />
          <StatBar label="바디감" value={avgFlavor.body} />
        </div>
      </section>

      {/* 취향 요약 */}
      <section className="card analysis-card">
        <h2 className="sec-title">취향 요약</h2>
        <div className="summary-chips">
          <div className="chip"><span>☕</span>{tendency}</div>
          <div className="chip"><span>★</span>평균 {avgRating.toFixed(1)}점</div>
          <div className="chip"><span>📝</span>총 {records.length}잔 기록</div>
        </div>
      </section>

      {/* 탑 노트 */}
      {topNotes.length > 0 && (
        <section className="card analysis-card">
          <h2 className="sec-title">자주 느낀 향미</h2>
          <div className="note-bars">
            {topNotes.map(([label, count]) => (
              <NoteBar key={label} label={label} count={count} max={maxNoteCount} />
            ))}
          </div>
        </section>
      )}

      {/* 가공법 분포 */}
      {Object.keys(procFreq).length > 0 && (
        <section className="card analysis-card">
          <h2 className="sec-title">가공법 분포</h2>
          <div className="proc-dist">
            {PROCESSING_METHODS.filter((m) => procFreq[m.value]).map((m) => {
              const pct = Math.round((procFreq[m.value] / records.length) * 100);
              return (
                <div key={m.value} className="proc-row">
                  <span className="proc-label" style={{ color: m.color }}>{m.label}</span>
                  <div className="proc-track">
                    <div className="proc-fill" style={{ width: `${pct}%`, background: m.color }} />
                  </div>
                  <span className="proc-pct">{pct}%</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 최고 평점 */}
      {topBean && (
        <section className="card analysis-card">
          <h2 className="sec-title">최고 평점 원두</h2>
          <div className="top-bean">
            <div className="top-bean-stars">{'★'.repeat(topBean.rating)}</div>
            <div className="top-bean-name">{topBean.bean}</div>
            <div className="top-bean-cafe">{topBean.cafe}</div>
            {topBean.memo && <div className="top-bean-memo">"{topBean.memo}"</div>}
          </div>
        </section>
      )}
    </div>
  );
}
