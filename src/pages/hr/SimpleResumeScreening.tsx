/**
 * 简历筛选模块 - 精简版
 * 
 * 功能：
 * - PDF简历上传
 * - 自动解析并生成表格
 * - 根据大学排名排序
 * - 985/211标识
 */

import React, { useState } from 'react';
import {
  CloudArrowUpIcon,
  XCircleIcon,
  ArrowsUpDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { aliyunOCR } from '../../services/aliyunOCR';
import { database } from '../../services/database';
import { 
  getUniversityRank, 
  is985University, 
  is211University
} from '../../services/universityRanking';

// ============= 类型定义 =============

interface ResumeData {
  id: string;
  序号: number;
  姓名: string;
  性别: string;
  年龄: number;
  学历: string; // 本科/硕士/博士
  院校名称: string;
  is985: boolean;
  is211: boolean;
  所学专业: string;
  个人优势: string;
  说明: string; // 本硕说明
  院校排名: number;
  // 原始数据
  本科院校?: string;
  本科专业?: string;
  硕士院校?: string;
  硕士专业?: string;
  博士院校?: string;
  博士专业?: string;
}

export const SimpleResumeScreening: React.FC = () => {
  // ============= 状态管理 =============
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [showUploadArea, setShowUploadArea] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [sortField, setSortField] = useState<'院校排名' | '学历' | '序号'>('院校排名');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [ocrUsedCalls, setOcrUsedCalls] = useState(0);
  const [ocrTotalCalls] = useState(500);

  // ============= 初始化 =============
  React.useEffect(() => {
    initializeDatabase();
    loadOCRUsage();
  }, []);

  const initializeDatabase = async () => {
    try {
      await database.initialize();
      setDbInitialized(true);
    } catch (error: any) {
      console.error('数据库初始化失败:', error);
      showMessage('error', '数据库初始化失败');
    }
  };

  const loadOCRUsage = () => {
    const used = aliyunOCR.getUsedCalls();
    setOcrUsedCalls(used);
  };

  // ============= 文件上传处理 =============

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const pdfFiles = files.filter(f => f.name.toLowerCase().endsWith('.pdf'));
    
    if (pdfFiles.length === 0) {
      showMessage('error', '只支持PDF格式的简历文件！');
      return;
    }

    if (pdfFiles.length !== files.length) {
      showMessage('warning', `已过滤${files.length - pdfFiles.length}个非PDF文件`);
    }

    const remainingCalls = aliyunOCR.getRemainingCalls();
    if (remainingCalls <= 0) {
      showMessage('error', 'OCR调用额度已用尽！');
      return;
    }

    if (remainingCalls < pdfFiles.length) {
      showMessage('warning', `OCR额度不足！剩余${remainingCalls}次，本次上传${pdfFiles.length}份`);
    }

    setUploadedFiles(prev => [...prev, ...pdfFiles]);
    showMessage('success', `已添加${pdfFiles.length}份PDF文件`);
  };

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
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // ============= 简历解析 =============

  const handleParseResumes = async () => {
    if (uploadedFiles.length === 0) {
      showMessage('warning', '请先上传简历文件');
      return;
    }

    setIsParsing(true);
    setShowUploadArea(false);
    const parsedResults: ResumeData[] = [];

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      
      try {
        showMessage('warning', `正在解析第${i + 1}/${uploadedFiles.length}份简历...`);

        // OCR识别
        const ocrText = await aliyunOCR.recognizePDF(file);
        
        // 更新OCR次数
        loadOCRUsage();
        database.recordOCRUsage(file.name, 1, true);

        // 解析简历信息
        const parsedData = parseResumeText(ocrText);
        
        parsedResults.push({
          id: `resume_${Date.now()}_${i}`,
          序号: i + 1,
          ...parsedData
        });

      } catch (error: any) {
        console.error(`解析失败 ${file.name}:`, error);
        database.recordOCRUsage(file.name, 1, false, error.message);
        showMessage('error', `${file.name} 解析失败`);
      }
    }

    setResumes(parsedResults);
    setIsParsing(false);
    setUploadedFiles([]);
    showMessage('success', `成功解析${parsedResults.length}份简历！`);
  };

  // 解析OCR文本
  const parseResumeText = (text: string): Omit<ResumeData, 'id' | '序号'> => {
    // 提取姓名
    const nameMatch = text.match(/姓\s*名[：:]\s*([^\s\n]+)|^([^\s\n]{2,4})$/m);
    const 姓名 = nameMatch ? (nameMatch[1] || nameMatch[2]) : '未识别';

    // 提取性别
    const genderMatch = text.match(/性\s*别[：:]\s*(男|女)/);
    const 性别 = genderMatch ? genderMatch[1] : '未知';

    // 提取年龄
    const ageMatch = text.match(/年\s*龄[：:]\s*(\d+)|(\d+)\s*岁/);
    const 年龄 = ageMatch ? parseInt(ageMatch[1] || ageMatch[2]) : 0;

    // 提取教育背景
    const educationInfo = extractEducation(text);

    // 提取专业
    const majorMatch = text.match(/专\s*业[：:]\s*([^\n，。]+)/);
    const 所学专业 = majorMatch ? majorMatch[1].trim() : educationInfo.专业 || '未知';

    // 提取个人优势
    const 个人优势 = extractAdvantages(text);

    // 生成说明
    const 说明 = generateDescription(educationInfo);

    // 获取大学排名
    const 院校排名 = getUniversityRank(educationInfo.院校);

    return {
      姓名,
      性别,
      年龄,
      学历: educationInfo.学历,
      院校名称: educationInfo.院校,
      is985: is985University(educationInfo.院校),
      is211: is211University(educationInfo.院校),
      所学专业,
      个人优势,
      说明,
      院校排名,
      本科院校: educationInfo.本科院校,
      本科专业: educationInfo.本科专业,
      硕士院校: educationInfo.硕士院校,
      硕士专业: educationInfo.硕士专业,
      博士院校: educationInfo.博士院校,
      博士专业: educationInfo.博士专业
    };
  };

  // 提取教育背景
  const extractEducation = (text: string) => {
    let 学历 = '未知';
    let 院校 = '未知';
    let 专业 = '';
    let 本科院校 = '';
    let 本科专业 = '';
    let 硕士院校 = '';
    let 硕士专业 = '';
    let 博士院校 = '';
    let 博士专业 = '';

    // 提取博士信息
    const doctorMatch = text.match(/博士.*?([^\s，。]+(?:大学|学院|高校))[^\n]{0,50}?专业[：:]?\s*([^\n，。]+)/);
    if (doctorMatch) {
      学历 = '博士';
      博士院校 = doctorMatch[1];
      博士专业 = doctorMatch[2].trim();
      院校 = 博士院校;
      专业 = 博士专业;
    }

    // 提取硕士信息
    const masterMatch = text.match(/硕士.*?([^\s，。]+(?:大学|学院|高校))[^\n]{0,50}?专业[：:]?\s*([^\n，。]+)/);
    if (masterMatch) {
      if (学历 !== '博士') {
        学历 = '硕士';
        院校 = masterMatch[1];
        专业 = masterMatch[2].trim();
      }
      硕士院校 = masterMatch[1];
      硕士专业 = masterMatch[2].trim();
    }

    // 提取本科信息
    const bachelorMatch = text.match(/本科.*?([^\s，。]+(?:大学|学院|高校))[^\n]{0,50}?专业[：:]?\s*([^\n，。]+)/);
    if (bachelorMatch) {
      if (学历 === '未知') {
        学历 = '本科';
        院校 = bachelorMatch[1];
        专业 = bachelorMatch[2].trim();
      }
      本科院校 = bachelorMatch[1];
      本科专业 = bachelorMatch[2].trim();
    }

    // 如果没有找到具体信息，尝试通用模式
    if (学历 === '未知') {
      const generalMatch = text.match(/(博士|硕士|本科|专科)/);
      if (generalMatch) {
        学历 = generalMatch[1];
      }

      const universityMatch = text.match(/([^\s，。]+(?:大学|学院|高校))/);
      if (universityMatch) {
        院校 = universityMatch[1];
      }
    }

    return {
      学历,
      院校,
      专业,
      本科院校,
      本科专业,
      硕士院校,
      硕士专业,
      博士院校,
      博士专业
    };
  };

  // 提取个人优势
  const extractAdvantages = (text: string): string => {
    const advantages: string[] = [];

    // 实习经验
    if (text.includes('实习') || text.includes('Intern')) {
      advantages.push('有实习经验');
    }

    // 工作经验
    const workYearsMatch = text.match(/(\d+)\s*年.*?(工作|经验)/);
    if (workYearsMatch) {
      advantages.push(`${workYearsMatch[1]}年工作经验`);
    }

    // 项目经验
    if (text.includes('项目') && text.includes('负责')) {
      advantages.push('有项目经验');
    }

    // 获奖情况
    if (text.match(/(奖学金|获奖|竞赛|比赛)/)) {
      advantages.push('曾获奖项');
    }

    // 特长技能
    const skills = ['Java', 'Python', 'JavaScript', 'React', 'Vue', 'Node', 'SQL', 'Docker'];
    const foundSkills = skills.filter(skill => text.includes(skill));
    if (foundSkills.length > 0) {
      advantages.push(`掌握${foundSkills.slice(0, 3).join('、')}`);
    }

    // 学生干部
    if (text.match(/(学生会|社团|主席|部长)/)) {
      advantages.push('有学生工作经历');
    }

    return advantages.length > 0 ? advantages.join('；') : '待补充';
  };

  // 生成说明
  const generateDescription = (educationInfo: any): string => {
    const parts: string[] = [];

    if (educationInfo.博士院校) {
      parts.push(`博士：${educationInfo.博士院校} - ${educationInfo.博士专业}`);
    }
    
    if (educationInfo.硕士院校) {
      parts.push(`硕士：${educationInfo.硕士院校} - ${educationInfo.硕士专业}`);
    }
    
    if (educationInfo.本科院校) {
      parts.push(`本科：${educationInfo.本科院校} - ${educationInfo.本科专业}`);
    }

    return parts.length > 0 ? parts.join('；') : `${educationInfo.学历}：${educationInfo.院校} - ${educationInfo.专业}`;
  };

  // ============= 排序功能 =============

  const getSortedResumes = () => {
    const sorted = [...resumes];
    
    sorted.sort((a, b) => {
      let comparison = 0;

      if (sortField === '院校排名') {
        comparison = a.院校排名 - b.院校排名;
      } else if (sortField === '学历') {
        const degreeOrder = { '博士': 3, '硕士': 2, '本科': 1, '专科': 0, '未知': -1 };
        comparison = (degreeOrder[b.学历 as keyof typeof degreeOrder] || 0) - 
                     (degreeOrder[a.学历 as keyof typeof degreeOrder] || 0);
      } else if (sortField === '序号') {
        comparison = a.序号 - b.序号;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  };

  const handleSort = (field: '院校排名' | '学历' | '序号') => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // ============= 工具函数 =============

  const showMessage = (type: 'success' | 'error' | 'warning', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
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

  const sortedResumes = getSortedResumes();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* 顶部标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">简历筛选系统</h1>
          <p className="text-gray-600">
            阿里云OCR识别 | 剩余额度：<span className="font-bold text-blue-600">{ocrTotalCalls - ocrUsedCalls}</span>/{ocrTotalCalls}次
          </p>
        </div>

        {/* 消息提示 */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
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

        {/* 上传区域 */}
        {showUploadArea && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">上传简历</h2>
            
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
                或点击下方按钮选择文件（支持批量上传）
              </p>
              
              <label className="inline-block">
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <span className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer inline-flex items-center space-x-2 transition-colors">
                  <CloudArrowUpIcon className="h-5 w-5" />
                  <span>选择PDF文件</span>
                </span>
              </label>
            </div>

            {/* 已上传文件列表 */}
            {uploadedFiles.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    已上传 {uploadedFiles.length} 份简历
                  </h3>
                  <button
                    onClick={() => setUploadedFiles([])}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    清空列表
                  </button>
                </div>
                
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3 flex-1">
                        <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                        <span className="text-sm text-gray-700 flex-1">{file.name}</span>
                        <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="ml-3 text-red-600 hover:text-red-700"
                      >
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleParseResumes}
                  disabled={isParsing || uploadedFiles.length === 0}
                  className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isParsing ? '解析中...' : '开始解析简历'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 解析结果表格 */}
        {resumes.length > 0 && !showUploadArea && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                解析结果 ({resumes.length} 份简历)
              </h2>
              <button
                onClick={() => {
                  setShowUploadArea(true);
                  setResumes([]);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                重新上传
              </button>
            </div>

            {/* 排序按钮 */}
            <div className="flex items-center space-x-4 mb-4 p-4 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">排序方式：</span>
              <button
                onClick={() => handleSort('院校排名')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  sortField === '院校排名'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <ArrowsUpDownIcon className="h-4 w-4" />
                <span>大学排名</span>
              </button>
              <button
                onClick={() => handleSort('学历')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  sortField === '学历'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <ArrowsUpDownIcon className="h-4 w-4" />
                <span>学历高低</span>
              </button>
              <button
                onClick={() => handleSort('序号')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  sortField === '序号'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <ArrowsUpDownIcon className="h-4 w-4" />
                <span>原始顺序</span>
              </button>
              <span className="text-sm text-gray-500">
                （{sortOrder === 'asc' ? '升序' : '降序'}）
              </span>
            </div>

            {/* 表格 */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">序号</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">姓名</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">性别</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">年龄</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">学历</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">院校名称</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">985</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">211</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">所学专业</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">个人优势</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">说明</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedResumes.map((resume) => (
                    <tr key={resume.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900">{resume.序号}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{resume.姓名}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{resume.性别}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{resume.年龄 || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          resume.学历 === '博士' ? 'bg-purple-100 text-purple-700' :
                          resume.学历 === '硕士' ? 'bg-blue-100 text-blue-700' :
                          resume.学历 === '本科' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {resume.学历}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{resume.院校名称}</td>
                      <td className="px-4 py-3 text-center">
                        {resume.is985 ? (
                          <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">是</span>
                        ) : (
                          <span className="text-gray-400 text-xs">否</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {resume.is211 ? (
                          <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-bold">是</span>
                        ) : (
                          <span className="text-gray-400 text-xs">否</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{resume.所学专业}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate" title={resume.个人优势}>
                        {resume.个人优势}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-md" title={resume.说明}>
                        {resume.说明}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 统计信息 */}
            <div className="mt-6 grid grid-cols-4 gap-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {sortedResumes.filter(r => r.学历 === '博士').length}
                </div>
                <div className="text-sm text-gray-600">博士学历</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {sortedResumes.filter(r => r.学历 === '硕士').length}
                </div>
                <div className="text-sm text-gray-600">硕士学历</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {sortedResumes.filter(r => r.is985).length}
                </div>
                <div className="text-sm text-gray-600">985院校</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {sortedResumes.filter(r => r.is211).length}
                </div>
                <div className="text-sm text-gray-600">211院校</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleResumeScreening;

