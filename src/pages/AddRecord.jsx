import { useState, useEffect } from 'react';
import FeelingTags from '../components/FeelingTags';
import StarRating from '../components/StarRating';
import SliderInput from '../components/SliderInput';
import { PROCESSING_METHODS } from '../utils/constants';

const INIT = {
  cafe: '', bean: '', origin: '', processing: '',
  topNotes: [], acidity: 3, sweetness: 3, body: 3,
  rating: 0, memo: '',
};

export default function AddRecord({ onAdd, onNavigate, prefill = null }) {
  const [form, setForm] = useState(INIT);
  const [errors, setErrors] = useState({});
  // prefill이 있으면 카페·원두 섹션을 미리 열어둠
  const [showCafeBean, setShowCafeBean] = useState(!!prefill);
  const [showDetail, setShowDetail] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 탐색 화면에서 원두를 선택해 넘어온 경우 bean/origin 자동 채우기
  useEffect(() => {
    if (!prefill) return;
    setForm((f) => ({ ...f, bean: prefill.bean ?? '', origin: prefill.origin ?? '' }));
    setShowCafeBean(true);
  }, [prefill]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (form.topNotes.length === 0) e.tags = '느낌 태그를 하나 이상 골라주세요';
    if (!form.rating) e.rating = '별점을 선택해주세요';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onAdd(form);
    setSubmitted(true);
    setTimeout(() => {
      setForm(INIT);
      setErrors({});
      setShowCafeBean(false);
      setShowDetail(false);
      setSubmitted(false);
      onNavigate('home');
    }, 700);
  };

  return (
    <div className="page">
      <header className="page-head">
        <h1>오늘 커피 어땠나요?</h1>
      </header>

      {prefill?.bean && (
        <div className="prefill-banner">
          <span className="prefill-icon">✦</span>
          <span>
            <strong>{prefill.bean}</strong> 기록 중
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form" noValidate>

        {/* ① 느낌 태그 — 필수 */}
        <section className="card form-section">
          <div className="section-required-head">
            <h2 className="sec-title">느낌 태그</h2>
            <span className="req-badge">필수</span>
          </div>
          <FeelingTags
            value={form.topNotes}
            onChange={(v) => { set('topNotes', v); setErrors((e) => ({ ...e, tags: undefined })); }}
            hasError={!!errors.tags}
          />
          {errors.tags && <span className="err-msg">{errors.tags}</span>}
        </section>

        {/* ② 별점 — 필수 */}
        <section className="card form-section rating-section">
          <div className="section-required-head">
            <h2 className="sec-title">얼마나 좋았나요?</h2>
            <span className="req-badge">필수</span>
          </div>
          <StarRating
            value={form.rating}
            onChange={(v) => { set('rating', v); setErrors((e) => ({ ...e, rating: undefined })); }}
          />
          {errors.rating && <span className="err-msg">{errors.rating}</span>}
        </section>

        {/* ③ 메모 — 선택 */}
        <section className="card form-section">
          <h2 className="sec-title">한 마디 메모 <span className="optional-hint">선택</span></h2>
          <textarea
            placeholder="그냥 생각나는 대로 적어도 좋아요"
            rows={3}
            value={form.memo}
            onChange={(e) => set('memo', e.target.value)}
          />
        </section>

        {/* ④ 카페 · 원두 — 접힘 */}
        <div className="expand-toggle-wrap">
          <button
            type="button"
            className={`expand-toggle${showCafeBean ? ' open' : ''}`}
            onClick={() => setShowCafeBean((v) => !v)}
          >
            <span>☕ 카페 · 원두 적어두기</span>
            <span className="expand-arrow">{showCafeBean ? '▲' : '▼'}</span>
          </button>

          {showCafeBean && (
            <div className="card expand-body">
              <div className="field">
                <label>카페 이름</label>
                <input type="text" placeholder="예) 블루보틀 삼청"
                  value={form.cafe} onChange={(e) => set('cafe', e.target.value)} />
              </div>
              <div className="field">
                <label>원두 이름</label>
                <input type="text" placeholder="예) Ethiopia Yirgacheffe"
                  value={form.bean} onChange={(e) => set('bean', e.target.value)} />
              </div>
            </div>
          )}
        </div>

        {/* ⑤ 상세 정보 — 접힘 */}
        <div className="expand-toggle-wrap">
          <button
            type="button"
            className={`expand-toggle${showDetail ? ' open' : ''}`}
            onClick={() => setShowDetail((v) => !v)}
          >
            <span>🔍 더 자세히 기록하기</span>
            <span className="expand-arrow">{showDetail ? '▲' : '▼'}</span>
          </button>

          {showDetail && (
            <div className="card expand-body">
              <div className="field">
                <label>원산지</label>
                <input type="text" placeholder="예) 에티오피아 예가체프"
                  value={form.origin} onChange={(e) => set('origin', e.target.value)} />
              </div>

              <div className="field">
                <label>가공법</label>
                <div className="processing-grid">
                  {PROCESSING_METHODS.map((m) => (
                    <button
                      key={m.value} type="button"
                      className={`processing-btn${form.processing === m.value ? ' on' : ''}`}
                      style={form.processing === m.value
                        ? { background: m.bg, borderColor: m.color, color: m.color } : {}}
                      onClick={() => set('processing', form.processing === m.value ? '' : m.value)}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="detail-sliders">
                <p className="slider-section-hint">강도를 직접 조절해보세요</p>
                <SliderInput label="새콤한 정도" value={form.acidity} onChange={(v) => set('acidity', v)} />
                <SliderInput label="달콤한 정도" value={form.sweetness} onChange={(v) => set('sweetness', v)} />
                <SliderInput label="묵직한 느낌" value={form.body} onChange={(v) => set('body', v)} />
              </div>
            </div>
          )}
        </div>

        <button type="submit" className={`btn-primary${submitted ? ' done' : ''}`}>
          {submitted ? '저장됨 ✓' : '기록 저장'}
        </button>

      </form>
    </div>
  );
}
