export const studentData = {
  name: "Oscar",
  class: "Standard",
  level: "L0",
  unit: "5",
  date: "20th Dec 2025",
  score: {
    total: 41,
    max: 80,
  },
  modules: [
    { name: "Vocabulary", score: "60%", correct: 15, total: 25, color: "text-yellow-600" },
    { name: "Grammar", score: "52%", correct: 21, total: 40, color: "text-red-500" },
    { name: "Communication", score: "80%", correct: 4, total: 5, color: "text-green-500" },
  ],
  radarData: [
    { subject: 'Vocab', A: 60, fullMark: 100 },
    { subject: 'Grammar', A: 52, fullMark: 100 },
    { subject: 'Reading', A: 80, fullMark: 100 },
    { subject: 'Writing', A: 0, fullMark: 100 },
    { subject: 'Logic', A: 40, fullMark: 100 },
  ],
  barData: [
    { name: 'Vocab', score: 60, fill: '#eab308' },
    { name: 'Grammar', score: 52, fill: '#ef4444' },
    { name: 'Comm/Read', score: 80, fill: '#22c55e' },
    { name: 'Writing', score: 0, fill: '#ef4444' }
  ],
  pieData: [
    { name: 'Instructions', value: 35, fill: '#ef4444' },
    { name: 'Grammar', value: 45, fill: '#f97316' },
    { name: 'Spelling', value: 15, fill: '#eab308' },
    { name: 'Context', value: 5, fill: '#3b82f6' }
  ]
};

export const keyErrors = [
  {
    module: "Writing",
    score: "0/10",
    scoreColor: "text-red-600",
    testingPoint: "Instruction<br/>Compliance",
    diagnosis: `<strong>审题重大失误：</strong> 题目要求 "Write sentences" (写句子)，学生仅填写了频度副词 (often, never)。知识点其实掌握了，但因不读题痛失10分。`
  },
  {
    module: "Grammar",
    score: "0/5",
    scoreColor: "text-red-600",
    testingPoint: "Short Answers<br/>(Subject Pronouns)",
    diagnosis: `<strong>人称转换障碍：</strong> 无法根据问句主语转换代词。问 "Does your dad...?"，答 "Yes, I..."。问 "Do your friends...?"，答 "No, I..."。全卷所有回答主语都是 "I"。`
  },
  {
    module: "Grammar",
    score: "4/10",
    scoreColor: "text-yellow-600",
    testingPoint: "Auxiliaries<br/>(Do vs Does)",
    diagnosis: `<strong>助动词混淆：</strong> 对 "Does" 的使用范围界定不清。出现 "Does you", "Does we" (Q6) 以及 "Does your teacher gives" (双重变位) 的错误。`
  },
  {
    module: "Vocab",
    score: "4/10",
    scoreColor: "text-yellow-600",
    testingPoint: "Tech Vocab<br/>(Spelling)",
    diagnosis: `<strong>拼写不严谨：</strong> <em>Game console</em> 拼成 <span class="badge-error">game counsou</span>。e-reader 拼写也有涂改痕迹。`
  }
];

export const deepDiagnosis = [
  {
    title: "“以我为主”综合症 (The \"I\" Syndrome)",
    content: `Oscar 在 Q7 的表现显示，他只要看到问句，就潜意识觉得是在问“他自己”。他没有去处理句中的 "your dad" 或 "your friends" 这些信息，直接反射性地用 "I"作答。`
  },
  {
    title: "指令盲区 (Instruction Blindness)",
    content: `Q9 的0分非常可惜。这不属于能力问题，而是习惯问题。他看到了 "often/never" 就直接填词，完全忽略了题目中加粗下划线的 <u>**Write sentences**</u>。`
  },
  {
    title: "助动词乱用",
    content: `在 Q6 和 Q8 中，Do 和 Does 像是随机选择。特别是 "Does you useing" 这种错误，混合了助动词错误、时态错误（加ing）和句子结构错误。`
  }
];

export const actionPlan = [
  {
    title: "“替身说话”游戏 (Pronoun Drill)",
    content: `练习指着别人的照片提问。T: "Does Spiderman like pizza?" S: "Yes, <strong>HE</strong> does." 强迫学生转换人称，禁止说 "I"。`,
    icon: "MessageCircle"
  },
  {
    title: "审题圈画训练 (Circle the Verb)",
    content: `做题前，强制要求Oscar圈出题目中的动词指令（如 <strong>Write sentences</strong>, <strong>Circle</strong>, <strong>Match</strong>）。不圈不准做题。`,
    icon: "AlertTriangle"
  },
  {
    title: "Do/Does 分类卡片",
    content: `制作两堆卡片。一堆是 You, We, They, Friends；一堆是 He, She, Mum, Dad。练习快速把它们分配给 "Do" 和 "Does" 两个篮子。`,
    icon: "Filter"
  }
];

