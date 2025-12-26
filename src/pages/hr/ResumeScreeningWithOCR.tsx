/**
 * 智能简历筛选模块 - 阿里云OCR版本
 * 
 * 功能：
 * - 阿里云高精版OCR识别
 * - SQLite本地数据库
 * - 实时调用次数追踪
 * - PDF简历自动解析
 */

import React, { useState, useEffect } from 'react';
import {
  CloudArrowUpIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  EyeIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  StarIcon,
  TableCellsIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { aliyunOCR } from '../../services/aliyunOCR';
import { database } from '../../services/database';
import { OCRUsageIndicator, OCRUsageMini } from '../../components/OCRUsageIndicator';

// ============= 类型定义 =============

interface ResumeData {
  id: string;
  fileName: string;
  uploadTime: Date;
  status: 'uploading' | 'parsing' | 'completed' | 'failed';
  
  // OCR相关
  ocrText: string;
  ocrProgress: number; // 0-100
  
  // 解析后的数据
  basicInfo: {
    name: string;
    age?: number;
    gender?: string;
    phone: string;
    email: string;
    education?: string;
  };
  
  // 评分
  totalScore: number;
  educationScore: number;
  experienceScore: number;
  skillScore: number;
  
  // 其他
  tags: string[];
  notes: string;
  skills: string[];
  totalWorkYears?: number;
}

export const ResumeScreeningWithOCR: React.FC = () => {
  // ============= 状态管理 =============
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [filteredResumes, setFilteredResumes] = useState<ResumeData[]>([]);
  const [, ] = useState<Set<string>>(new Set()); // selectedResumes - 预留批量操作功能
  
  // OCR调用次数
  const [ocrUsedCalls, setOcrUsedCalls] = useState(0);
  const [ocrTotalCalls] = useState(500);
  
  // UI状态
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState<'totalScore' | 'uploadTime' | 'education'>('totalScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showUploadArea, setShowUploadArea] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // 筛选条件
  const [filterEducation, setFilterEducation] = useState<string>('');
  const [filterMinScore, setFilterMinScore] = useState<number>(0);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // 消息提示
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);
  
  // 数据库状态
  const [dbInitialized, setDbInitialized] = useState(false);

  // ============= 初始化 =============
  useEffect(() => {
    initializeDatabase();
    loadOCRUsage();
  }, []);

  // 初始化数据库
  const initializeDatabase = async () => {
    try {
      await database.initialize();
      setDbInitialized(true);
      
      // 加载已有简历数据
      let savedResumes = database.getAllResumes();
      let parsedResumes = savedResumes.map(r => ({
        id: r.id,
        fileName: r.fileName,
        uploadTime: new Date(r.uploadTime),
        status: r.status as any,
        ocrText: r.ocrText,
        ocrProgress: 100,
        basicInfo: JSON.parse(r.parsedData || '{}').basicInfo || {},
        totalScore: r.totalScore,
        educationScore: r.educationScore,
        experienceScore: r.experienceScore,
        skillScore: r.skillScore,
        tags: JSON.parse(r.tags || '[]'),
        notes: r.notes,
        skills: JSON.parse(r.parsedData || '{}').skills?.professionalSkills || [],
        totalWorkYears: JSON.parse(r.parsedData || '{}').totalWorkYears
      }));
      
      // 如果没有简历数据，添加模拟数据
      if (parsedResumes.length === 0) {
        // 模拟张骄阳的简历数据
        const zhangResume: ResumeData = {
          id: 'mock_resume_zhang_001',
          fileName: '张骄阳-简历.pdf',
          uploadTime: new Date('2025-12-25T10:30:00'),
          status: 'completed',
          ocrText: `### 张骄阳 - 简历文字提取 \n#### 一、基本信息 \n 姓名：张骄阳  \n 籍贯：河南信阳  \n 电话：18338675175  \n 邮箱：3214754449@qq.com  \n 技能：掌握Word、Excel、Python、Tableau、SQL等软件 \n\n#### 二、教育经历 \n 1. 2020.9-2024.7 景德镇陶瓷大学 管理与经济学院 工商管理专业（本科）  \n    主修课程：人力资源管理、创业管理、经济法、统计学、会计学基础、高等数学B(I)、组织行为学、线性代数  \n 2. 2024.9-至今 北京交通大学 经济管理学院 物流工程与管理（硕士）  \n    主修课程：数据挖掘与商务智能、高级管理学、工程经济学、高级运筹学、不确定下数据驱动决策、物流工程专业英语 \n\n#### 三、实习经历 \n 2025年4月-2025年6月 北京安信创业信息科技发展有限公司 运营管理部实习生  \n - 项目管理：跟踪项目进度、协调资源，解决执行问题，优化管理流程，提升团队效率  \n - 合同管理：协助完成合同签署全流程，包括初步审查、资料整理、开票用印等，规避潜在风险  \n - 宣传物料制作：运用设计软件辅助制作宣传海报和手册，提升视觉效果，支持品牌推广 \n\n#### 四、项目经历 \n 1. 2025年4月-至今 铁路局需求预测项目（成员）  \n    项目概述：分析铁路局过往数据，构建模型预测动车组三级修程偶换备件需求  \n    项目职责：参与数据筛查与分析，撰写报告研究内容与思路，编写备件协同供应研究方向报告  \n    个人收获：掌握时间序列算法及深度学习模型原理，了解时序算法适用场景，学会动车备件需求预测方法  \n 2. 2025年3月-至今 冀北电网资产评估项目（核心成员）  \n    项目概述：基于LCC、RCM和APM等理论，以电能表为试点，建立多维度计量资产价值模型及评价体系  \n    项目职责：构建指标体系，设计各项指标及资产价值计算公式  \n    个人收获：熟练掌握价值模型构建方法，能独立完成指标体系与复杂公式设计，提升数据处理与分析能力 \n\n#### 五、获奖证书 \n - 2022-2023学年第一、二学期：两次校级三等奖学金、一次进步奖学金  \n - 2021-2022学年第二学期：第八届企业竞争模拟大赛一等奖  \n - 2022-2023学年第一学期：景德镇陶瓷大学2021年度“优秀志愿者” \n\n#### 六、自我评价 \n - 能吃苦耐劳，自学能力强，自学PS、PR、AE等剪辑软件并从事相关兼职  \n - 沟通能力强，善于交流，逻辑清晰，获系辩论赛季军及最佳辩手  \n - 抗压与时间协调能力较强，研究生期间自学补齐本科知识缺陷`,
          ocrProgress: 100,
          basicInfo: {
            name: '张骄阳',
            phone: '18338675175',
            email: '3214754449@qq.com',
            education: '硕士'
          },
          totalScore: 88,
          educationScore: 85,
          experienceScore: 80,
          skillScore: 100,
          tags: [],
          notes: '',
          skills: ['Word', 'Excel', 'Python', 'Tableau', 'SQL'],
          totalWorkYears: 0.5
        };

        // 模拟郑锦城的简历数据
        const zhengResume: ResumeData = {
          id: 'mock_resume_zheng_002',
          fileName: '郑锦城-简历.pdf',
          uploadTime: new Date('2025-12-25T11:15:00'),
          status: 'completed',
          ocrText: `### 郑锦城 - 简历文字提取 \n#### 一、基本信息 \n 姓名：郑锦城  \n 年龄：30岁  \n 政治面貌：群众  \n 民族：汉族  \n 籍贯：吉林省  \n 联系电话：18373120430  \n 电子邮箱：1107912315@qq.com \n\n#### 二、教育经历 \n 1. 2021.09-2024.06 天津商业大学 金融学（硕士）  \n    研究方向：金融市场与金融机构  \n    主修课程：投资学、金融学（91分）、金融市场与金融机构（89分）、公司金融、证券投资学、中级微观经济学（85分）、中级宏观经济学、中级计量经济学、金融工程、金融科技  \n    辅修课程：证券股票模拟实操、金融工程与资产定价、英文写作  \n 2. 2014.09-2018.06 长沙大学 土木工程（本科）  \n    主修课程：结构力学、材料力学、理论力学、桥梁工程、混凝土设计与结构、工程测量  \n    辅修课程：英文写作 \n\n#### 三、工作经历 \n 1. 2024.08-2024.11 博文德能源集团 研究与咨询  \n    任务：参与国家电网、国家能源集团数智化转型、绿色化转型研究规划项目  \n    成果：完成国家电网公司、国家能源集团数字化转型分析与研究报告  \n 2. 2022.03-2022.04 天健会计师事务所 审计/财务分析（实习）  \n    任务：审查财务报表、会计记录等，确认真实性与准确性，检查收入、支出等财务项目，确保符合准则与法规  \n    成果：完成被审计企业资产负债表、利润表、现金流量表制作，定期出具报告  \n 3. 2022.04-2022.05 天职国际会计师事务所 审计/财务分析（实习）  \n    任务：执行大型公司IPO财务报表审计，分析财务数据，评估内部控制体系，提供改进建议，协助内部审计，解决财务风险  \n    成果：推进公司IPO进度，掌握上市细节，熟悉财务报表  \n 4. 2018.07-2019.04 中国航空工业集团 工程师/项目经理助理  \n    任务：设计工程初步方案，负责项目规划与管理（资源调配、进度/成本/质量控制、团队协调），与合作方沟通推进进度  \n    成果：参与华大基因项目大梅沙基地整体幕墙项目建成，深化多方协同合作认知 \n\n#### 四、技能奖项 \n - 证书：全国大学生英语六级证书、基金从业资格证、证券从业资格证书  \n - 奖项：天津商业大学研究生三等奖学金  \n - 其他：长沙学院系青年志愿者协会会员、长沙学院系足球队队员；发表刊物《科学与财富》《探索科学》  \n - 技能：熟练使用Word、Excel、PPT、Stata等计算机办公软件 \n\n#### 五、自我评价 \n - 金融知识扎实，热爱金融投资，有实践经验，具备良好金融分析能力与自驱力  \n - 踏实肯干、积极上进、适应能力强，工作责任心强，抗压能力突出  \n - 团队沟通协调能力良好，能沉稳处理工作`,
          ocrProgress: 100,
          basicInfo: {
            name: '郑锦城',
            age: 30,
            phone: '18373120430',
            email: '1107912315@qq.com',
            education: '硕士'
          },
          totalScore: 92,
          educationScore: 85,
          experienceScore: 100,
          skillScore: 90,
          tags: [],
          notes: '',
          skills: ['Word', 'Excel', 'PPT', 'Stata', '基金从业资格证', '证券从业资格证书'],
          totalWorkYears: 6
        };

        parsedResumes = [zhangResume, zhengResume];
        
        // 将模拟数据保存到数据库
        parsedResumes.forEach(resume => {
          database.insertResume({
            id: resume.id,
            fileName: resume.fileName,
            uploadTime: resume.uploadTime.toISOString(),
            ocrText: resume.ocrText,
            parsedData: JSON.stringify({
              basicInfo: resume.basicInfo,
              skills: {
                professionalSkills: resume.skills
              },
              totalWorkYears: resume.totalWorkYears
            }),
            status: 'completed',
            tags: JSON.stringify(resume.tags),
            totalScore: resume.totalScore,
            educationScore: resume.educationScore,
            experienceScore: resume.experienceScore,
            skillScore: resume.skillScore,
            notes: resume.notes
          });
        });
      }
      
      setResumes(parsedResumes);
      setFilteredResumes(parsedResumes);
      
      showMessage('success', `数据库初始化成功，加载了 ${parsedResumes.length} 份简历`);
    } catch (error: any) {
      console.error('数据库初始化失败:', error);
      showMessage('error', '数据库初始化失败: ' + error.message);
    }
  };

  // 加载OCR使用情况
  const loadOCRUsage = () => {
    const used = aliyunOCR.getUsedCalls();
    setOcrUsedCalls(used);
  };

  // ============= 文件上传处理 =============
  
  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    // 检查是否都是PDF
    const nonPdfFiles = fileArray.filter(f => !f.name.toLowerCase().endsWith('.pdf'));
    if (nonPdfFiles.length > 0) {
      showMessage('error', '只支持PDF格式的简历文件！');
      return;
    }

    // 检查OCR额度
    const remainingCalls = aliyunOCR.getRemainingCalls();
    if (remainingCalls <= 0) {
      showMessage('error', 'OCR调用额度已用尽，无法继续上传简历！');
      return;
    }

    if (remainingCalls < fileArray.length) {
      showMessage('warning', `OCR额度不足！剩余 ${remainingCalls} 次，本次上传 ${fileArray.length} 份简历`);
    }

    // 开始处理文件
    for (const file of fileArray) {
      await processResumeFile(file);
    }

    setShowUploadArea(false);
  };

  // 处理单个简历文件
  const processResumeFile = async (file: File) => {
    const resumeId = `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 创建初始记录
    const newResume: ResumeData = {
      id: resumeId,
      fileName: file.name,
      uploadTime: new Date(),
      status: 'uploading',
      ocrText: '',
      ocrProgress: 0,
      basicInfo: {
        name: '',
        phone: '',
        email: ''
      },
      totalScore: 0,
      educationScore: 0,
      experienceScore: 0,
      skillScore: 0,
      tags: [],
      notes: '',
      skills: []
    };

    setResumes(prev => [newResume, ...prev]);
    setFilteredResumes(prev => [newResume, ...prev]);

    try {
      // 更新状态为解析中
      updateResumeStatus(resumeId, 'parsing', 10);

      // 调用阿里云OCR识别
      const ocrText = await aliyunOCR.recognizePDF(file, (current, total) => {
        const progress = Math.floor((current / total) * 80) + 10; // 10-90%
        updateResumeStatus(resumeId, 'parsing', progress);
      });

      // 更新OCR调用次数
      loadOCRUsage();

      // 记录到数据库
      database.recordOCRUsage(file.name, 1, true);

      // 解析简历信息
      updateResumeStatus(resumeId, 'parsing', 90);
      const parsedData = aliyunOCR.parseResumeFromText(ocrText);

      // 计算评分
      const scores = calculateScores(parsedData);

      // 更新简历数据
      const updatedResume: ResumeData = {
        ...newResume,
        status: 'completed',
        ocrProgress: 100,
        ocrText: ocrText,
        basicInfo: {
          name: parsedData.basicInfo.name || '未识别',
          age: parsedData.basicInfo.age,
          gender: parsedData.basicInfo.gender,
          phone: parsedData.basicInfo.phone || '',
          email: parsedData.basicInfo.email || '',
          education: parsedData.education[0]?.degree || '未知'
        },
        totalScore: scores.totalScore,
        educationScore: scores.educationScore,
        experienceScore: scores.experienceScore,
        skillScore: scores.skillScore,
        skills: parsedData.skills.professionalSkills || [],
        totalWorkYears: parsedData.totalWorkYears
      };

      // 保存到数据库
      database.insertResume({
        id: resumeId,
        fileName: file.name,
        uploadTime: new Date().toISOString(),
        ocrText: ocrText,
        parsedData: JSON.stringify(parsedData),
        status: 'completed',
        tags: JSON.stringify([]),
        totalScore: scores.totalScore,
        educationScore: scores.educationScore,
        experienceScore: scores.experienceScore,
        skillScore: scores.skillScore,
        notes: ''
      });

      // 更新UI
      setResumes(prev => prev.map(r => r.id === resumeId ? updatedResume : r));
      setFilteredResumes(prev => prev.map(r => r.id === resumeId ? updatedResume : r));

      showMessage('success', `${file.name} 解析完成！`);

    } catch (error: any) {
      console.error('简历处理失败:', error);
      
      // 记录失败
      database.recordOCRUsage(file.name, 1, false, error.message);
      
      updateResumeStatus(resumeId, 'failed', 0);
      showMessage('error', `${file.name} 解析失败: ${error.message}`);
      
      // 更新OCR调用次数
      loadOCRUsage();
    }
  };

  // 更新简历状态
  const updateResumeStatus = (
    id: string, 
    status: ResumeData['status'], 
    progress: number
  ) => {
    setResumes(prev => prev.map(r => 
      r.id === id ? { ...r, status, ocrProgress: progress } : r
    ));
    setFilteredResumes(prev => prev.map(r => 
      r.id === id ? { ...r, status, ocrProgress: progress } : r
    ));
  };

  // 计算评分
  const calculateScores = (parsedData: any): {
    totalScore: number;
    educationScore: number;
    experienceScore: number;
    skillScore: number;
  } => {
    let educationScore = 0;
    let experienceScore = 0;
    let skillScore = 0;

    // 学历评分
    const education = parsedData.education[0]?.degree;
    switch (education) {
      case '博士': educationScore = 100; break;
      case '硕士': educationScore = 85; break;
      case '本科': educationScore = 70; break;
      case '专科': educationScore = 50; break;
      default: educationScore = 30;
    }

    // 经验评分
    const workYears = parsedData.totalWorkYears || 0;
    experienceScore = Math.min(workYears * 10, 100);

    // 技能评分
    const skillCount = parsedData.skills?.professionalSkills?.length || 0;
    skillScore = Math.min(skillCount * 8, 100);

    // 总分
    const totalScore = Math.round(
      educationScore * 0.3 + 
      experienceScore * 0.4 + 
      skillScore * 0.3
    );

    return {
      totalScore,
      educationScore,
      experienceScore,
      skillScore
    };
  };

  // ============= 筛选和排序 =============
  
  useEffect(() => {
    let filtered = [...resumes];

    // 搜索关键词
    if (searchKeyword) {
      filtered = filtered.filter(r => 
        r.fileName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        r.basicInfo.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        r.ocrText.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // 学历筛选
    if (filterEducation) {
      filtered = filtered.filter(r => r.basicInfo.education === filterEducation);
    }

    // 分数筛选
    if (filterMinScore > 0) {
      filtered = filtered.filter(r => r.totalScore >= filterMinScore);
    }

    // 状态筛选
    if (filterStatus !== 'all') {
      filtered = filtered.filter(r => r.status === filterStatus);
    }

    // 排序
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'totalScore') {
        comparison = a.totalScore - b.totalScore;
      } else if (sortBy === 'uploadTime') {
        comparison = a.uploadTime.getTime() - b.uploadTime.getTime();
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredResumes(filtered);
  }, [resumes, searchKeyword, filterEducation, filterMinScore, filterStatus, sortBy, sortOrder]);

  // ============= 操作函数 =============

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这份简历吗？')) {
      database.deleteResume(id);
      setResumes(prev => prev.filter(r => r.id !== id));
      showMessage('success', '简历已删除');
    }
  };

  const handleToggleStar = (id: string) => {
    setResumes(prev => prev.map(r => {
      if (r.id === id) {
        const newTags = r.tags.includes('重点关注') 
          ? r.tags.filter(t => t !== '重点关注')
          : [...r.tags, '重点关注'];
        
        database.updateResume(id, { tags: JSON.stringify(newTags) });
        return { ...r, tags: newTags };
      }
      return r;
    }));
  };

  const handleExport = () => {
    // 导出为JSON
    const dataStr = JSON.stringify(filteredResumes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `简历数据_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showMessage('success', `已导出 ${filteredResumes.length} 份简历数据`);
  };

  // 显示消息
  const showMessage = (type: 'success' | 'error' | 'warning', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // 拖拽处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  // ============= 渲染 =============

  if (!dbInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在初始化数据库...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      {/* 顶部导航栏 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">智能简历筛选</h1>
            <p className="text-sm text-gray-500 mt-1">阿里云OCR高精版 + 本地数据库</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Mini OCR指示器 */}
            <OCRUsageMini usedCalls={ocrUsedCalls} totalCalls={ocrTotalCalls} />
            
            <button
              onClick={() => setShowUploadArea(!showUploadArea)}
              disabled={aliyunOCR.getRemainingCalls() <= 0}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <CloudArrowUpIcon className="h-5 w-5" />
              <span>上传简历</span>
            </button>
          </div>
        </div>
      </div>

      {/* 消息提示 */}
      {message && (
        <div className={`mx-6 mt-4 p-4 rounded-lg flex items-center space-x-3 ${
          message.type === 'success' ? 'bg-green-50 border border-green-200' :
          message.type === 'error' ? 'bg-red-50 border border-red-200' :
          'bg-yellow-50 border border-yellow-200'
        }`}>
          {message.type === 'success' && <CheckCircleIcon className="h-5 w-5 text-green-600" />}
          {message.type === 'error' && <XCircleIcon className="h-5 w-5 text-red-600" />}
          {message.type === 'warning' && <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />}
          <span className={`text-sm ${
            message.type === 'success' ? 'text-green-800' :
            message.type === 'error' ? 'text-red-800' :
            'text-yellow-800'
          }`}>{message.text}</span>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧 - OCR状态 */}
        <div className="w-80 p-6 bg-white border-r border-gray-200 overflow-y-auto">
          <OCRUsageIndicator 
            usedCalls={ocrUsedCalls} 
            totalCalls={ocrTotalCalls}
            showDetails={true}
          />

          {/* 筛选控制 */}
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <FunnelIcon className="h-5 w-5 mr-2" />
              筛选条件
            </h3>

            {/* 学历筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">学历要求</label>
              <select
                value={filterEducation}
                onChange={(e) => setFilterEducation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">全部</option>
                <option value="博士">博士</option>
                <option value="硕士">硕士</option>
                <option value="本科">本科</option>
                <option value="专科">专科</option>
              </select>
            </div>

            {/* 分数筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最低分数: {filterMinScore}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={filterMinScore}
                onChange={(e) => setFilterMinScore(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* 状态筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">全部</option>
                <option value="completed">已完成</option>
                <option value="parsing">解析中</option>
                <option value="failed">失败</option>
              </select>
            </div>

            {/* 排序 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <ArrowsUpDownIcon className="h-4 w-4 mr-1" />
                排序方式
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              >
                <option value="totalScore">综合评分</option>
                <option value="uploadTime">上传时间</option>
              </select>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setSortOrder('desc')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                    sortOrder === 'desc'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  降序 ↓
                </button>
                <button
                  onClick={() => setSortOrder('asc')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                    sortOrder === 'asc'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  升序 ↑
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧 - 简历列表 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 搜索和操作栏 */}
          <div className="p-6 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              {/* 搜索框 */}
              <div className="flex-1 max-w-md relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索简历..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  共 <span className="font-bold text-gray-900">{filteredResumes.length}</span> 份简历
                </span>
                
                <button
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                  <span>导出</span>
                </button>
              </div>
            </div>
          </div>

          {/* 简历列表 */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredResumes.length === 0 ? (
              <div className="text-center py-12">
                <TableCellsIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">暂无简历数据</p>
                <p className="text-sm text-gray-400 mt-2">点击右上角"上传简历"按钮开始</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredResumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      {/* 左侧信息 */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {resume.basicInfo.name || '未识别'}
                          </h3>
                          
                          {/* 状态标签 */}
                          {resume.status === 'parsing' && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center">
                              <BeakerIcon className="h-3 w-3 mr-1 animate-spin" />
                              解析中 {resume.ocrProgress}%
                            </span>
                          )}
                          {resume.status === 'completed' && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center">
                              <CheckCircleIcon className="h-3 w-3 mr-1" />
                              已完成
                            </span>
                          )}
                          {resume.status === 'failed' && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center">
                              <XCircleIcon className="h-3 w-3 mr-1" />
                              失败
                            </span>
                          )}
                        </div>

                        {/* 基本信息 */}
                        <div className="grid grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-gray-500">文件名：</span>
                            <span className="text-gray-900 font-medium">{resume.fileName}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">学历：</span>
                            <span className="text-gray-900 font-medium">{resume.basicInfo.education || '未知'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">工作年限：</span>
                            <span className="text-gray-900 font-medium">{resume.totalWorkYears || 0} 年</span>
                          </div>
                          <div>
                            <span className="text-gray-500">上传时间：</span>
                            <span className="text-gray-900 font-medium">
                              {resume.uploadTime.toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* 评分 */}
                        {resume.status === 'completed' && (
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-500 mr-2">综合评分：</span>
                              <div className={`text-2xl font-bold ${
                                resume.totalScore >= 80 ? 'text-green-600' :
                                resume.totalScore >= 60 ? 'text-blue-600' :
                                'text-gray-600'
                              }`}>
                                {resume.totalScore}
                              </div>
                            </div>
                            
                            <div className="flex space-x-4 text-sm">
                              <div>
                                <span className="text-gray-500">学历：</span>
                                <span className="font-medium text-purple-600">{resume.educationScore}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">经验：</span>
                                <span className="font-medium text-blue-600">{resume.experienceScore}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">技能：</span>
                                <span className="font-medium text-orange-600">{resume.skillScore}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 技能标签 */}
                        {resume.skills.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {resume.skills.slice(0, 8).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                              >
                                {skill}
                              </span>
                            ))}
                            {resume.skills.length > 8 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                +{resume.skills.length - 8}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* 右侧操作 */}
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleToggleStar(resume.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="标记为重点关注"
                          >
                            {resume.tags.includes('重点关注') ? (
                              <StarIconSolid className="h-5 w-5 text-yellow-500" />
                            ) : (
                              <StarIcon className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                          
                          <button
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="查看详情"
                          >
                            <EyeIcon className="h-5 w-5 text-gray-600" />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(resume.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="删除"
                          >
                            <TrashIcon className="h-5 w-5 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 解析进度条 */}
                    {resume.status === 'parsing' && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-blue-600 h-2 transition-all duration-300"
                            style={{ width: `${resume.ocrProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 上传区域 Modal */}
      {showUploadArea && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">上传PDF简历</h2>
              <button
                onClick={() => setShowUploadArea(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            {/* 拖拽区域 */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <CloudArrowUpIcon className={`h-16 w-16 mx-auto mb-4 ${
                isDragging ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <p className="text-lg font-medium text-gray-700 mb-2">
                拖拽PDF文件到此处
              </p>
              <p className="text-sm text-gray-500 mb-4">
                或者点击下方按钮选择文件
              </p>
              
              <label className="inline-block">
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
                <span className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer inline-flex items-center space-x-2">
                  <CloudArrowUpIcon className="h-5 w-5" />
                  <span>选择PDF文件</span>
                </span>
              </label>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">注意事项：</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>仅支持PDF格式的简历文件</li>
                    <li>每次OCR识别会消耗1次调用额度</li>
                    <li>当前剩余额度：{aliyunOCR.getRemainingCalls()} 次</li>
                    <li>建议批量上传以提高效率</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeScreeningWithOCR;

