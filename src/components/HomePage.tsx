import React, { useState, useRef } from 'react';
import { Upload, Settings, Sparkles, FileText, CheckCircle, AlertCircle, Loader2, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { transformData } from '../utils/transformData';

interface HomePageProps {
  onAnalyzeSuccess: (data: any) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export default function HomePage({ onAnalyzeSuccess }: HomePageProps) {
  const [apiUrl, setApiUrl] = useState('https://api.siliconflow.cn/v1');
  const [apiKey, setApiKey] = useState('');
  const [modelName, setModelName] = useState('Qwen/Qwen3-VL-32B-Instruct');
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files!)]);
      setErrorMsg('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const filesArray = Array.from(selectedFiles);
      setFiles(prev => [...prev, ...filesArray]);
      setErrorMsg('');
    }
    // Reset so same files can be selected again if removed
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    setErrorMsg('');
    if (files.length === 0 || !apiKey) {
      setErrorMsg('请填写 API Key 并上传至少一张试卷图片！');
      return;
    }

    setIsAnalyzing(true);

    try {
      const base64Files = await Promise.all(files.map(fileToBase64));
      
      const prompt = `你是一个专业的英语教育专家和智能阅卷系统。请分析用户上传的英语试卷/练习/作业图片（支持国内公立体系、剑桥少儿、TH!NK、PowerUp等各类国内外英语考试体系），提取关键信息、识别错误，并生成深度诊断报告。如果有多张图片，请综合分析。
必须严格输出合法的 JSON 格式，不要包含任何 markdown 标记（如 \`\`\`json 等），只输出纯 JSON 字符串。
JSON结构要求如下：
{
  "studentName": "学生姓名（如果找不到请留空或写Unknown）",
  "className": "班级",
  "courseName": "试卷/课程名称（如果在图中找不到明确名称，请务必返回空字符串 \"\"，千万不要编造或照抄例子）",
  "level": "级别（如果在图中找不到，请务必返回空字符串 \"\"）",
  "unit": "单元/期中/期末等（如果在图中找不到，请务必返回空字符串 \"\"）",
  "date": "日期（如果在图中找不到，请务必返回空字符串 \"\"）",
  "totalScore": 41,
  "maxScore": 80,
  "modules": [
    { "name": "模块名称（如阅读、词汇、语法、写作、听力等）", "correct": 15, "total": 25 }
    // 注意：所有模块的 correct 累加必须等于 totalScore，total 累加必须等于 maxScore
  ],
  "radarData": [
    { "subject": "能力维度（如词汇、语法、阅读、写作、沟通等）", "score": 60 }
  ],
  "errorDistribution": [
    { "name": "失分原因（如审题不清、时态混淆、拼写错误、单复数等）", "percentage": 35 }
  ],
  "keyErrors": [
    {
      "module": "Writing",
      "scoreEarned": 0,
      "scoreMax": 10,
      "testingPoint": "核心考点名称",
      "diagnosis": "诊断分析描述（支持HTML如<strong>加粗</strong>）"
    }
  ],
  "deepDiagnosis": [
    {
      "title": "深度诊断标题",
      "content": "详细分析内容..."
    }
  ],
  "actionPlan": [
    {
      "title": "提升方案标题",
      "content": "详细方案",
      "icon": "MessageCircle" // 可选: MessageCircle, AlertTriangle, Filter
    }
  ],
  "detailedAnalysis": [
    {
      "qNum": "题号",
      "type": "Vocab", // 题型归类，如 Vocab, Grammar, Writing, Comm
      "testingPoint": "考察知识点",
      "studentAnswer": "学生答案",
      "deepAnalysis": "<li>分析点1</li><li>分析点2</li>"
    }
  ]
}`;

      const content: any[] = [
        { type: "text", text: prompt }
      ];

      for (const base64 of base64Files) {
        content.push({
          type: "image_url",
          image_url: { url: base64 }
        });
      }

      // 自动处理接口地址拼接
      const endpoint = apiUrl.endsWith('/chat/completions') 
        ? apiUrl 
        : `${apiUrl.replace(/\/$/, '')}/chat/completions`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            {
              role: "user",
              content: content
            }
          ],
          temperature: 0.2,
          max_tokens: 8192
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API 请求失败: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      let textContent = result.choices[0].message.content;
      
      // Clean up markdown json block if any
      textContent = textContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      const parsedData = JSON.parse(textContent);
      const finalData = transformData(parsedData);
      
      setIsAnalyzing(false);
      onAnalyzeSuccess(finalData);
    } catch (error: any) {
      console.error(error);
      setIsAnalyzing(false);
      setErrorMsg(`分析失败: ${error.message || '请检查网络或 API 配置及 Key 是否正确。详细报错可查看控制台。'}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Subtle background glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl w-full space-y-8 relative z-10"
      >
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            AI 智能试卷<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">分析系统</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            上传试卷图片，自动识别、批改并生成深度学习诊断报告。数据完全在本地通过 API 处理，保障隐私安全。
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-white/50"
        >
          <div className="grid grid-cols-1 lg:grid-cols-5">
            
            {/* 左侧：API 配置 */}
            <div className="p-8 lg:col-span-2 bg-gray-50/50 border-b lg:border-b-0 lg:border-r border-gray-200/60">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Settings className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">模型配置</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">API Base URL</label>
                  <input
                    type="text"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="https://api.siliconflow.cn/v1"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm"
                  />
                  <p className="mt-2 text-xs text-gray-500">默认推荐使用硅基流动 (SiliconFlow) 接口</p>
                  <p className="mt-2 text-xs text-gray-500"><a href="https://cloud.siliconflow.cn/i/zrdQ3sre" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">点击注册获取免费额度</a></p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">API Key</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-mono"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    *您的 Key 仅在当前浏览器使用，不会上传至任何第三方服务器。
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">识别与分析模型</label>
                  <input
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder="例如: Qwen/Qwen3-VL-32B-Instruct"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm"
                  />
                  <p className="mt-2 text-xs text-gray-500">必须输入支持视觉 (Vision) 的多模态模型名称</p>
                </div>
              </div>
            </div>

            {/* 右侧：文件上传 */}
            <div className="p-8 lg:col-span-3 flex flex-col justify-center bg-white relative z-20">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                  <Upload className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">上传试卷</h2>
              </div>

              <div
                className={`flex-1 min-h-[240px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 transition-all duration-200 cursor-pointer ${
                  isDragging ? 'border-blue-500 bg-blue-50/50 scale-[1.02]' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  multiple
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  onClick={(e) => e.stopPropagation()}
                  accept="image/*,.pdf"
                />
                
                {files.length > 0 ? (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full h-full flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-3 px-2">
                      <span className="text-sm font-semibold text-gray-700">已选择 {files.length} 个文件</span>
                      <span className="text-xs text-blue-500 hover:underline cursor-pointer font-medium" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>继续添加</span>
                    </div>
                    <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                      {files.map((f, idx) => (
                        <div key={`${f.name}-${idx}`} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200 shadow-sm" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center overflow-hidden mr-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mr-2" />
                            <span className="text-sm font-medium text-gray-800 truncate">{f.name}</span>
                          </div>
                          <div className="flex items-center flex-shrink-0">
                            <span className="text-xs text-gray-500 mr-3">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                            <button onClick={(e) => { e.stopPropagation(); removeFile(idx); }} className="text-gray-400 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 p-1.5 rounded-full">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-base font-medium text-gray-700 mb-2">点击选择文件，或将文件拖拽到此处</p>
                    <p className="text-sm text-gray-400">支持 JPG, PNG, PDF 格式高清扫描件 (支持多选)</p>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || files.length === 0}
                  className={`w-full py-4 px-6 rounded-2xl flex items-center justify-center text-lg font-bold transition-all duration-200 ${
                    isAnalyzing || files.length === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl hover:-translate-y-0.5'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      正在智能分析中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6 mr-3" />
                      {files.length > 0 && apiKey ? '开始生成诊断报告' : '请完善信息后开始'}
                    </>
                  )}
                </button>
                {errorMsg && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-start shadow-sm">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" /> 
                    <span className="font-medium break-words leading-relaxed">{errorMsg}</span>
                  </motion.div>
                )}
                {!apiKey && files.length > 0 && !errorMsg && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500 mt-4 flex items-center justify-center font-medium bg-red-50 py-2 rounded-xl border border-red-100">
                    <AlertCircle className="w-4 h-4 mr-1.5" /> 请在左侧填写 API Key 后继续
                  </motion.p>
                )}
              </div>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