export const detailedAnalysis = [
  {
    qNum: "3",
    type: "Vocab",
    typeColor: "bg-emerald-100 text-emerald-800",
    testingPoint: "科技名词拼写<br/>(Technology Objects)",
    studentAnswer: `<span class="text-red-600">game counsou</span><br/>eader (e-reader)`,
    deepAnalysis: `<li><strong>Game Console:</strong> 单词掌握不牢固，完全凭发音拼凑 ("coun-sou")。</li><li><strong>e-reader:</strong> 似乎忘记了连字符或者 'r' 的发音。</li>`
  },
  {
    qNum: "4",
    type: "Grammar",
    typeColor: "bg-blue-100 text-blue-800",
    testingPoint: "三单动词变化<br/>(3rd Person Singular)",
    studentAnswer: `<span class="text-green-600">All Correct (5/5)</span>`,
    deepAnalysis: `<li><strong>掌握优秀：</strong> 很清楚 <em>My sister studies, My dad teaches</em>。这说明他懂得肯定句的规则。</li>`
  },
  {
    qNum: "5",
    type: "Grammar",
    typeColor: "bg-blue-100 text-blue-800",
    testingPoint: "频度副词位置<br/>(Adverbs of Freq)",
    studentAnswer: `<span class="text-green-600">All Correct (10/10)</span>`,
    deepAnalysis: `<li><strong>掌握优秀：</strong> 准确区分了 Be动词之后 (is never) 和实义动词之前 (often hang out)。这是本卷最大的亮点。</li>`
  },
  {
    qNum: "6",
    type: "Grammar",
    typeColor: "bg-blue-100 text-blue-800",
    testingPoint: "一般疑问句提问<br/>(Question Form)",
    studentAnswer: `"Does you often play..."<br/>"Does we use..."`,
    deepAnalysis: `<li><strong>助动词选择错误：</strong> 误认为提问都要用 <em>Does</em>。</li><li><strong>规则不清：</strong> 没有建立 "You/We/They 用 Do" 的条件反射。</li>`
  },
  {
    qNum: "7",
    type: "Grammar",
    typeColor: "bg-blue-100 text-blue-800",
    testingPoint: "简短回答<br/>(Short Answers)",
    studentAnswer: `<span class="text-red-600">Q: Does your dad...?<br/>A: Yes, I Does.</span>`,
    deepAnalysis: `<li><strong>严重错误 (0/5)：</strong> 三重错误叠加。</li><li>1. 主语错误 (Dad应变He，却写I)。</li><li>2. 搭配错误 (I 后面不能接 Does)。</li><li>3. 肯定/否定混淆 (No... Doesnt)。</li>`
  },
  {
    qNum: "8",
    type: "Grammar",
    typeColor: "bg-blue-100 text-blue-800",
    testingPoint: "动词填空<br/>(Present Simple)",
    studentAnswer: `"doent play"<br/>"Does you useing"`,
    deepAnalysis: `<li><strong>语法混乱：</strong> <em>Does you useing</em> 显示学生混淆了现在进行时(ing)和一般现在时。</li><li><strong>拼写：</strong> doesn't 拼写错误。</li><li><strong>双重变位：</strong> <em>Does ... gives</em> (Does后动词未还原)。</li>`
  },
  {
    qNum: "9",
    type: "Writing",
    typeColor: "bg-pink-100 text-pink-800",
    testingPoint: "造句<br/>(Sentence Building)",
    studentAnswer: `<span class="text-red-600">Wrote only words:<br/>"often", "never"...</span>`,
    deepAnalysis: `<li><strong>未完成任务：</strong> 题目明确要求 "Write sentences"，学生只填写了对应的副词。</li><li><strong>建议：</strong> 需进行“指令阅读”的强化训练，不要急于下笔。</li>`
  },
  {
    qNum: "10",
    type: "Comm",
    typeColor: "bg-purple-100 text-purple-800",
    testingPoint: "情景对话<br/>(Dialogue)",
    studentAnswer: `<span class="text-green-600">Mostly Correct (4/5)</span>`,
    deepAnalysis: `<li><strong>语感尚可：</strong> 能够根据上下文选择 help, great, here 等词，说明阅读理解能力和语感是在线的。</li>`
  }
];
