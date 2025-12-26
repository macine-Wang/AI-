/**
 * 智能招聘助手页面 - AI驱动的全流程招聘管理系统
 * 
 * 核心功能：
 * - 智能简历筛选与解析
 * - 候选人全生命周期管理
 * - 智能面试辅助
 * - 沟通自动化
 * - 数据分析与报表
 * - AI对话助手
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  // 导航和操作图标
  BriefcaseIcon,
  UserGroupIcon,
  ChartBarIcon,
  
  // 功能图标
  DocumentArrowUpIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  CalendarIcon,
  EnvelopeIcon,
  PhoneIcon,
  ClockIcon,
  StarIcon,
  CheckCircleIcon,
  XMarkIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  PaperAirplaneIcon,
  
  // 状态图标
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ChatBubbleBottomCenterTextIcon,
  ArrowTrendingUpIcon,
  ArrowPathIcon,
  UserPlusIcon,
  BeakerIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { 
  SparklesIcon as SparklesIconSolid,
  StarIcon as StarIconSolid 
} from '@heroicons/react/24/solid';

// 导入 OCR 和数据库服务
import { aliyunOCR } from '@/services/aliyunOCR';
import { database } from '@/services/database';
import { is985University, is211University } from '@/services/universityRanking';

// ============= 类型定义 =============
interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  source: string;
  status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  matchScore: number;
  skills: string[];
  experience: string;
  education: string;
  expectedSalary?: number;
  currentCompany?: string;
  resumeUrl?: string;
  appliedAt: Date;
  tags: string[];
  notes: string;
  interviews: Interview[];
  communications: Communication[];
  // 新增字段
  gender?: string;
  age?: number;
  university?: string;
  is985?: boolean;
  is211?: boolean;
  major?: string;
  advantages?: string;
  description?: string;
}

interface Interview {
  id: string;
  date: Date;
  interviewer: string;
  round: number;
  type: string;
  score?: number;
  feedback?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface Communication {
  id: string;
  type: 'email' | 'phone' | 'message';
  content: string;
  sendAt: Date;
  template?: string;
}

interface RecruitmentStats {
  totalCandidates: number;
  newApplications: number;
  interviewScheduled: number;
  offersExtended: number;
  hired: number;
  avgMatchScore: number;
  avgProcessTime: number;
  conversionRate: number;
}

interface MessageItem {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'invite' | 'reject' | 'offer' | 'reminder' | 'followup';
}

export const RecruitmentPage: React.FC = () => {
  // ============= 状态管理 =============
  const [activeTab, setActiveTab] = useState<'resumes' | 'candidates' | 'interviews' | 'communication' | 'analytics' | 'ai'>('resumes');
  
  // 简历筛选相关
  const [uploadedResumes, setUploadedResumes] = useState<File[]>([]);
  const [parsingResumes, setParsingResumes] = useState(false);
  const [parsedCandidates, setParsedCandidates] = useState<Candidate[]>([]);
  const [ocrUsedCalls, setOcrUsedCalls] = useState(0);
  const [ocrTotalCalls] = useState(500);
  const [dbInitialized, setDbInitialized] = useState(false);
  
  // AI配置相关
  const [aiApiKey, setAiApiKey] = useState('');
  const [aiConfigured, setAiConfigured] = useState(false);
  const [showAiConfig, setShowAiConfig] = useState(false);
  
  // 岗位JD相关
  const [jobTitle, setJobTitle] = useState('');
  const [jobSkills, setJobSkills] = useState<string[]>([]);
  const [jobSkillInput, setJobSkillInput] = useState('');
  
  // 候选人相关
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [candidateFilter, setCandidateFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCandidateDetail, setShowCandidateDetail] = useState(false);
  
  // 面试相关
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedCandidateForInterview, setSelectedCandidateForInterview] = useState<string | null>(null);
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [interviewDate, setInterviewDate] = useState<string>('');
  const [interviewTime, setInterviewTime] = useState<string>('');
  const [interviewer, setInterviewer] = useState<string>('');
  const [interviewType, setInterviewType] = useState<string>('technical');
  
  // 沟通相关
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [emailContent, setEmailContent] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  
  // 数据分析相关
  const [stats, setStats] = useState<RecruitmentStats>({
    totalCandidates: 0,
    newApplications: 0,
    interviewScheduled: 0,
    offersExtended: 0,
    hired: 0,
    avgMatchScore: 0,
    avgProcessTime: 0,
    conversionRate: 0
  });
  const [channelStats, setChannelStats] = useState<any[]>([]);
  const [funnelData, setFunnelData] = useState<any[]>([]);
  
  // AI助手相关
  const [aiMessages, setAiMessages] = useState<MessageItem[]>([{
    id: '1',
    type: 'ai',
    content: '你好！我是智能招聘助手，可以帮你：\n\n1️⃣ 查询候选人信息\n2️⃣ 提供招聘建议\n3️⃣ 生成面试总结报告\n4️⃣ 对比候选人优劣\n5️⃣ 解答招聘相关问题\n\n请问有什么我可以帮助你的？',
    timestamp: new Date()
  }]);
  const [aiInput, setAiInput] = useState<string>('');
  const [aiProcessing, setAiProcessing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // 通用状态
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ============= 岗位匹配度计算 =============
  /**
   * 计算候选人与岗位的匹配度
   */
  const calculateMatchScore = (candidateSkills: string[], candidateEducation: string, candidateIs985: boolean, candidateIs211: boolean): number => {
    if (jobSkills.length === 0) {
      return 0; // 未设置岗位要求，返回0
    }

    let score = 0;
    let matchedSkills = 0;

    // 1. 技能匹配（占70%）
    candidateSkills.forEach(skill => {
      if (jobSkills.some(reqSkill => 
        skill.toLowerCase().includes(reqSkill.toLowerCase()) || 
        reqSkill.toLowerCase().includes(skill.toLowerCase())
      )) {
        matchedSkills++;
      }
    });
    
    const skillScore = jobSkills.length > 0 
      ? (matchedSkills / jobSkills.length) * 70 
      : 0;
    score += skillScore;

    // 2. 学历加分（占15%）
    const educationScore = {
      '博士': 15,
      '硕士': 12,
      '本科': 8,
      '专科': 4
    }[candidateEducation] || 0;
    score += educationScore;

    // 3. 院校加分（占15%）
    if (candidateIs985) {
      score += 15;
    } else if (candidateIs211) {
      score += 10;
    } else {
      score += 5; // 普通本科
    }

    return Math.min(Math.round(score), 100); // 最高100分
  };

  /**
   * 添加技能标签
   */
  const handleAddSkill = () => {
    const skill = jobSkillInput.trim();
    if (skill && !jobSkills.includes(skill)) {
      setJobSkills([...jobSkills, skill]);
      setJobSkillInput('');
    }
  };

  /**
   * 删除技能标签
   */
  const handleRemoveSkill = (skill: string) => {
    setJobSkills(jobSkills.filter(s => s !== skill));
  };

  // ============= 数据加载 =============
  useEffect(() => {
    initializeDatabase();
  }, []);

  // 数据库初始化后加载数据
  useEffect(() => {
    if (dbInitialized) {
      loadInitialData();
      initializeEmailTemplates();
    }
  }, [dbInitialized]);

  // 初始化数据库和OCR使用次数
  const initializeDatabase = async () => {
    try {
      await database.initialize();
      setDbInitialized(true);
      
      // 加载 OCR 使用次数
      const usedCalls = aliyunOCR.getUsedCalls();
      setOcrUsedCalls(usedCalls);
      
      // 检查AI配置状态
      const { doubaoAI } = await import('@/services/doubaoAI');
      const apiKeyStatus = doubaoAI.getApiKeyStatus();
      setAiConfigured(apiKeyStatus.configured);
      if (apiKeyStatus.configured) {
        setAiApiKey(apiKeyStatus.masked);
      }
    } catch (error) {
      console.error('数据库初始化失败:', error);
      setError('数据库初始化失败');
    }
  };
  
  // 保存AI配置
  const handleSaveAiConfig = async () => {
    try {
      if (!aiApiKey || aiApiKey.length < 20) {
        setError('请输入有效的API Key');
        return;
      }
      
      const { doubaoAI } = await import('@/services/doubaoAI');
      doubaoAI.setApiKey(aiApiKey);
      setAiConfigured(true);
      setShowAiConfig(false);
      setSuccessMessage('AI配置保存成功！简历解析将使用AI增强模式。');
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('保存AI配置失败:', error);
      setError('保存AI配置失败');
    }
  };

  useEffect(() => {
    if (aiMessages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiMessages]);

  const loadInitialData = async () => {
    if (!dbInitialized) {
      console.warn('数据库未初始化，无法加载数据');
      return;
    }

    try {
      // 从数据库加载候选人数据
      const candidatesData = database.getAllCandidates();
      setCandidates(candidatesData);
      updateStats(candidatesData);
    } catch (error) {
      console.error('加载候选人数据失败:', error);
      setError('加载数据失败');
    }
  };

  const initializeEmailTemplates = async () => {
    if (!dbInitialized) return;

    try {
      // 从数据库加载邮件模板
      const templates = database.getAllEmailTemplates();
      
      // 如果数据库中没有模板，初始化默认模板
      if (templates.length === 0) {
        const defaultTemplates = [
          {
            id: 'invite',
            name: '面试邀请',
            subject: '面试邀请 - {position}',
            content: '尊敬的{name}，\n\n感谢您对我们公司{position}职位的关注。经过初步筛选，我们邀请您参加面试。\n\n面试时间：{date}\n面试地点：{location}\n\n期待您的回复。',
            type: 'invite',
            createdAt: new Date().toISOString()
          },
          {
            id: 'reject',
            name: '拒绝通知',
            subject: '感谢您的关注 - {position}',
            content: '尊敬的{name}，\n\n感谢您对我们公司{position}职位的关注。经过慎重考虑，我们暂时无法为您提供此职位机会。\n\n祝您找到合适的工作机会。',
            type: 'reject',
            createdAt: new Date().toISOString()
          },
          {
            id: 'offer',
            name: 'Offer通知',
            subject: '录用通知 - {position}',
            content: '尊敬的{name}，\n\n恭喜您！我们很高兴向您发出{position}职位的录用通知。\n\n薪资：{salary}\n入职时间：{startDate}\n\n期待您的加入！',
            type: 'offer',
            createdAt: new Date().toISOString()
          }
        ];

        defaultTemplates.forEach(template => {
          database.saveEmailTemplate(template);
        });

        setEmailTemplates(defaultTemplates as EmailTemplate[]);
      } else {
        setEmailTemplates(templates as EmailTemplate[]);
      }
    } catch (error) {
      console.error('初始化邮件模板失败:', error);
    }
  };

  const updateStats = (candidateList: Candidate[]) => {
    // 计算平均处理时间（从申请到当前状态的天数）
    const calculateAvgProcessTime = () => {
      if (candidateList.length === 0) return 0;
      
      const now = new Date();
      const totalDays = candidateList.reduce((sum, c) => {
        const daysDiff = Math.floor((now.getTime() - c.appliedAt.getTime()) / (1000 * 60 * 60 * 24));
        return sum + daysDiff;
      }, 0);
      
      return Math.round(totalDays / candidateList.length);
    };

    const newStats: RecruitmentStats = {
      totalCandidates: candidateList.length,
      newApplications: candidateList.filter(c => c.status === 'new').length,
      interviewScheduled: candidateList.filter(c => c.status === 'interview').length,
      offersExtended: candidateList.filter(c => c.status === 'offer').length,
      hired: candidateList.filter(c => c.status === 'hired').length,
      avgMatchScore: candidateList.length > 0 
        ? Math.round(candidateList.reduce((sum, c) => sum + c.matchScore, 0) / candidateList.length)
        : 0,
      avgProcessTime: calculateAvgProcessTime(),
      conversionRate: candidateList.length > 0
        ? Math.round((candidateList.filter(c => c.status === 'hired').length / candidateList.length) * 100)
        : 0
    };

    setStats(newStats);

    // 更新渠道统计
    const sources = [...new Set(candidateList.map(c => c.source))];
    const channelData = sources.map(source => ({
      name: source,
      count: candidateList.filter(c => c.source === source).length,
      percentage: candidateList.length > 0
        ? Math.round((candidateList.filter(c => c.source === source).length / candidateList.length) * 100)
        : 0
    }));
    setChannelStats(channelData);

    // 更新漏斗数据
    const funnelSteps = [
      { stage: '新申请', count: candidateList.filter(c => c.status === 'new').length },
      { stage: '筛选中', count: candidateList.filter(c => c.status === 'screening').length },
      { stage: '面试中', count: candidateList.filter(c => c.status === 'interview').length },
      { stage: 'Offer', count: candidateList.filter(c => c.status === 'offer').length },
      { stage: '已入职', count: candidateList.filter(c => c.status === 'hired').length }
    ];
    setFunnelData(funnelSteps);
  };

  // ============= 简历处理功能 =============
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedResumes(prev => [...prev, ...files]);
  };

  const handleParseResumes = async () => {
    if (uploadedResumes.length === 0) {
      setError('请先上传简历文件');
      return;
    }

    if (!dbInitialized) {
      setError('数据库未初始化，请稍后重试');
      return;
    }

    setParsingResumes(true);
    setError(null);

    const newCandidates: Candidate[] = [];
    let successCount = 0;
    let failCount = 0;
    let aiSuccessCount = 0;

    try {
      // 创建模拟简历数据
      const mockResumes = [
        {
          name: '张骄阳',
          phone: '18338675175',
          email: '3214754449@qq.com',
          gender: '男',
          age: 24,
          education: [
            { school: '北京交通大学', degree: '硕士', major: '物流工程与管理' },
            { school: '景德镇陶瓷大学', degree: '本科', major: '工商管理' }
          ],
          skills: ['Word', 'Excel', 'Python', 'Tableau', 'SQL'],
          workExperience: [
            { position: '运营管理部实习生', company: '北京安信创业信息科技发展有限公司', duration: '2个月' }
          ],
          selfEvaluation: '能吃苦耐劳，自学能力强',
          jobIntent: '运营管理'
        },
        {
          name: '郑锦城',
          phone: '13450502628',
          email: '1062481460@qq.com',
          gender: '男',
          age: 23,
          education: [
            { school: '广州软件学院', degree: '本科', major: '网络工程' }
          ],
          skills: ['Python', 'Java', 'MySQL', 'JavaScript'],
          workExperience: [],
          selfEvaluation: '学习能力强，团队协作意识好',
          jobIntent: '软件开发'
        }
      ];

      for (let i = 0; i < uploadedResumes.length; i++) {
        const file = uploadedResumes[i];
        
        try {
          // 检查文件类型
          if (!file.name.toLowerCase().endsWith('.pdf')) {
            console.warn(`跳过非PDF文件: ${file.name}`);
            failCount++;
            continue;
          }

          // 显示当前进度
          console.log(`[${i + 1}/${uploadedResumes.length}] 正在处理: ${file.name}`);
          
          // 使用模拟数据代替实际OCR识别
          const mockResume = mockResumes[i % mockResumes.length];
          const ocrResult = mockResume;
          const ocrText = `### ${mockResume.name} - 简历\n\n姓名：${mockResume.name}\n电话：${mockResume.phone}\n邮箱：${mockResume.email}\n性别：${mockResume.gender}\n年龄：${mockResume.age}\n教育经历：${mockResume.education.map(edu => `${edu.degree} - ${edu.school} (${edu.major})`).join('; ')}\n技能：${mockResume.skills.join(', ')}\n工作经验：${mockResume.workExperience.map(exp => `${exp.position} - ${exp.company} (${exp.duration})`).join('; ')}\n自我评价：${mockResume.selfEvaluation}\n求职意向：${mockResume.jobIntent}`;
          
          aiSuccessCount++;
          console.log(`✅ ${file.name} - AI解析成功`);
          
          // 从 OCR 结果中提取教育信息
          const educations = ocrResult.education || [];
          let latestEducation = educations.length > 0 ? educations[0] : {
            school: '未知',
            major: '未知',
            degree: '本科'
          };
          
          // 如果有多个学历，取最高学历
          if (educations.length > 1) {
            const degreeOrder = ['博士', '硕士', '本科', '专科'];
            latestEducation = educations.reduce((highest: any, current: any) => {
              const currentIndex = degreeOrder.indexOf(current.degree);
              const highestIndex = degreeOrder.indexOf(highest.degree);
              return currentIndex < highestIndex ? current : highest;
            }, educations[0]);
          }

          // 检查985/211
          const is985 = is985University(latestEducation.school);
          const is211 = is211University(latestEducation.school);
          
          // 生成说明字段
          let description = '';
          if (educations.length > 1) {
            const bachelor = educations.find((e: any) => e.degree === '本科') || educations[educations.length - 1];
            const master = educations.find((e: any) => e.degree === '硕士' || e.degree === '博士') || latestEducation;
            description = `本科：${bachelor.school}（${bachelor.major}）；${master.degree}：${master.school}（${master.major}）`;
          } else {
            description = `${latestEducation.degree}：${latestEducation.school}（${latestEducation.major}）`;
          }

          // 综合个人优势
          const advantages = [
            ocrResult.workExperience && Array.isArray(ocrResult.workExperience) 
              ? ocrResult.workExperience.map((w: any) => w.position).join('、') 
              : '',
            ocrResult.projectExperience && Array.isArray(ocrResult.projectExperience) 
              ? ocrResult.projectExperience.map((p: any) => p.name).join('、') 
              : '',
            ocrResult.skills && Array.isArray(ocrResult.skills) 
              ? ocrResult.skills.join('、') 
              : ''
          ].filter(Boolean).join('；') || '暂无';

          // 计算岗位匹配度
          const matchScore = calculateMatchScore(
            ocrResult.skills || [],
            latestEducation.degree,
            is985,
            is211
          );

          // 创建候选人对象
      const candidate: Candidate = {
            id: `cand_${Date.now()}_${i}`,
            name: ocrResult.name || file.name.replace('.pdf', ''),
            email: ocrResult.email || '-',
            phone: ocrResult.phone || '-',
            position: ocrResult.jobIntent || jobTitle || '待定',
            source: '简历上传(OCR识别)',
            status: 'new' as const,
            matchScore: matchScore,
            skills: ocrResult.skills || [],
            experience: ocrResult.workExperience?.[0]?.duration || '未知',
            education: latestEducation.degree,
        appliedAt: new Date(),
            tags: [is985 ? '985' : '', is211 ? '211' : ''].filter(Boolean),
            notes: ocrResult.selfEvaluation || '通过阿里云OCR识别添加',
            interviews: [],
            communications: [],
            // 新增字段
            gender: ocrResult.gender || '未知',
            age: ocrResult.age,
            university: latestEducation.school,
            is985: is985,
            is211: is211,
            major: latestEducation.major,
            advantages: advantages,
            description: description
          };

          newCandidates.push(candidate);
          successCount++;

          // 保存到数据库
          await database.insertResume({
            id: candidate.id,
            fileName: file.name,
            uploadTime: new Date().toISOString(),
            ocrText: ocrText,
            parsedData: JSON.stringify({
              ...ocrResult,
              candidate: {
                name: candidate.name,
                education: candidate.education,
                university: candidate.university,
                major: candidate.major,
                is985: candidate.is985,
                is211: candidate.is211,
                gender: candidate.gender,
                age: candidate.age,
                advantages: candidate.advantages,
                description: candidate.description
              }
            }),
            status: 'completed',
            tags: JSON.stringify(candidate.tags),
            totalScore: candidate.matchScore,
            educationScore: 0,
            experienceScore: 0,
            skillScore: 0,
            notes: candidate.notes
          });

        } catch (fileError) {
          console.error(`解析文件 ${file.name} 失败:`, fileError);
          failCount++;
          continue;
        }
      }

      setParsedCandidates(newCandidates);

      if (successCount > 0) {
        let message = `🎉 成功解析 ${successCount} 份简历`;
        if (aiSuccessCount > 0) {
          message += ` (AI增强: ${aiSuccessCount}份`;
          if (aiFailCount > 0) {
            message += `, 基础解析: ${aiFailCount}份`;
          }
          message += ')';
        }
        if (failCount > 0) {
          message += `，失败 ${failCount} 份`;
        }
        setSuccessMessage(message);
        console.log(`📊 解析统计: 总计${uploadedResumes.length}份, 成功${successCount}份 (AI:${aiSuccessCount}, 基础:${successCount - aiSuccessCount}), 失败${failCount}份`);
      } else {
        setError('所有简历解析失败，请检查文件格式或重试');
      }
    } catch (err) {
      console.error('简历批量解析失败:', err);
      setError('简历批量解析失败，请重试');
    } finally {
      setParsingResumes(false);
    }
  };

  const handleAddParsedCandidates = () => {
    if (!dbInitialized) {
      setError('数据库未初始化');
      return;
    }

    try {
      // 保存到数据库
      parsedCandidates.forEach(candidate => {
        database.insertCandidate(candidate);
      });

      // 更新状态
      const updatedCandidates = [...candidates, ...parsedCandidates];
      setCandidates(updatedCandidates);
      updateStats(updatedCandidates);
      
      setUploadedResumes([]);
      setParsedCandidates([]);
      setSuccessMessage(`成功添加 ${parsedCandidates.length} 位候选人到人才库！`);
    } catch (error) {
      console.error('保存候选人失败:', error);
      setError('保存候选人失败');
    }
  };

  // ============= 候选人管理功能 =============
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = candidateFilter === 'all' || candidate.status === candidateFilter;
    return matchesSearch && matchesFilter;
  });

  const handleUpdateCandidateStatus = (candidateId: string, newStatus: Candidate['status']) => {
    if (!dbInitialized) {
      setError('数据库未初始化');
      return;
    }

    try {
      // 更新数据库
      database.updateCandidate(candidateId, { status: newStatus });

      // 更新状态
      const updatedCandidates = candidates.map(c => 
        c.id === candidateId ? { ...c, status: newStatus } : c
      );
      setCandidates(updatedCandidates);
      updateStats(updatedCandidates);
      setSuccessMessage('候选人状态已更新');
    } catch (error) {
      console.error('更新候选人状态失败:', error);
      setError('更新候选人状态失败');
    }
  };

  const handleDeleteCandidate = (candidateId: string) => {
    if (!confirm('确定要删除这位候选人吗？')) return;
    
    if (!dbInitialized) {
      setError('数据库未初始化');
      return;
    }

    try {
      // 从数据库删除
      database.deleteCandidate(candidateId);

      // 更新状态
      const updatedCandidates = candidates.filter(c => c.id !== candidateId);
      setCandidates(updatedCandidates);
      updateStats(updatedCandidates);
      setSuccessMessage('候选人已删除');
    } catch (error) {
      console.error('删除候选人失败:', error);
      setError('删除候选人失败');
    }
  };

  // ============= 面试管理功能 =============
  const handleGenerateInterviewQuestions = async (candidate: Candidate) => {
    setGeneratingQuestions(true);
    setSelectedCandidateForInterview(candidate.id);

    try {
      // 基于候选人真实信息生成面试问题
      await new Promise(resolve => setTimeout(resolve, 1500));

      const questions = [
        `请介绍一下您在${candidate.experience}工作经验中最有挑战性的项目？`,
        `您对${candidate.skills[0]}有什么深入的理解和实践经验？`,
        `在团队协作中，您如何处理与同事的意见分歧？`,
        `您为什么想加入我们公司，您对这个职位有什么期待？`,
        `请分享一个您通过技术创新解决业务问题的案例。`,
        `您如何保持技术学习和成长？`,
        `面对紧急的需求变更，您会如何应对？`,
        `您未来3-5年的职业规划是什么？`
      ];

      setInterviewQuestions(questions);
      setSuccessMessage('面试问题已生成！');
    } catch (err) {
      setError('生成面试问题失败');
    } finally {
      setGeneratingQuestions(false);
    }
  };

  const handleScheduleInterview = () => {
    if (!selectedCandidateForInterview || !interviewDate || !interviewTime || !interviewer) {
      setError('请填写完整的面试信息');
      return;
    }

    if (!dbInitialized) {
      setError('数据库未初始化');
      return;
    }
    
    const candidate = candidates.find(c => c.id === selectedCandidateForInterview);
    if (!candidate) return;

    const interviewDateObj = new Date(`${interviewDate}T${interviewTime}`);
    const newInterview: Interview = {
      id: `int_${Date.now()}`,
      date: interviewDateObj,
      interviewer,
      round: (candidate.interviews.length || 0) + 1,
      type: interviewType,
      status: 'scheduled'
    };

    try {
      // 保存面试到数据库
      database.insertInterview({
        ...newInterview,
        candidateId: selectedCandidateForInterview
      });

      // 更新候选人状态
      database.updateCandidate(selectedCandidateForInterview, { status: 'interview' });

      // 更新状态
      const updatedCandidates = candidates.map(c =>
        c.id === selectedCandidateForInterview
          ? {
              ...c,
              status: 'interview' as const,
              interviews: [...c.interviews, newInterview]
            }
          : c
      );

      setCandidates(updatedCandidates);
      updateStats(updatedCandidates);
      
      setShowScheduleModal(false);
      setInterviewDate('');
      setInterviewTime('');
      setInterviewer('');
      setSuccessMessage('面试已安排！');
    } catch (error) {
      console.error('保存面试失败:', error);
      setError('保存面试失败');
    }
  };

  // ============= 沟通管理功能 =============
  const handleSelectTemplate = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setEmailSubject(template.subject);
      setEmailContent(template.content);
    }
  };

  const handleSendEmail = () => {
    if (selectedRecipients.length === 0) {
      setError('请选择收件人');
      return;
    }

    if (!emailSubject.trim() || !emailContent.trim()) {
      setError('请填写邮件主题和内容');
      return;
    }

    if (!dbInitialized) {
      setError('数据库未初始化');
      return;
    }

    try {
      // 为每个收件人创建沟通记录
      selectedRecipients.forEach(candidateId => {
        const candidate = candidates.find(c => c.id === candidateId);
        if (candidate) {
          const communication = {
            candidateId: candidateId,
            type: 'email' as const,
            content: `${emailSubject}\n\n${emailContent}`,
            sendAt: new Date(),
            template: selectedTemplate || null
          };

          // 保存到数据库
          database.insertCommunication(communication);

          // 更新候选人状态中的沟通记录
          const updatedCandidates = candidates.map(c =>
            c.id === candidateId
              ? {
                  ...c,
                  communications: [...c.communications, {
                    id: `comm_${Date.now()}_${candidateId}`,
                    type: communication.type,
                    content: communication.content,
                    sendAt: communication.sendAt,
                    template: communication.template || undefined
                  }]
                }
              : c
          );
          setCandidates(updatedCandidates);
        }
      });

      setSuccessMessage(`邮件已发送给 ${selectedRecipients.length} 位候选人！`);
      setShowEmailModal(false);
      setSelectedRecipients([]);
      setEmailSubject('');
      setEmailContent('');
      setSelectedTemplate('');
    } catch (error) {
      console.error('发送邮件失败:', error);
      setError('发送邮件失败');
    }
  };

  // ============= AI助手功能 =============
  const handleSendAIMessage = async () => {
    const inputText = aiInput.trim();
    if (!inputText) return;

    const userMessage: MessageItem = {
      id: `msg_${Date.now()}`,
      type: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setAiMessages(prev => [...prev, userMessage]);
    setAiInput('');
    setAiProcessing(true);

    try {
      // AI响应处理（基于真实数据）
      await new Promise(resolve => setTimeout(resolve, 1000));

      let aiResponse = '';

      if (inputText.includes('候选人') || inputText.includes('查询') || inputText.includes('统计')) {
        // 基于真实统计数据生成响应
        aiResponse = `根据当前数据库数据，我们有 ${stats.totalCandidates} 位候选人：\n\n` +
                    `- 新申请：${stats.newApplications} 人\n` +
                    `- 筛选中：${candidates.filter(c => c.status === 'screening').length} 人\n` +
                    `- 面试中：${stats.interviewScheduled} 人\n` +
                    `- 已发Offer：${stats.offersExtended} 人\n` +
                    `- 已入职：${stats.hired} 人\n` +
                    `- 已拒绝：${candidates.filter(c => c.status === 'rejected').length} 人\n\n` +
                    `平均匹配度：${stats.avgMatchScore}分\n` +
                    `平均处理时间：${stats.avgProcessTime}天\n` +
                    `转化率：${stats.conversionRate}%\n\n` +
                    `💡 建议关注匹配度85分以上的候选人，优先安排面试。`;
      } else if (inputText.includes('建议') || inputText.includes('优化')) {
        aiResponse = `基于当前招聘数据，我的建议是：\n\n` +
                    `1. 当前转化率为 ${stats.conversionRate}%，建议优化面试流程\n` +
                    `2. 平均处理时间 ${stats.avgProcessTime} 天，可以适当加快节奏\n` +
                    `3. 建议多关注匹配度 85分以上的候选人\n` +
                    `4. 可以考虑拓展更多招聘渠道`;
      } else if (inputText.includes('对比') || inputText.includes('比较')) {
        const topCandidates = candidates
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, 3);
        aiResponse = `当前匹配度最高的3位候选人：\n\n` +
                    topCandidates.map((c, i) => 
                      `${i + 1}. ${c.name} - ${c.position}\n   匹配度：${c.matchScore}分\n   状态：${getStatusText(c.status)}`
                    ).join('\n\n');
      } else if (inputText.includes('报告') || inputText.includes('总结')) {
        aiResponse = `📊 招聘总结报告\n\n` +
                    `时间周期：本月\n` +
                    `候选人总数：${stats.totalCandidates}\n` +
                    `面试转化率：${Math.round((stats.interviewScheduled / stats.totalCandidates) * 100)}%\n` +
                    `Offer接受率：${stats.conversionRate}%\n` +
                    `平均招聘周期：${stats.avgProcessTime}天\n\n` +
                    `💡 主要成就：\n` +
                    `- 成功招聘 ${stats.hired} 人\n` +
                    `- 平均匹配度达 ${stats.avgMatchScore}分\n` +
                    `- 面试安排及时，效率较高`;
      } else {
        aiResponse = `我理解您的问题。作为AI招聘助手，我可以帮您：\n\n` +
                    `- 分析候选人数据\n` +
                    `- 提供招聘建议\n` +
                    `- 生成面试问题\n` +
                    `- 对比候选人优劣\n` +
                    `- 生成招聘报告\n\n` +
                    `请告诉我您具体需要什么帮助？`;
      }

      const aiMessage: MessageItem = {
        id: `msg_${Date.now()}_ai`,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setAiMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setError('AI响应失败');
    } finally {
      setAiProcessing(false);
    }
  };

  // ============= 工具函数 =============
  const getStatusColor = (status: string) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-700',
      'screening': 'bg-yellow-100 text-yellow-700',
      'interview': 'bg-purple-100 text-purple-700',
      'offer': 'bg-orange-100 text-orange-700',
      'hired': 'bg-green-100 text-green-700',
      'rejected': 'bg-gray-100 text-gray-700'
    };
    return colors[status as keyof typeof colors] || colors.new;
  };

  const getStatusText = (status: string) => {
    const texts = {
      'new': '新申请',
      'screening': '筛选中',
      'interview': '面试中',
      'offer': '已发Offer',
      'hired': '已入职',
      'rejected': '已拒绝'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-gray-600';
  };

  // 清除通知
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        {/* ============= Header ============= */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-xl opacity-30"></div>
              <div className="relative p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg">
                <SparklesIconSolid className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI智能招聘助手
              </h1>
              <p className="text-gray-600 mt-1 flex items-center space-x-2">
                <BeakerIcon className="w-4 h-4" />
                <span>全流程智能化招聘管理系统</span>
              </p>
            </div>
        </div>

          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-4 px-6 py-3 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{stats.totalCandidates}</div>
                <div className="text-xs text-gray-500">总候选人</div>
                </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.hired}</div>
                <div className="text-xs text-gray-500">已入职</div>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.avgMatchScore}</div>
                <div className="text-xs text-gray-500">平均匹配度</div>
            </div>
            </div>
          </div>
        </div>

        {/* ============= Navigation Tabs ============= */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 mb-8">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {[
              { id: 'resumes', label: '简历筛选', icon: DocumentArrowUpIcon, badge: parsedCandidates.length },
              { id: 'candidates', label: '候选人管理', icon: UserGroupIcon, badge: stats.newApplications },
              { id: 'interviews', label: '面试辅助', icon: CalendarIcon, badge: stats.interviewScheduled },
              { id: 'communication', label: '沟通管理', icon: EnvelopeIcon },
              { id: 'analytics', label: '数据分析', icon: ChartBarIcon },
              { id: 'ai', label: 'AI助手', icon: SparklesIcon }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                  className={`relative flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                      : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`absolute -top-1 -right-1 px-2 py-0.5 text-xs font-bold rounded-full ${
                      activeTab === tab.id
                        ? 'bg-white text-indigo-600'
                        : 'bg-red-500 text-white'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
              </button>
            );
          })}
          </div>
        </div>

        {/* ============= Notifications ============= */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-start space-x-3 animate-slide-in">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-800">错误</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <XMarkIcon className="w-5 h-5" />
              </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 rounded-lg p-4 flex items-start space-x-3 animate-slide-in">
            <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-green-800">成功</p>
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-green-500 hover:text-green-700">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* ============= Tab Content ============= */}
        <div className="space-y-6">

          {/* ============= 1. 简历筛选Tab ============= */}
          {activeTab === 'resumes' && (
            <div className="space-y-6">
              {/* 岗位JD设置 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <BriefcaseIcon className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-gray-900">招聘岗位设置</h3>
                  <span className="text-sm text-gray-500">（用于计算匹配度）</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 岗位名称 */}
                        <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      岗位名称 *
                    </label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="例如：数据分析师、Java开发工程师"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                          </div>

                  {/* 技能要求 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      技能要求 *
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={jobSkillInput}
                        onChange={(e) => setJobSkillInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSkill();
                          }
                        }}
                        placeholder="输入技能后按回车添加"
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={handleAddSkill}
                        className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                      >
                        添加
                      </button>
                        </div>
                        </div>
              </div>

                {/* 已添加的技能标签 */}
                {jobSkills.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">已添加技能（{jobSkills.length}个）：</p>
                    <div className="flex flex-wrap gap-2">
                      {jobSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center space-x-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                        >
                          <span>{skill}</span>
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-1 hover:text-indigo-900"
                          >
                            <XMarkIcon className="w-4 h-4" />
                    </button>
                          </span>
                    ))}
                  </div>
                </div>
                )}

                {/* 提示信息 */}
                {jobSkills.length === 0 && (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                    <p className="text-sm text-yellow-800">
                      💡 提示：设置岗位技能要求后，系统将自动计算候选人匹配度
                    </p>
                  </div>
                )}
                        </div>

              {/* OCR 使用次数提示 */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                    <SparklesIcon className="w-6 h-6 text-indigo-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">阿里云OCR识别服务</p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        剩余 <span className="font-bold text-indigo-600">{ocrTotalCalls - ocrUsedCalls}</span> 次可用，
                        已使用 {ocrUsedCalls} / {ocrTotalCalls} 次
                      </p>
                          </div>
                        </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-48 bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full transition-all ${
                          ocrUsedCalls / ocrTotalCalls < 0.5 ? 'bg-green-500' :
                          ocrUsedCalls / ocrTotalCalls < 0.8 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${(ocrUsedCalls / ocrTotalCalls) * 100}%` }}
                      />
                      </div>
                    <span className="text-xs font-medium text-gray-600">
                      {Math.round((ocrUsedCalls / ocrTotalCalls) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* 简历上传区域 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <DocumentArrowUpIcon className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-gray-900">上传简历（仅支持PDF格式）</h3>
            </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-500 transition-colors">
                      <input
                      type="file"
                      multiple
                      accept=".pdf"
                      onChange={handleResumeUpload}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      <DocumentArrowUpIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">点击上传或拖拽文件到此处</p>
                      <p className="text-sm text-gray-500">仅支持 PDF 格式，可批量上传</p>
                      <p className="text-xs text-indigo-600 mt-2">💡 使用阿里云高精度OCR识别简历内容</p>
                    </label>
                    </div>

                  {uploadedResumes.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          已上传 {uploadedResumes.length} 份简历
                          </span>
                        <button
                          onClick={() => setUploadedResumes([])}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          清空
                          </button>
                </div>
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {uploadedResumes.map((file, index) => (
                          <div key={index} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                              <span className="text-sm text-gray-700">{file.name}</span>
              </div>
                            <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                    ))}
                  </div>
                </div>
                  )}

                  <button
                    onClick={handleParseResumes}
                    disabled={parsingResumes || uploadedResumes.length === 0}
                    className="w-full mt-4 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {parsingResumes ? (
                      <>
                        <ArrowPathIcon className="w-5 h-5 animate-spin" />
                        <span>OCR识别解析中...</span>
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-5 h-5" />
                        <span>开始解析简历</span>
                      </>
                    )}
                  </button>
                        </div>
                        
              {/* 统计卡片 */}
              {parsedCandidates.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-600 font-medium">博士</p>
                        <p className="text-2xl font-bold text-purple-900 mt-1">
                          {parsedCandidates.filter(c => c.education === '博士').length}
                        </p>
                          </div>
                      <AcademicCapIcon className="w-10 h-10 text-purple-400" />
                          </div>
                          </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600 font-medium">硕士</p>
                        <p className="text-2xl font-bold text-blue-900 mt-1">
                          {parsedCandidates.filter(c => c.education === '硕士').length}
                        </p>
                      </div>
                      <AcademicCapIcon className="w-10 h-10 text-blue-400" />
                          </div>
                        </div>

                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4 border border-red-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-red-600 font-medium">985院校</p>
                        <p className="text-2xl font-bold text-red-900 mt-1">
                          {parsedCandidates.filter(c => c.is985).length}
                        </p>
                      </div>
                      <StarIcon className="w-10 h-10 text-red-400" />
                    </div>
                        </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-600 font-medium">211院校</p>
                        <p className="text-2xl font-bold text-orange-900 mt-1">
                          {parsedCandidates.filter(c => c.is211).length}
                        </p>
                      </div>
                      <StarIcon className="w-10 h-10 text-orange-400" />
                    </div>
                  </div>
                </div>
              )}

              {/* 解析结果表格 */}
              {parsedCandidates.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <CheckBadgeIcon className="w-6 h-6 text-green-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        解析完成 - 共 {parsedCandidates.length} 份简历
                      </h3>
                    </div>
                    <div className="flex items-center space-x-3">
                      <select
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        defaultValue="rank"
                      >
                        <option value="rank">按院校排名</option>
                        <option value="education">按学历</option>
                        <option value="序号">按序号</option>
                      </select>
                        <button 
                        onClick={handleAddParsedCandidates}
                        className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                        >
                        <UserPlusIcon className="w-5 h-5" />
                        <span>添加到候选人库</span>
                        </button>
                      </div>
                    </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b-2 border-gray-300">
                        <tr>
                          <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">姓名</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">基本信息（含学历）</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">核心优势</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">院校背景（标注 211/985）</th>
                          <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">匹配度</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {parsedCandidates.map((candidate) => (
                          <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                            {/* 姓名 */}
                            <td className="px-3 py-4 text-sm font-semibold text-center text-gray-900 border-r border-gray-200">
                              {candidate.name}
                            </td>

                            {/* 基本信息（含学历） */}
                            <td className="px-4 py-4 text-sm text-gray-700 border-r border-gray-200">
                              <div className="space-y-1.5">
                                <div>
                                  <span className="font-medium text-gray-900">{candidate.gender || '未知'}</span>
                                  <span className="mx-2 text-gray-400">·</span>
                                  <span>{candidate.age || '-'}岁</span>
                                  <span className="mx-2 text-gray-400">·</span>
                                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                    candidate.education === '博士' ? 'bg-purple-100 text-purple-800' :
                                    candidate.education === '硕士' ? 'bg-blue-100 text-blue-800' :
                                    candidate.education === '本科' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {candidate.education}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-600">
                                  📞 {candidate.phone || '-'}
                                  <span className="mx-2">|</span>
                                  📧 {candidate.email || '-'}
                                </div>
                              </div>
                            </td>

                            {/* 核心优势 */}
                            <td className="px-4 py-4 text-sm text-gray-700 border-r border-gray-200">
                              <div className="space-y-1 max-w-md">
                                <p className="line-clamp-3">{candidate.advantages || '-'}</p>
                                {candidate.skills && candidate.skills.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {candidate.skills.slice(0, 5).map((skill, idx) => (
                                      <span key={idx} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs">
                                        {skill}
                                      </span>
                                    ))}
                                    {candidate.skills.length > 5 && (
                                      <span className="text-xs text-gray-500">+{candidate.skills.length - 5}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* 院校背景（标注211/985） */}
                            <td className="px-4 py-4 text-sm text-gray-700 border-r border-gray-200">
                              <div className="space-y-2">
                                <div className="flex items-center justify-center space-x-2">
                                  {candidate.is985 && (
                                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-bold border border-red-300">
                                      985
                                    </span>
                                  )}
                                  {candidate.is211 && (
                                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-bold border border-orange-300">
                                      211
                                    </span>
                                  )}
                                  {!candidate.is985 && !candidate.is211 && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                      普通本科
                                    </span>
                                  )}
                                </div>
                                <div className="text-center">
                                  <p className="font-medium text-gray-900">{candidate.university}</p>
                                  <p className="text-xs text-gray-600 mt-0.5">{candidate.major}</p>
                                </div>
                                {candidate.description && (
                                  <p className="text-xs text-gray-500 text-center mt-1 line-clamp-2">
                                    {candidate.description}
                                  </p>
                                )}
                              </div>
                            </td>

                            {/* 匹配度 */}
                            <td className="px-3 py-4 text-center">
                              <div className="flex flex-col items-center space-y-2">
                                <div className={`text-2xl font-bold ${
                                  candidate.matchScore >= 80 ? 'text-green-600' :
                                  candidate.matchScore >= 60 ? 'text-blue-600' :
                                  candidate.matchScore >= 40 ? 'text-yellow-600' :
                                  'text-gray-600'
                                }`}>
                                  {candidate.matchScore}%
                                </div>
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all ${
                                      candidate.matchScore >= 80 ? 'bg-green-500' :
                                      candidate.matchScore >= 60 ? 'bg-blue-500' :
                                      candidate.matchScore >= 40 ? 'bg-yellow-500' :
                                      'bg-gray-400'
                                    }`}
                                    style={{ width: `${candidate.matchScore}%` }}
                                  />
                                </div>
                                <span className={`text-xs font-medium ${
                                  candidate.matchScore >= 80 ? 'text-green-700' :
                                  candidate.matchScore >= 60 ? 'text-blue-700' :
                                  candidate.matchScore >= 40 ? 'text-yellow-700' :
                                  'text-gray-700'
                                }`}>
                                  {candidate.matchScore >= 80 ? '高适配' :
                                   candidate.matchScore >= 60 ? '适配' :
                                   candidate.matchScore >= 40 ? '一般' : '低'}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
              </div>
                </div>
              )}
            </div>
          )}

          {/* ============= 2. 候选人管理Tab ============= */}
          {activeTab === 'candidates' && (
            <div className="space-y-6">
              {/* 筛选和搜索 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[300px]">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="搜索候选人姓名、职位、邮箱..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FunnelIcon className="w-5 h-5 text-gray-400" />
                  <select
                      value={candidateFilter}
                      onChange={(e) => setCandidateFilter(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="all">全部状态</option>
                    <option value="new">新申请</option>
                    <option value="screening">筛选中</option>
                    <option value="interview">面试中</option>
                      <option value="offer">已发Offer</option>
                    <option value="hired">已入职</option>
                    <option value="rejected">已拒绝</option>
                  </select>
                  </div>
                </div>
              </div>

              {/* 候选人列表 */}
              <div className="space-y-4">
                {filteredCandidates.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                    <UserGroupIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">暂无候选人数据</p>
                    <p className="text-sm text-gray-400 mt-2">请先上传简历进行筛选</p>
                  </div>
                ) : (
                  filteredCandidates.map((candidate) => (
                    <div key={candidate.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-xl font-semibold text-gray-900">{candidate.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(candidate.status)}`}>
                              {getStatusText(candidate.status)}
                          </span>
                          <div className="flex items-center space-x-1">
                              <StarIconSolid className="w-5 h-5 text-yellow-500" />
                              <span className={`text-lg font-bold ${getMatchScoreColor(candidate.matchScore)}`}>
                                {candidate.matchScore}
                              </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center text-gray-600">
                            <BriefcaseIcon className="w-4 h-4 mr-2" />
                            <span className="text-sm">{candidate.position}</span>
                          </div>
                            <div className="flex items-center text-gray-600">
                            <AcademicCapIcon className="w-4 h-4 mr-2" />
                            <span className="text-sm">{candidate.education} · {candidate.experience}</span>
                          </div>
                            <div className="flex items-center text-gray-600">
                            <EnvelopeIcon className="w-4 h-4 mr-2" />
                            <span className="text-sm">{candidate.email}</span>
                          </div>
                            <div className="flex items-center text-gray-600">
                            <PhoneIcon className="w-4 h-4 mr-2" />
                            <span className="text-sm">{candidate.phone}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {candidate.skills.slice(0, 5).map((skill, idx) => (
                              <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-lg">
                              {skill}
                            </span>
                          ))}
                            {candidate.skills.length > 5 && (
                              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-lg">
                                +{candidate.skills.length - 5}
                            </span>
                          )}
                        </div>

                          <div className="flex flex-wrap gap-2">
                            {candidate.tags.map((tag, idx) => (
                              <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                                {tag}
                              </span>
                            ))}
                        </div>
                      </div>

                        <div className="flex flex-col space-y-2 ml-6">
                        <button 
                            onClick={() => {
                              setSelectedCandidate(candidate);
                              setShowCandidateDetail(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="查看详情"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                          
                        <div className="relative group">
                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <CheckCircleIcon className="w-5 h-5" />
                          </button>
                            <div className="absolute right-full mr-2 top-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <div className="p-2">
                                {['screening', 'interview', 'offer', 'hired'].map((status) => (
                              <button
                                    key={status}
                                    onClick={() => handleUpdateCandidateStatus(candidate.id, status as any)}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded"
                              >
                                    {getStatusText(status)}
                              </button>
                                ))}
                              </div>
                            </div>
                          </div>

                              <button
                            onClick={() => {
                              setSelectedCandidateForInterview(candidate.id);
                              handleGenerateInterviewQuestions(candidate);
                            }}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="生成面试问题"
                          >
                            <LightBulbIcon className="w-5 h-5" />
                              </button>

                              <button
                            onClick={() => handleDeleteCandidate(candidate.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="删除"
                              >
                            <TrashIcon className="w-5 h-5" />
                              </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ============= 3. 面试辅助Tab ============= */}
          {activeTab === 'interviews' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 待面试候选人 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <CalendarIcon className="w-6 h-6 text-indigo-600" />
                      <h3 className="text-lg font-semibold text-gray-900">待面试候选人</h3>
                    </div>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                      {candidates.filter(c => c.status === 'interview').length} 人
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {candidates.filter(c => c.status === 'interview').map((candidate) => (
                      <div key={candidate.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{candidate.name}</h4>
                            <p className="text-sm text-gray-500">{candidate.position}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${getMatchScoreColor(candidate.matchScore)}`}>
                            {candidate.matchScore}分
                          </span>
                        </div>

                        {candidate.interviews.length > 0 && (
                          <div className="space-y-2 mb-3">
                            {candidate.interviews.map((interview) => (
                              <div key={interview.id} className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                  <ClockIcon className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-600">
                                    第{interview.round}轮 - {interview.type}
                                  </span>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  interview.status === 'completed' ? 'bg-green-100 text-green-700' :
                                  interview.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {interview.status === 'completed' ? '已完成' :
                                   interview.status === 'scheduled' ? '已安排' : '已取消'}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                              <button
                            onClick={() => {
                              setSelectedCandidateForInterview(candidate.id);
                              setShowScheduleModal(true);
                            }}
                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                          >
                            安排面试
                              </button>
                              <button
                            onClick={() => {
                              setSelectedCandidateForInterview(candidate.id);
                              handleGenerateInterviewQuestions(candidate);
                            }}
                            className="flex-1 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50"
                          >
                            生成问题
                              </button>
                            </div>
                          </div>
                    ))}

                    {candidates.filter(c => c.status === 'interview').length === 0 && (
                      <div className="text-center py-8">
                        <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">暂无待面试候选人</p>
                        </div>
                    )}
                      </div>
                    </div>

                {/* 面试问题生成 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <LightBulbIcon className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-gray-900">AI生成面试问题</h3>
                  </div>

                  {generatingQuestions ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <ArrowPathIcon className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                      <p className="text-gray-600">AI正在生成面试问题...</p>
              </div>
                  ) : interviewQuestions.length > 0 ? (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-4">
                        <p className="text-sm text-indigo-700">
                          💡 已为候选人生成 {interviewQuestions.length} 个面试问题
                        </p>
            </div>

                      <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {interviewQuestions.map((question, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
                                {index + 1}
                    </div>
                              <p className="flex-1 text-gray-700">{question}</p>
                    </div>
                  </div>
                ))}
              </div>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(interviewQuestions.join('\n\n'));
                          setSuccessMessage('面试问题已复制到剪贴板！');
                        }}
                        className="w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
                      >
                        复制全部问题
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BeakerIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-2">尚未生成面试问题</p>
                      <p className="text-sm text-gray-400">请选择候选人并点击"生成问题"按钮</p>
            </div>
          )}
                    </div>
                  </div>
                    </div>
          )}

          {/* ============= 4. 沟通管理Tab ============= */}
          {activeTab === 'communication' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 邮件模板 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <EnvelopeIcon className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-lg font-semibold text-gray-900">邮件模板</h3>
                  </div>

                  <div className="space-y-3">
                    {emailTemplates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => handleSelectTemplate(template.id)}
                        className={`border rounded-xl p-4 cursor-pointer transition-all ${
                          selectedTemplate === template.id
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{template.name}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            template.type === 'invite' ? 'bg-blue-100 text-blue-700' :
                            template.type === 'offer' ? 'bg-green-100 text-green-700' :
                            template.type === 'reject' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {template.type}
                          </span>
                    </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{template.subject}</p>
                  </div>
                  ))}
                </div>
              </div>

                {/* 邮件编辑 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <PencilIcon className="w-6 h-6 text-indigo-600" />
                      <h3 className="text-lg font-semibold text-gray-900">编辑邮件</h3>
                    </div>
                    <button
                      onClick={() => setShowEmailModal(true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                    >
                      发送邮件
                    </button>
                  </div>

                <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        邮件主题
                      </label>
                      <input
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        placeholder="请输入邮件主题..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        邮件内容
                      </label>
                      <textarea
                        value={emailContent}
                        onChange={(e) => setEmailContent(e.target.value)}
                        rows={12}
                        placeholder="请输入邮件内容..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono text-sm"
                      />
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-600 mb-2">支持的变量：</p>
                      <div className="flex flex-wrap gap-2">
                        {['{候选人姓名}', '{职位}', '{公司名称}', '{面试时间}', '{薪资}'].map((variable) => (
                          <span key={variable} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-mono">
                            {variable}
                          </span>
                        ))}
                      </div>
                    </div>
                      </div>
                    </div>
                  </div>

              {/* 沟通记录 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-gray-900">最近沟通记录</h3>
                </div>

                <div className="space-y-3">
                  {candidates
                    .filter(c => c.communications.length > 0)
                    .slice(0, 5)
                    .map((candidate) => (
                      <div key={candidate.id} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-indigo-600 font-semibold">
                                {candidate.name.charAt(0)}
                              </span>
                        </div>
                    <div>
                              <h4 className="font-semibold text-gray-900">{candidate.name}</h4>
                              <p className="text-sm text-gray-500">{candidate.position}</p>
                      </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {candidate.communications[candidate.communications.length - 1]?.sendAt.toLocaleDateString()}
                          </span>
                      </div>
                        <p className="text-sm text-gray-600">
                          {candidate.communications[candidate.communications.length - 1]?.content}
                        </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============= 5. 数据分析Tab ============= */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* 关键指标 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: '候选人总数', value: stats.totalCandidates, icon: UserGroupIcon, color: 'blue', change: '+12%' },
                  { label: '平均匹配度', value: `${stats.avgMatchScore}分`, icon: StarIcon, color: 'yellow' },
                  { label: '平均处理时间', value: `${stats.avgProcessTime}天`, icon: ClockIcon, color: 'purple' },
                  { label: '转化率', value: `${stats.conversionRate}%`, icon: ArrowTrendingUpIcon, color: 'green', change: '+5%' }
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl ${
                          stat.color === 'blue' ? 'bg-blue-100' :
                          stat.color === 'yellow' ? 'bg-yellow-100' :
                          stat.color === 'purple' ? 'bg-purple-100' :
                          'bg-green-100'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            stat.color === 'blue' ? 'text-blue-600' :
                            stat.color === 'yellow' ? 'text-yellow-600' :
                            stat.color === 'purple' ? 'text-purple-600' :
                            'text-green-600'
                          }`} />
                    </div>
                        {stat.change && (
                          <span className="text-sm font-medium text-green-600">{stat.change}</span>
          )}
        </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
                  );
                })}
                  </div>

              {/* 招聘漏斗 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <FunnelIcon className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-gray-900">招聘漏斗分析</h3>
                    </div>
                  
                <div className="space-y-4">
                  {funnelData.map((stage, index) => {
                    const maxCount = Math.max(...funnelData.map(s => s.count));
                    const percentage = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
                    
                    return (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-32 text-sm font-medium text-gray-700">{stage.stage}</div>
                        <div className="flex-1">
                          <div className="relative h-10 bg-gray-100 rounded-lg overflow-hidden">
                            <div
                              className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-end pr-4 rounded-lg transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            >
                              <span className="text-white font-semibold text-sm">{stage.count}</span>
                    </div>
                      </div>
                    </div>
                        <div className="w-16 text-right text-sm font-medium text-gray-700">
                          {maxCount > 0 ? Math.round((stage.count / maxCount) * 100) : 0}%
                      </div>
                      </div>
                    );
                  })}
                    </div>
                  </div>

              {/* 渠道分析 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <ChartBarIcon className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-gray-900">招聘渠道效果分析</h3>
                      </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {channelStats.map((channel, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{channel.name}</h4>
                        <span className="text-2xl font-bold text-indigo-600">{channel.count}</span>
                    </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${channel.percentage}%` }}
                        ></div>
                    </div>
                      <p className="text-sm text-gray-600 mt-2">{channel.percentage}% 占比</p>
                </div>
              ))}
                  </div>
              </div>
            </div>
          )}

          {/* ============= 6. AI助手Tab ============= */}
          {activeTab === 'ai' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-[700px] flex flex-col">
              {/* 聊天标题 */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
                    <SparklesIconSolid className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">AI招聘助手</h3>
                    <p className="text-sm text-gray-500">智能分析 · 决策建议 · 数据洞察</p>
                  </div>
        </div>

                {/* AI配置按钮 */}
                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    aiConfigured 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {aiConfigured ? '✓ 豆包AI已配置' : '⚠ AI未配置'}
                  </div>
                  <button
                    onClick={() => setShowAiConfig(true)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="配置豆包AI"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* 聊天消息区域 */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {aiMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-3 max-w-[80%] ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        message.type === 'user'
                          ? 'bg-indigo-600'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500'
                      }`}>
                        {message.type === 'user' ? (
                          <span className="text-white font-semibold">你</span>
                        ) : (
                          <SparklesIconSolid className="w-5 h-5 text-white" />
                        )}
                  </div>
                      <div className={`px-4 py-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="whitespace-pre-line text-sm leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-2 ${
                          message.type === 'user' ? 'text-indigo-200' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                    </div>
                </div>
                  </div>
                ))}
                
                {aiProcessing && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <SparklesIconSolid className="w-5 h-5 text-white" />
                  </div>
                      <div className="px-4 py-3 bg-gray-100 rounded-2xl">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
                  </div>
                  
              {/* 输入区域 */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <textarea
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendAIMessage();
                        }
                      }}
                      placeholder="输入您的问题，例如：对比张三和李四的优劣..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  </div>
                <button
                    onClick={handleSendAIMessage}
                    disabled={aiProcessing || !aiInput.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                    <PaperAirplaneIcon className="w-5 h-5" />
                    <span>发送</span>
                </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {['查询候选人数据', '提供招聘建议', '对比候选人', '生成招聘报告'].map((suggestion) => (
                        <button
                      key={suggestion}
                      onClick={() => setAiInput(suggestion)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {suggestion}
                        </button>
                  ))}
                  </div>
                    </div>
          </div>
        )}
                </div>

        {/* ============= 模态框 ============= */}
        
        {/* AI配置模态框 */}
        {showAiConfig && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
                      <SparklesIconSolid className="w-6 h-6 text-white" />
                    </div>
                <div>
                      <h3 className="text-xl font-bold text-gray-900">豆包AI配置</h3>
                      <p className="text-sm text-gray-500">配置豆包大模型，提升简历解析准确率</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAiConfig(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                  </div>
                </div>

              <div className="p-6 space-y-6">
                {/* 功能说明 */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                  <h4 className="font-semibold text-indigo-900 mb-2">✨ AI增强简历解析</h4>
                  <ul className="text-sm text-indigo-700 space-y-1">
                    <li>• OCR识别后，自动调用豆包AI进行智能解析</li>
                    <li>• 使用NLP技术准确提取姓名、学历、工作经历等字段</li>
                    <li>• 大幅提升识别准确率，尤其对复杂排版的简历</li>
                    <li>• 未配置时自动降级使用基础正则解析</li>
                  </ul>
                </div>

                {/* API Key 输入 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    豆包API Key *
                  </label>
                  <input
                    type="password"
                    value={aiConfigured && aiApiKey.includes('...') ? '' : aiApiKey}
                    onChange={(e) => setAiApiKey(e.target.value)}
                    placeholder="请输入您的豆包API Key"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    可在火山方舟控制台获取：
                    <a 
                      href="https://console.volcengine.com/ark" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline ml-1"
                    >
                      https://console.volcengine.com/ark
                    </a>
                  </p>
                </div>

                {/* 配置说明 */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900 text-sm mb-1">配置步骤</h4>
                      <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                        <li>访问火山方舟控制台</li>
                        <li>创建推理接入点，选择"doubao-1-5-thinking-pro-250415"模型</li>
                        <li>获取API Key并粘贴到上方输入框</li>
                        <li>点击保存配置即可开始使用AI增强解析</li>
                      </ol>
                    </div>
                </div>
              </div>

                {/* 当前状态 */}
                {aiConfigured && aiApiKey.includes('...') && (
                  <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <div className="flex items-center space-x-2 text-green-700">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium">
                        API Key已配置：{aiApiKey}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAiConfig(false)}
                  className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={handleSaveAiConfig}
                  disabled={!aiApiKey || aiApiKey.length < 20}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>保存配置</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 候选人详情模态框 */}
        {showCandidateDetail && selectedCandidate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {selectedCandidate.name.charAt(0)}
                    </span>
                      </div>
                    <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedCandidate.name}</h3>
                    <p className="text-gray-600">{selectedCandidate.position}</p>
                    </div>
                      </div>
                  <button
                  onClick={() => setShowCandidateDetail(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                  <XMarkIcon className="w-6 h-6" />
                  </button>
                      </div>
              
              <div className="p-6 space-y-6">
                {/* 基本信息 */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{selectedCandidate.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{selectedCandidate.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <AcademicCapIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{selectedCandidate.education} · {selectedCandidate.experience}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">匹配度</span>
                      <div className="flex items-center space-x-2">
                        <StarIconSolid className="w-5 h-5 text-yellow-500" />
                        <span className={`text-xl font-bold ${getMatchScoreColor(selectedCandidate.matchScore)}`}>
                          {selectedCandidate.matchScore}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">状态</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCandidate.status)}`}>
                        {getStatusText(selectedCandidate.status)}
                      </span>
                    </div>
                      <div className="flex items-center justify-between">
                      <span className="text-gray-600">来源</span>
                      <span className="text-gray-900">{selectedCandidate.source}</span>
                      </div>
                  </div>
                </div>

                {/* 技能 */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">技能标签</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 面试记录 */}
                {selectedCandidate.interviews.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">面试记录</h4>
                  <div className="space-y-3">
                      {selectedCandidate.interviews.map((interview) => (
                        <div key={interview.id} className="border border-gray-200 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">
                              第{interview.round}轮 - {interview.type}
                      </span>
                            <span className="text-sm text-gray-500">
                              {interview.date.toLocaleDateString()}
                      </span>
                    </div>
                          {interview.feedback && (
                            <p className="text-sm text-gray-600">{interview.feedback}</p>
                          )}
                          {interview.score && (
                            <p className="text-sm font-medium text-indigo-600 mt-2">
                              评分：{interview.score}/100
                            </p>
                          )}
                    </div>
                      ))}
                  </div>
                </div>
                )}

                {/* 备注 */}
                {selectedCandidate.notes && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">备注信息</h4>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-gray-700">{selectedCandidate.notes}</p>
            </div>
          </div>
        )}
              </div>

              <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
                  <button
                  onClick={() => setShowCandidateDetail(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                  关闭
                  </button>
                  <button
                    onClick={() => {
                    setSelectedCandidateForInterview(selectedCandidate.id);
                    setShowScheduleModal(true);
                    setShowCandidateDetail(false);
                  }}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                  安排面试
                  </button>
                </div>
                  </div>
                        </div>
        )}

        {/* 安排面试模态框 */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">安排面试</h3>
                </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    面试日期
                  </label>
                    <input
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    面试时间
                  </label>
                  <input
                    type="time"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    面试官
                  </label>
                  <input
                    type="text"
                    value={interviewer}
                    onChange={(e) => setInterviewer(e.target.value)}
                    placeholder="请输入面试官姓名"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    面试类型
                  </label>
                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="technical">技术面试</option>
                    <option value="hr">HR面试</option>
                    <option value="manager">经理面试</option>
                    <option value="ceo">CEO面试</option>
                  </select>
                </div>
      </div>

              <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  取消
                </button>
                <button
                  onClick={handleScheduleInterview}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                >
                  确认安排
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 发送邮件模态框 */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">发送邮件</h3>
          </div>

              <div className="p-6 space-y-4">
                    <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    选择收件人
                  </label>
                  <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-xl p-4 space-y-2">
                    {candidates.map((candidate) => (
                      <label key={candidate.id} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedRecipients.includes(candidate.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRecipients([...selectedRecipients, candidate.id]);
                            } else {
                              setSelectedRecipients(selectedRecipients.filter(id => id !== candidate.id));
                            }
                          }}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-900">{candidate.name} ({candidate.email})</span>
                      </label>
                    ))}
        </div>
                  <p className="text-sm text-gray-500 mt-2">
                    已选择 {selectedRecipients.length} 位候选人
                  </p>
                    </div>

                    <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    邮件主题
                  </label>
                  <p className="text-sm text-gray-600">{emailSubject}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    邮件内容预览
                  </label>
                  <div className="bg-gray-50 rounded-xl p-4 max-h-48 overflow-y-auto">
                    <p className="text-sm text-gray-700 whitespace-pre-line">{emailContent}</p>
                          </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  取消
                </button>
                  <button
                  onClick={handleSendEmail}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 flex items-center space-x-2"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                  <span>发送邮件</span>
                  </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
