export function transformData(llmData: any) {
  const getPercentage = (correct: number, total: number) => {
    if (!total) return 0;
    return Math.round((correct / total) * 100);
  };

  const getColorClass = (percent: number, type: 'text' | 'bg') => {
    if (percent >= 80) return type === 'text' ? 'text-green-500' : '#22c55e';
    if (percent >= 60) return type === 'text' ? 'text-yellow-600' : '#eab308';
    return type === 'text' ? 'text-red-500' : '#ef4444';
  };

  const getScoreColorClass = (scoreEarned: number, scoreMax: number) => {
    const p = getPercentage(scoreEarned, scoreMax);
    if (p >= 80) return 'text-green-600';
    if (p >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getTypeColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('vocab') || t.includes('词汇') || t.includes('基础') || t.includes('字词') || t.includes('拼音')) return 'bg-emerald-100 text-emerald-800';
    if (t.includes('gramm') || t.includes('语法') || t.includes('计算') || t.includes('代数') || t.includes('选择')) return 'bg-blue-100 text-blue-800';
    if (t.includes('writ') || t.includes('写作') || t.includes('应用') || t.includes('作文') || t.includes('解答') || t.includes('填空')) return 'bg-pink-100 text-pink-800';
    if (t.includes('comm') || t.includes('交流') || t.includes('听力') || t.includes('综合') || t.includes('实验') || t.includes('操作')) return 'bg-purple-100 text-purple-800';
    if (t.includes('read') || t.includes('阅读') || t.includes('理解') || t.includes('几何') || t.includes('图形') || t.includes('古诗')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  const defaultColors = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#8b5cf6'];

  const isValidString = (s: any) => {
    if (typeof s !== 'string') return false;
    const t = s.trim().toLowerCase();
    return t !== '' && !['未知', '无', '-', '日期', '空', 'null', 'undefined', 'undefined'].includes(t) && !t.includes('如果找不到');
  };
  
  const date = isValidString(llmData.date) ? llmData.date : new Date().toLocaleDateString();
  const courseName = isValidString(llmData.courseName) ? llmData.courseName : '';
  const level = isValidString(llmData.level) ? llmData.level : '';
  const unit = isValidString(llmData.unit) ? llmData.unit : '';

  const parseScore = (val: any) => {
    if (val === undefined || val === null) return NaN;
    const num = parseFloat(String(val).replace(/[^\d.-]/g, ''));
    return num;
  };

  let totalScore = parseScore(llmData.totalScore);
  let maxScore = parseScore(llmData.maxScore);

  let calcTotal = 0;
  let calcMax = 0;
  if (llmData.modules && Array.isArray(llmData.modules) && llmData.modules.length > 0) {
    calcTotal = llmData.modules.reduce((sum: number, m: any) => sum + (parseScore(m.correct) || 0), 0);
    calcMax = llmData.modules.reduce((sum: number, m: any) => sum + (parseScore(m.total) || 0), 0);
  }

  if (isNaN(totalScore) || totalScore <= 0) {
    totalScore = calcTotal > 0 ? calcTotal : 0;
  }
  if (isNaN(maxScore) || maxScore <= 0) {
    maxScore = calcMax > 0 ? calcMax : 100;
  }
  
  // If the extracted total score is strictly less than the calculated total from modules,
  // it's highly likely the extracted total score was parsed wrong or incomplete.
  if (calcTotal > totalScore) {
    totalScore = calcTotal;
  }
  if (calcMax > maxScore) {
    maxScore = calcMax;
  }

  return {
    name: llmData.studentName || 'Unknown',
    class: llmData.className || 'Unknown',
    courseName,
    level,
    unit,
    date,
    score: {
      total: totalScore,
      max: maxScore
    },
    modules: (llmData.modules || []).map((m: any) => {
      const correct = parseScore(m.correct) || 0;
      const total = parseScore(m.total) || 1;
      const percent = getPercentage(correct, total);
      return {
        name: m.name,
        score: `${percent}%`,
        correct: correct,
        total: total,
        color: getColorClass(percent, 'text')
      };
    }),
    radarData: (llmData.radarData || []).map((r: any) => ({
      subject: r.subject,
      A: parseScore(r.score) || 0,
      fullMark: 100
    })),
    barData: (llmData.modules || []).map((m: any) => {
      const correct = parseScore(m.correct) || 0;
      const total = parseScore(m.total) || 1;
      const percent = getPercentage(correct, total);
      return {
        name: m.name,
        score: percent,
        fill: getColorClass(percent, 'bg')
      };
    }),
    pieData: (llmData.errorDistribution || []).map((e: any, idx: number) => ({
      name: e.name,
      value: parseScore(e.percentage) || 0,
      fill: defaultColors[idx % defaultColors.length]
    })),
    keyErrors: (llmData.keyErrors || []).map((k: any) => {
      const earned = parseScore(k.scoreEarned) || 0;
      const mx = parseScore(k.scoreMax) || 1;
      return {
        module: k.module,
        score: `${earned}/${mx}`,
        scoreColor: getScoreColorClass(earned, mx),
        testingPoint: k.testingPoint,
        diagnosis: k.diagnosis
      };
    }),
    deepDiagnosis: llmData.deepDiagnosis || [],
    actionPlan: (llmData.actionPlan || []).map((a: any) => ({
      title: a.title,
      content: a.content,
      icon: ['MessageCircle', 'AlertTriangle', 'Filter'].includes(a.icon) ? a.icon : 'MessageCircle'
    })),
    detailedAnalysis: (llmData.detailedAnalysis || []).map((d: any) => ({
      qNum: d.qNum,
      type: d.type,
      typeColor: getTypeColor(d.type),
      testingPoint: d.testingPoint,
      studentAnswer: d.studentAnswer,
      deepAnalysis: d.deepAnalysis
    }))
  };
}
