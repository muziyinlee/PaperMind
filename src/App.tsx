import React, { useState } from 'react';
import HomePage from './components/HomePage';
import ReportPage from './components/ReportPage';
import { studentData as fallbackData } from './data';

export default function App() {
  const [view, setView] = useState<'home' | 'report'>('home');
  const [reportData, setReportData] = useState<any>(fallbackData);

  return (
    <>
      {view === 'home' && <HomePage onAnalyzeSuccess={(data) => { setReportData(data); setView('report'); }} />}
      {view === 'report' && <ReportPage data={reportData} onBack={() => setView('home')} />}
    </>
  );
}

