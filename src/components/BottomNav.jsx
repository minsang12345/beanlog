export default function BottomNav({ tab, setTab }) {
  const items = [
    { id: 'home',     icon: '☕', label: '홈' },
    { id: 'discover', icon: '✦', label: '탐색' },
    { id: 'add',      icon: '＋', label: '기록' },
    { id: 'analysis', icon: '◎', label: '분석' },
  ];
  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <button
          key={item.id}
          className={`bnav-item${tab === item.id ? ' active' : ''}`}
          onClick={() => setTab(item.id)}
        >
          <span className="bnav-icon">{item.icon}</span>
          <span className="bnav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
