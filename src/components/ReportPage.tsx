import React from 'react';
import { Printer, Stethoscope, ClipboardCheck, MessageCircle, AlertTriangle, Filter, ArrowLeft } from 'lucide-react';
import { RadarPlot, BarPlot, PiePlot } from './Charts';
import { motion } from 'motion/react';

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'MessageCircle': return <MessageCircle className="w-4 h-4" />;
    case 'AlertTriangle': return <AlertTriangle className="w-4 h-4" />;
    case 'Filter': return <Filter className="w-4 h-4" />;
    default: return <MessageCircle className="w-4 h-4" />;
  }
};

interface ReportPageProps {
  onBack: () => void;
  data: any;
}

export default function ReportPage({ onBack, data }: ReportPageProps) {
  const [showPrintHint, setShowPrintHint] = React.useState(false);

  const handlePrint = () => {
    try {
      if (window.self !== window.top) {
        setShowPrintHint(true);
        setTimeout(() => setShowPrintHint(false), 8000);
      }
      window.print();
    } catch (e) {
      setShowPrintHint(true);
      setTimeout(() => setShowPrintHint(false), 8000);
    }
  };

  const {
    name, class: className, courseName, level, unit, date, score,
    modules, radarData, barData, pieData,
    keyErrors, deepDiagnosis, actionPlan, detailedAnalysis
  } = data;

  return (
    <div className="min-h-screen bg-gray-100 pb-12 pt-20 font-sans">
      {/* Floating Top Navigation (No Print) */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="print:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm px-6 py-3 flex justify-between items-center transition-all"
      >
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="text-gray-600 hover:text-blue-600 transition-colors flex items-center text-sm font-semibold bg-gray-100 hover:bg-blue-50 px-3 py-1.5 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> 返回重新上传
          </button>
          <div className="h-6 w-px bg-gray-300"></div>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">当前学生分析:</span>
            <span className="font-mono text-blue-700 font-bold bg-blue-100/50 px-2.5 py-1 rounded border border-blue-200/50">{name}</span>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg inline-flex items-center text-sm cursor-pointer transition-all shadow-md hover:shadow-lg"
          >
            <Printer className="w-4 h-4 mr-2" /> 打印完整报告 (2页)
          </button>
          {showPrintHint && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="absolute top-full mt-2 right-0 w-72 bg-white rounded-lg shadow-xl border border-blue-100 p-4 z-50 text-sm text-gray-700"
            >
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-800 mb-1">提示：环境限制</p>
                  <p>当前处于预览窗口中，浏览器可能会拦截打印功能。</p>
                  <p className="mt-2">请点击页面顶部右侧的 <strong>“Open in new tab (在新标签页中打开)”</strong> 或 <strong>全屏模式</strong>，然后再试。</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto space-y-8 mt-6 print:space-y-0 print:mt-0">
        {/* Page 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="a4-page shadow-2xl"
        >
          <header className="flex justify-between items-end border-b-2 border-gray-200 pb-3 mb-3">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
                {courseName || level || unit ? (
                  <>
                    {courseName ? `${courseName} ` : ''}
                    {level ? `${level} ` : ''}
                    {unit ? <span className="text-blue-600">{unit} </span> : ''}
                    诊断报告
                  </>
                ) : (
                  '学情诊断报告 (Diagnostic Report)'
                )}
              </h1>
              <p className="text-gray-500 text-xs mt-1">学情分析与学习诊断 (Assessment Analysis & Learning Diagnostics)</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{score.total}<span className="text-lg text-gray-400 font-normal">/{score.max}</span></div>
              <div className="text-xs font-bold text-gray-600 uppercase">总分 (Total Score)</div>
              <div className="text-xs text-gray-400">日期: {date}</div>
            </div>
          </header>

          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="col-span-1 score-box p-2 flex flex-col justify-center">
              <div className="text-xs text-blue-500 font-bold uppercase">学生 (Student)</div>
              <div className="text-lg font-bold text-gray-800 leading-tight">{name}</div>
              <div className="text-xs text-gray-500">班级: {className}</div>
            </div>
            <div className="col-span-3 grid grid-cols-3 gap-2">
              {modules.map((mod: any, idx: number) => (
                <div key={idx} className="text-center p-1 border rounded bg-white">
                  <div className="text-xs text-gray-500">{mod.name}</div>
                  <div className={`text-base font-bold ${mod.color}`}>{mod.score}</div>
                  <div className="text-[10px] text-gray-400">{mod.correct}/{mod.total} 掌握 (Correct)</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="col-span-1">
              <h3 className="text-xs font-bold text-gray-500 mb-1 text-center">能力模型 (Radar)</h3>
              <RadarPlot data={radarData} />
            </div>
            <div className="col-span-1">
              <h3 className="text-xs font-bold text-gray-500 mb-1 text-center">模块得分 (Performance)</h3>
              <BarPlot data={barData} />
            </div>
            <div className="col-span-1">
              <h3 className="text-xs font-bold text-gray-500 mb-1 text-center">失分归因 (Errors)</h3>
              <PiePlot data={pieData} />
            </div>
          </div>

          <div className="mb-4">
            <h2 className="section-title text-sm mb-2">核心失分点摘要 (Key Error Summary)</h2>
            <table className="w-full detail-table">
              <thead>
                <tr>
                  <th width="12%">模块</th>
                  <th width="10%">得分</th>
                  <th width="25%">核心考点</th>
                  <th width="53%">诊断简述</th>
                </tr>
              </thead>
              <tbody>
                {keyErrors.map((error: any, idx: number) => (
                  <tr key={idx}>
                    <td className="font-semibold text-gray-600">{error.module}</td>
                    <td className={`text-center font-mono ${error.scoreColor} font-bold`}>{error.score}</td>
                    <td className="text-xs text-gray-500" dangerouslySetInnerHTML={{ __html: error.testingPoint }}></td>
                    <td className="text-xs text-gray-700" dangerouslySetInnerHTML={{ __html: error.diagnosis }}></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-4 flex-grow h-auto">
            <div className="bg-red-50 p-3 rounded-lg border border-red-100 flex flex-col">
              <h2 className="section-title text-sm mb-2 text-red-700 border-red-500 flex items-center">
                <Stethoscope className="w-4 h-4 mr-1" />深度学习诊断 (Diagnosis)
              </h2>
              <ul className="text-xs space-y-2 text-gray-700 flex-grow pl-1">
                {deepDiagnosis.map((item: any, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span><strong>{item.title}:</strong> {item.content}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex flex-col">
              <h2 className="section-title text-sm mb-2 text-green-700 border-green-500 flex items-center">
                <ClipboardCheck className="w-4 h-4 mr-1" />专项提升方案 (Action Plan)
              </h2>
              <ul className="text-xs space-y-2 text-gray-700 flex-grow pl-1">
                {actionPlan.map((item: any, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-600 mr-2 mt-0.5">{getIcon(item.icon)}</span>
                    <span><strong>{item.title}:</strong><br /><span dangerouslySetInnerHTML={{ __html: item.content }}></span></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <footer className="mt-auto pt-2 border-t border-gray-200 flex justify-between text-[10px] text-gray-400">
            <span>学生 (Student): {name}{level && ` | ${level}`}{unit && ` | ${unit}`}</span>
            <span>Page 1/2</span>
          </footer>
        </motion.div>

        {/* Page 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="a4-page shadow-2xl"
        >
          <header className="border-b-2 border-gray-200 pb-3 mb-4">
            <h1 className="text-xl font-bold text-gray-800">全卷知识点与失分深度复盘表</h1>
            <p className="text-gray-500 text-xs mt-1">Detailed Analysis & Error Breakdown</p>
          </header>

          <div className="flex-grow">
            <table className="w-full detail-table styled-header">
              <thead>
                <tr>
                  <th width="8%">题号</th>
                  <th width="10%">题型</th>
                  <th width="20%">考察知识点 (Knowledge Point)</th>
                  <th width="25%">学生作答 (Student Answer)</th>
                  <th width="37%">深度分析 (Deep Analysis)</th>
                </tr>
              </thead>
              <tbody>
                {detailedAnalysis.map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td className="q-num">{item.qNum}</td>
                    <td>
                      <span className={`text-[0.65rem] px-1.5 py-0.5 rounded flex items-center justify-center w-[60px] ${item.typeColor}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="text-xs" dangerouslySetInnerHTML={{ __html: item.testingPoint }}></td>
                    <td className="text-xs" dangerouslySetInnerHTML={{ __html: item.studentAnswer }}></td>
                    <td className="text-xs">
                      <ul className="list-disc pl-3" dangerouslySetInnerHTML={{ __html: item.deepAnalysis }}></ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="mt-4 pt-2 border-t border-gray-200 flex justify-between text-[10px] text-gray-400">
            <span>学生 (Student): {name}{level && ` | ${level}`}{unit && ` | ${unit}`}</span>
            <span>Page 2/2 - Detailed Analysis</span>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
