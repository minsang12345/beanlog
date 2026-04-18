import { useState, useEffect, useCallback } from 'react';

const KEY = 'beanlog-records';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? []; }
  catch { return []; }
}

export function useRecords() {
  const [records, setRecords] = useState(load);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(records));
  }, [records]);

  const addRecord = useCallback((data) => {
    const record = { ...data, id: crypto.randomUUID(), date: new Date().toISOString() };
    setRecords((prev) => [record, ...prev]);
    return record.id;
  }, []);

  const deleteRecord = useCallback((id) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { records, addRecord, deleteRecord };
}
