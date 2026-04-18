/**
 * rating >= 4 기록의 topNotes 빈도를 집계해 TOP 3 태그를 반환
 */
export function getTopNotes(records) {
  const freq = {};
  records
    .filter((r) => r.rating >= 4)
    .forEach((r) => (r.topNotes || []).forEach((tag) => {
      freq[tag] = (freq[tag] || 0) + 1;
    }));
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag]) => tag);
}

/**
 * 원두 태그와 유저 TOP 태그의 교집합 비율 (0~100)
 */
export function matchScore(beanTags, userTopTags) {
  if (!userTopTags.length) return 0;
  const hit = beanTags.filter((t) => userTopTags.includes(t)).length;
  return Math.round((hit / userTopTags.length) * 100);
}

/**
 * 검색 + 기분 필터 + 정렬을 한 번에 처리
 * @param {object[]} beans      - 전체 원두 목록
 * @param {string[]} moodTags   - 사용자가 선택한 기분 태그
 * @param {string[]} userTopTags - 취향 TOP 3 태그 (없으면 [])
 * @param {string}   searchQuery - 검색어
 */
export function filterAndSort(beans, moodTags, userTopTags, searchQuery) {
  let list = [...beans];

  // 검색어 필터
  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    list = list.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.origin.toLowerCase().includes(q) ||
        b.tags.some((t) => t.includes(q))
    );
  }

  // 기분 태그 필터 (하나라도 포함)
  if (moodTags.length > 0) {
    list = list.filter((b) => b.tags.some((t) => moodTags.includes(t)));
  }

  // 점수 부여
  return list
    .map((b) => ({
      ...b,
      score: userTopTags.length ? matchScore(b.tags, userTopTags) : null,
      moodHits: moodTags.length
        ? b.tags.filter((t) => moodTags.includes(t)).length
        : 0,
    }))
    .sort((a, b) => {
      // 취향 데이터 있으면 매칭% 우선, 없으면 기분 태그 일치 수 우선
      if (a.score !== null && b.score !== null && a.score !== b.score)
        return b.score - a.score;
      return b.moodHits - a.moodHits;
    });
}
