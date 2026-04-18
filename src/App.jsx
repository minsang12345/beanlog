import { useState } from 'react';
import { useRecords } from './hooks/useRecords';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import AddRecord from './pages/AddRecord';
import Analysis from './pages/Analysis';
import Discover from './pages/Discover';

export default function App() {
  const [tab, setTab] = useState('home');
  const { records, addRecord, deleteRecord } = useRecords();
  // 탐색 → 기록 폼으로 이동할 때 원두/산지 자동 채우기
  const [prefill, setPrefill] = useState(null);

  const handlePrefill = (data) => setPrefill(data);

  const handleNavigate = (nextTab) => {
    // add 탭이 아닌 곳으로 이동하면 prefill 초기화
    if (nextTab !== 'add') setPrefill(null);
    setTab(nextTab);
  };

  return (
    <div className="app">
      <main className="main">
        {tab === 'home'     && <Home records={records} onDelete={deleteRecord} onNavigate={handleNavigate} />}
        {tab === 'add'      && <AddRecord onAdd={addRecord} onNavigate={handleNavigate} prefill={prefill} />}
        {tab === 'analysis' && <Analysis records={records} onNavigate={handleNavigate} />}
        {tab === 'discover' && <Discover records={records} onNavigate={handleNavigate} onPrefill={handlePrefill} />}
      </main>
      <BottomNav tab={tab} setTab={handleNavigate} />
    </div>
  );
}
