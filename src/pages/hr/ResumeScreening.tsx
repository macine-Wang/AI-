/**
 * 智能简历筛选模块 - 高级版
 * 
 * 功能：
 * - OCR识别 + AI解析
 * - 多维度评分系统
 * - 灵活筛选和排序
 * - 候选人对比
 * - 数据导出
 */

import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  CheckCircleIcon,
  XMarkIcon,
  StarIcon,
  EyeIcon,
  CloudArrowUpIcon,
  TableCellsIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  BeakerIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

// ============= 类型定义 =============

// 简历基础信息
interface ResumeBasicInfo {
  name: string;
  gender?: '男' | '女';
  age?: number;
  phone: string;
  email: string;
  currentLocation?: string;
  expectedSalary?: number;
  currentSalary?: number;
  photoUrl?: string;
}

// 教育背景
interface Education {
  school: string;
  major: string;
  degree: '博士' | '硕士' | '本科' | '专科' | '高中及以下';
  startDate: string;
  endDate: string;
  gpa?: number;
  ranking?: string;
  schoolType?: '985' | '211' | '双一流' | '普通本科' | '专科' | '其他';
}

// 工作经历
interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
  isBigCompany?: boolean;
}

// 项目经验
interface ProjectExperience {
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  techStack: string[];
  description: string;
  achievements: string[];
}

// 技能信息
interface Skills {
  professionalSkills: string[];
  languages: { language: string; level: string }[];
  certificates: string[];
}

// 解析质量评估
interface ParseQuality {
  overallConfidence: number; // 整体置信度 0-100
  fieldConfidence: {
    [key: string]: number; // 各字段置信度
  };
  missingFields: string[]; // 缺失字段
  warnings: string[]; // 警告信息
}

// 评分详情
interface ScoringDetails {
  educationScore: number; // 学历评分
  experienceMatchScore: number; // 经验匹配度
  skillMatchScore: number; // 技能匹配度
  stabilityScore: number; // 稳定性评分
  growthScore: number; // 成长性评分
  totalScore: number; // 综合评分
  weights: {
    education: number;
    experience: number;
    skill: number;
    stability: number;
    growth: number;
  };
  highlights: string[]; // 亮点
  risks: string[]; // 风险点
}

// 完整简历数据
interface ResumeData {
  id: string;
  fileName: string;
  uploadTime: Date;
  fileUrl: string;
  fileType: 'pdf' | 'doc' | 'docx' | 'image';
  
  // 基础信息
  basicInfo: ResumeBasicInfo;
  
  // 教育背景
  education: Education[];
  
  // 工作经历
  workExperience: WorkExperience[];
  totalWorkYears: number;
  
  // 项目经验
  projects: ProjectExperience[];
  
  // 技能信息
  skills: Skills;
  
  // 其他信息
  selfEvaluation?: string;
  advantages?: string[];
  awards?: string[];
  expectedPosition?: string;
  availableDate?: string;
  
  // 解析质量
  parseQuality: ParseQuality;
  
  // 评分详情
  scoring: ScoringDetails;
  
  // 标签和状态
  tags: string[];
  status: '待筛选' | '待面试' | '已淘汰' | '重点关注' | '已录用';
  starred: boolean;
  notes: string;
}

// 筛选条件
interface FilterCondition {
  id: string;
  field: string;
  operator: '=' | '>' | '<' | '>=' | '<=' | '包含' | '不包含' | '属于' | '不属于';
  value: any;
  logic?: 'AND' | 'OR';
}

// 排序条件
interface SortCondition {
  field: string;
  order: 'asc' | 'desc';
  priority: number;
}

// 评分模板
interface ScoringTemplate {
  id: string;
  name: string;
  description: string;
  weights: {
    education: number;
    experience: number;
    skill: number;
    stability: number;
    growth: number;
  };
  jobRequirements?: {
    minEducation?: string;
    minWorkYears?: number;
    requiredSkills?: string[];
    preferredSkills?: string[];
  };
}

// 筛选方案
interface FilterScheme {
  id: string;
  name: string;
  conditions: FilterCondition[];
  sorts: SortCondition[];
  createdAt: Date;
}

export const ResumeScreening: React.FC = () => {
  // ============= 状态管理 =============
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [filteredResumes, setFilteredResumes] = useState<ResumeData[]>([]);
  const [selectedResumes, setSelectedResumes] = useState<Set<string>>(new Set());
  const [parsingProgress, setParsingProgress] = useState<Map<string, number>>(new Map());
  
  // 筛选和排序
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([]);
  const [sortConditions, setSortConditions] = useState<SortCondition[]>([
    { field: 'totalScore', order: 'desc', priority: 1 }
  ]);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // 显示控制
  const [visibleColumns] = useState<Set<string>>(new Set([
    'name', 'age', 'education', 'workYears', 'expectedSalary', 'totalScore', 'status'
  ]));
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [, setSelectedResumeForDetail] = useState<ResumeData | null>(null);
  const [, setShowDetailView] = useState(false);
  
  // 评分模板
  const [, setScoringTemplates] = useState<ScoringTemplate[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<ScoringTemplate | null>(null);
  
  // 筛选方案
  const [, setFilterSchemes] = useState<FilterScheme[]>([]);
  const [showSchemeSelector, setShowSchemeSelector] = useState(false);
  
  // 其他状态
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [, setLoading] = useState(false); // 预留：用于显示加载状态
  const [, setUploadingFiles] = useState<File[]>([]); // 预留：用于显示上传文件列表

  // ============= 初始化 =============
  useEffect(() => {
    loadScoringTemplates();
    loadFilterSchemes();
    loadSampleData();
  }, []);

  useEffect(() => {
    applyFiltersAndSorts();
  }, [resumes, filterConditions, sortConditions, searchKeyword]);

  // ============= 数据加载 =============
  const loadScoringTemplates = () => {
    // 预设评分模板
    const templates: ScoringTemplate[] = [
      {
        id: 't1',
        name: '技术岗位标准模板',
        description: '适用于软件工程师、算法工程师等技术岗位',
        weights: {
          education: 0.2,
          experience: 0.25,
          skill: 0.35,
          stability: 0.1,
          growth: 0.1
        }
      },
      {
        id: 't2',
        name: '管理岗位标准模板',
        description: '适用于项目经理、部门主管等管理岗位',
        weights: {
          education: 0.15,
          experience: 0.4,
          skill: 0.2,
          stability: 0.15,
          growth: 0.1
        }
      },
      {
        id: 't3',
        name: '应届生模板',
        description: '适用于校园招聘和应届毕业生',
        weights: {
          education: 0.4,
          experience: 0.1,
          skill: 0.3,
          stability: 0.05,
          growth: 0.15
        }
      }
    ];
    setScoringTemplates(templates);
    setCurrentTemplate(templates[0]);
  };

  const loadFilterSchemes = () => {
    // 加载已保存的筛选方案
    const schemes: FilterScheme[] = [];
    setFilterSchemes(schemes);
  };

  const loadSampleData = () => {
    // 示例数据
    const sampleResumes: ResumeData[] = [
      {
        id: 'r1',
        fileName: '张三_前端开发_5年.pdf',
        uploadTime: new Date('2025-01-15'),
        fileUrl: '/resumes/zhangsan.pdf',
        fileType: 'pdf',
        basicInfo: {
          name: '张三',
          gender: '男',
          age: 28,
          phone: '138****8888',
          email: 'zhangsan@email.com',
          currentLocation: '北京',
          expectedSalary: 30000,
          currentSalary: 25000
        },
        education: [
          {
            school: '清华大学',
            major: '计算机科学与技术',
            degree: '本科',
            startDate: '2014-09',
            endDate: '2018-06',
            gpa: 3.8,
            ranking: '前10%',
            schoolType: '985'
          }
        ],
        workExperience: [
          {
            company: '字节跳动',
            position: '高级前端开发工程师',
            startDate: '2020-07',
            endDate: '至今',
            description: '负责今日头条Web端核心功能开发',
            achievements: [
              '主导首页重构，性能提升40%',
              '开发通用组件库，被5个项目组使用'
            ],
            isBigCompany: true
          },
          {
            company: '美团',
            position: '前端开发工程师',
            startDate: '2018-07',
            endDate: '2020-06',
            description: '负责外卖业务前端开发',
            achievements: [
              '完成小程序端从0到1搭建'
            ],
            isBigCompany: true
          }
        ],
        totalWorkYears: 5,
        projects: [
          {
            name: '头条首页重构项目',
            role: '技术负责人',
            startDate: '2022-03',
            endDate: '2022-08',
            techStack: ['React', 'TypeScript', 'Webpack', 'Node.js'],
            description: '带领3人团队完成首页技术栈升级',
            achievements: ['性能提升40%', '代码量减少30%']
          }
        ],
        skills: {
          professionalSkills: ['React', 'Vue', 'TypeScript', 'Node.js', 'Webpack', 'Git'],
          languages: [
            { language: '英语', level: 'CET-6' }
          ],
          certificates: ['软考中级']
        },
        selfEvaluation: '5年前端开发经验，熟悉React/Vue生态，有大型项目经验',
        advantages: ['技术功底扎实', '学习能力强', '沟通能力好'],
        awards: ['2022年度优秀员工'],
        expectedPosition: '前端开发工程师/前端架构师',
        availableDate: '1个月',
        parseQuality: {
          overallConfidence: 95,
          fieldConfidence: {
            basicInfo: 98,
            education: 95,
            workExperience: 93,
            skills: 90
          },
          missingFields: [],
          warnings: []
        },
        scoring: {
          educationScore: 95,
          experienceMatchScore: 92,
          skillMatchScore: 88,
          stabilityScore: 85,
          growthScore: 90,
          totalScore: 90,
          weights: {
            education: 0.2,
            experience: 0.25,
            skill: 0.35,
            stability: 0.1,
            growth: 0.1
          },
          highlights: [
            '985高校毕业',
            '5年大厂经验',
            '技术栈完全匹配',
            '项目经验丰富'
          ],
          risks: []
        },
        tags: ['985', '大厂背景', '技术扎实'],
        status: '重点关注',
        starred: true,
        notes: ''
      },
      {
        id: 'r2',
        fileName: '李四_Java开发_3年.pdf',
        uploadTime: new Date('2025-01-16'),
        fileUrl: '/resumes/lisi.pdf',
        fileType: 'pdf',
        basicInfo: {
          name: '李四',
          gender: '男',
          age: 25,
          phone: '139****6666',
          email: 'lisi@email.com',
          currentLocation: '上海',
          expectedSalary: 22000,
          currentSalary: 18000
        },
        education: [
          {
            school: '上海交通大学',
            major: '软件工程',
            degree: '硕士',
            startDate: '2019-09',
            endDate: '2022-06',
            gpa: 3.6,
            schoolType: '985'
          }
        ],
        workExperience: [
          {
            company: '某创业公司',
            position: 'Java开发工程师',
            startDate: '2022-07',
            endDate: '至今',
            description: '负责后端服务开发',
            achievements: ['完成支付系统重构'],
            isBigCompany: false
          }
        ],
        totalWorkYears: 3,
        projects: [
          {
            name: '支付系统重构',
            role: '主要开发',
            startDate: '2023-01',
            endDate: '2023-06',
            techStack: ['Java', 'Spring Boot', 'MySQL', 'Redis'],
            description: '重构支付核心服务',
            achievements: ['QPS提升3倍']
          }
        ],
        skills: {
          professionalSkills: ['Java', 'Spring', 'MySQL', 'Redis', 'Kafka'],
          languages: [
            { language: '英语', level: 'CET-6' }
          ],
          certificates: []
        },
        selfEvaluation: '3年Java开发经验，熟悉Spring全家桶',
        advantages: ['基础扎实', '学习能力强'],
        awards: [],
        expectedPosition: 'Java开发工程师',
        availableDate: '2周',
        parseQuality: {
          overallConfidence: 88,
          fieldConfidence: {
            basicInfo: 92,
            education: 90,
            workExperience: 85,
            skills: 88
          },
          missingFields: ['奖项'],
          warnings: ['工作经历较短']
        },
        scoring: {
          educationScore: 90,
          experienceMatchScore: 75,
          skillMatchScore: 80,
          stabilityScore: 70,
          growthScore: 85,
          totalScore: 80,
          weights: {
            education: 0.2,
            experience: 0.25,
            skill: 0.35,
            stability: 0.1,
            growth: 0.1
          },
          highlights: [
            '985高校硕士',
            '技术栈基本匹配'
          ],
          risks: [
            '工作年限较短',
            '无大厂经验'
          ]
        },
        tags: ['985', '硕士'],
        status: '待筛选',
        starred: false,
        notes: ''
      },
      {
        id: 'r3',
        fileName: '王五_产品经理_4年.pdf',
        uploadTime: new Date('2025-01-17'),
        fileUrl: '/resumes/wangwu.pdf',
        fileType: 'pdf',
        basicInfo: {
          name: '王五',
          gender: '女',
          age: 27,
          phone: '136****9999',
          email: 'wangwu@email.com',
          currentLocation: '深圳',
          expectedSalary: 25000,
          currentSalary: 20000
        },
        education: [
          {
            school: '中山大学',
            major: '市场营销',
            degree: '本科',
            startDate: '2016-09',
            endDate: '2020-06',
            schoolType: '985'
          }
        ],
        workExperience: [
          {
            company: '腾讯',
            position: '产品经理',
            startDate: '2020-07',
            endDate: '至今',
            description: '负责微信小程序产品规划',
            achievements: [
              'DAU增长200%',
              '主导3个重要功能上线'
            ],
            isBigCompany: true
          }
        ],
        totalWorkYears: 4,
        projects: [
          {
            name: '小程序商城项目',
            role: '产品负责人',
            startDate: '2022-01',
            endDate: '2022-12',
            techStack: [],
            description: '从0到1搭建小程序商城',
            achievements: ['GMV突破1000万']
          }
        ],
        skills: {
          professionalSkills: ['产品设计', '需求分析', 'Axure', 'SQL', '数据分析'],
          languages: [
            { language: '英语', level: 'CET-6' }
          ],
          certificates: []
        },
        selfEvaluation: '4年产品经验，擅长B端C端产品设计',
        advantages: ['数据驱动', '执行力强', '沟通能力好'],
        awards: ['2023年优秀产品经理'],
        expectedPosition: '高级产品经理',
        availableDate: '1个月',
        parseQuality: {
          overallConfidence: 92,
          fieldConfidence: {
            basicInfo: 95,
            education: 90,
            workExperience: 90,
            skills: 85
          },
          missingFields: [],
          warnings: []
        },
        scoring: {
          educationScore: 85,
          experienceMatchScore: 88,
          skillMatchScore: 82,
          stabilityScore: 90,
          growthScore: 88,
          totalScore: 86,
          weights: {
            education: 0.2,
            experience: 0.25,
            skill: 0.35,
            stability: 0.1,
            growth: 0.1
          },
          highlights: [
            '985高校',
            '大厂背景',
            '产品成果显著',
            '稳定性好'
          ],
          risks: []
        },
        tags: ['985', '大厂背景', '产品能力强'],
        status: '待面试',
        starred: true,
        notes: ''
      }
    ];

    setResumes(sampleResumes);
  };

  // ============= 文件上传和解析 =============
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    setUploadingFiles(fileArray);
    setLoading(true);

    for (const file of fileArray) {
      try {
        // 模拟上传进度
        setParsingProgress(prev => new Map(prev).set(file.name, 0));
        
        // 这里应该调用实际的OCR和AI解析API
        // 示例：await parseResumeWithOCR(file);
        
        // 模拟解析过程
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise(resolve => setTimeout(resolve, 300));
          setParsingProgress(prev => new Map(prev).set(file.name, progress));
        }

        // 模拟解析结果（实际应从API获取）
        const parsedResume = await mockParseResume(file);
        setResumes(prev => [...prev, parsedResume]);
        
        setParsingProgress(prev => {
          const newMap = new Map(prev);
          newMap.delete(file.name);
          return newMap;
        });
      } catch (error) {
        console.error(`解析${file.name}失败:`, error);
        setError(`解析${file.name}失败，请检查文件格式`);
      }
    }

    setUploadingFiles([]);
    setLoading(false);
    setSuccess(`成功解析${fileArray.length}份简历！`);
  };

  // 模拟简历解析
  const mockParseResume = async (file: File): Promise<ResumeData> => {
    // 这里应该调用实际的OCR和AI解析服务
    // 返回解析后的简历数据
    
    return {
      id: `r_${Date.now()}_${Math.random()}`,
      fileName: file.name,
      uploadTime: new Date(),
      fileUrl: URL.createObjectURL(file),
      fileType: file.name.endsWith('.pdf') ? 'pdf' : 'doc',
      basicInfo: {
        name: file.name.split('_')[0] || '未知',
        phone: '138****0000',
        email: 'candidate@email.com'
      },
      education: [],
      workExperience: [],
      totalWorkYears: 0,
      projects: [],
      skills: {
        professionalSkills: [],
        languages: [],
        certificates: []
      },
      parseQuality: {
        overallConfidence: 75,
        fieldConfidence: {},
        missingFields: ['教育背景', '工作经历'],
        warnings: ['置信度较低，请人工校验']
      },
      scoring: {
        educationScore: 0,
        experienceMatchScore: 0,
        skillMatchScore: 0,
        stabilityScore: 0,
        growthScore: 0,
        totalScore: 0,
        weights: currentTemplate?.weights || {
          education: 0.2,
          experience: 0.25,
          skill: 0.35,
          stability: 0.1,
          growth: 0.1
        },
        highlights: [],
        risks: []
      },
      tags: [],
      status: '待筛选',
      starred: false,
      notes: ''
    };
  };

  // ============= 筛选和排序 =============
  const applyFiltersAndSorts = () => {
    let filtered = [...resumes];

    // 应用关键词搜索
    if (searchKeyword.trim()) {
      filtered = filtered.filter(resume => 
        resume.basicInfo.name.includes(searchKeyword) ||
        resume.fileName.includes(searchKeyword) ||
        resume.skills.professionalSkills.some(skill => skill.includes(searchKeyword)) ||
        resume.workExperience.some(exp => 
          exp.company.includes(searchKeyword) || 
          exp.position.includes(searchKeyword)
        )
      );
    }

    // 应用筛选条件
    filterConditions.forEach(condition => {
      filtered = filtered.filter(resume => {
        const value = getFieldValue(resume, condition.field);
        return evaluateCondition(value, condition.operator, condition.value);
      });
    });

    // 应用排序
    if (sortConditions.length > 0) {
      filtered.sort((a, b) => {
        for (const sort of sortConditions.sort((x, y) => x.priority - y.priority)) {
          const valueA = getFieldValue(a, sort.field);
          const valueB = getFieldValue(b, sort.field);
          
          if (valueA === valueB) continue;
          
          const comparison = valueA > valueB ? 1 : -1;
          return sort.order === 'asc' ? comparison : -comparison;
        }
        return 0;
      });
    }

    setFilteredResumes(filtered);
  };

  const getFieldValue = (resume: ResumeData, field: string): any => {
    const fieldMap: { [key: string]: any } = {
      'name': resume.basicInfo.name,
      'age': resume.basicInfo.age,
      'gender': resume.basicInfo.gender,
      'expectedSalary': resume.basicInfo.expectedSalary,
      'currentSalary': resume.basicInfo.currentSalary,
      'education': resume.education[0]?.degree,
      'school': resume.education[0]?.school,
      'schoolType': resume.education[0]?.schoolType,
      'workYears': resume.totalWorkYears,
      'totalScore': resume.scoring.totalScore,
      'educationScore': resume.scoring.educationScore,
      'experienceScore': resume.scoring.experienceMatchScore,
      'skillScore': resume.scoring.skillMatchScore,
      'stabilityScore': resume.scoring.stabilityScore,
      'status': resume.status,
      'uploadTime': resume.uploadTime
    };
    return fieldMap[field];
  };

  const evaluateCondition = (value: any, operator: string, target: any): boolean => {
    switch (operator) {
      case '=': return value === target;
      case '>': return value > target;
      case '<': return value < target;
      case '>=': return value >= target;
      case '<=': return value <= target;
      case '包含': return String(value).includes(target);
      case '不包含': return !String(value).includes(target);
      case '属于': return Array.isArray(target) && target.includes(value);
      case '不属于': return Array.isArray(target) && !target.includes(value);
      default: return true;
    }
  };

  // ============= 批量操作 =============
  const handleSelectAll = () => {
    if (selectedResumes.size === filteredResumes.length) {
      setSelectedResumes(new Set());
    } else {
      setSelectedResumes(new Set(filteredResumes.map(r => r.id)));
    }
  };

  const handleSelectResume = (id: string) => {
    const newSelected = new Set(selectedResumes);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedResumes(newSelected);
  };

  const handleBatchTag = (tag: string) => {
    setResumes(prev => prev.map(resume => 
      selectedResumes.has(resume.id)
        ? { ...resume, tags: [...new Set([...resume.tags, tag])] }
        : resume
    ));
    setSuccess(`已为${selectedResumes.size}份简历添加标签：${tag}`);
  };

  const handleBatchStatus = (status: ResumeData['status']) => {
    setResumes(prev => prev.map(resume => 
      selectedResumes.has(resume.id)
        ? { ...resume, status }
        : resume
    ));
    setSuccess(`已更新${selectedResumes.size}份简历状态`);
  };

  const handleBatchDelete = () => {
    if (!confirm(`确定要删除选中的${selectedResumes.size}份简历吗？`)) return;
    
    setResumes(prev => prev.filter(resume => !selectedResumes.has(resume.id)));
    setSelectedResumes(new Set());
    setSuccess('删除成功');
  };

  // ============= 导出功能 =============
  const handleExport = (format: 'excel' | 'pdf') => {
    // 实际项目中应该调用导出API
    const dataToExport = selectedResumes.size > 0
      ? filteredResumes.filter(r => selectedResumes.has(r.id))
      : filteredResumes;

    console.log(`导出${format}格式，共${dataToExport.length}条数据`);
    setSuccess(`正在导出${dataToExport.length}份简历为${format.toUpperCase()}格式...`);
  };

  // ============= 筛选方案管理 =============
  const handleSaveFilterScheme = () => {
    const schemeName = prompt('请输入筛选方案名称：');
    if (!schemeName) return;

    const newScheme: FilterScheme = {
      id: `fs_${Date.now()}`,
      name: schemeName,
      conditions: filterConditions,
      sorts: sortConditions,
      createdAt: new Date()
    };

    setFilterSchemes(prev => [...prev, newScheme]);
    setSuccess('筛选方案保存成功');
  };

  // 应用筛选方案（预留功能）
  // const handleApplyFilterScheme = (scheme: FilterScheme) => {
  //   setFilterConditions(scheme.conditions);
  //   setSortConditions(scheme.sorts);
  //   setSuccess(`已应用筛选方案：${scheme.name}`);
  //   setShowSchemeSelector(false);
  // };

  // 可用列定义
  const availableColumns = [
    { key: 'name', label: '姓名' },
    { key: 'gender', label: '性别' },
    { key: 'age', label: '年龄' },
    { key: 'phone', label: '电话' },
    { key: 'email', label: '邮箱' },
    { key: 'education', label: '学历' },
    { key: 'school', label: '毕业院校' },
    { key: 'workYears', label: '工作年限' },
    { key: 'expectedSalary', label: '期望薪资' },
    { key: 'currentSalary', label: '当前薪资' },
    { key: 'currentLocation', label: '所在城市' },
    { key: 'totalScore', label: '综合评分' },
    { key: 'educationScore', label: '学历评分' },
    { key: 'experienceScore', label: '经验评分' },
    { key: 'skillScore', label: '技能评分' },
    { key: 'status', label: '状态' },
    { key: 'uploadTime', label: '上传时间' }
  ];

  // 分页数据
  const paginatedResumes = filteredResumes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(filteredResumes.length / pageSize);

  return (
    <div className="space-y-6">
      {/* ============= 顶部操作栏 ============= */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* 文件上传 */}
          <div className="flex-shrink-0">
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              id="resume-upload"
            />
            <label
              htmlFor="resume-upload"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all cursor-pointer"
            >
              <CloudArrowUpIcon className="w-5 h-5" />
              <span>上传简历</span>
            </label>
          </div>

          {/* 搜索框 */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="搜索姓名、技能、公司..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* 快捷按钮组 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-colors ${
                showAdvancedFilter
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FunnelIcon className="w-5 h-5" />
              <span>高级筛选</span>
              {filterConditions.length > 0 && (
                <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full">
                  {filterConditions.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowColumnSelector(!showColumnSelector)}
              className="flex items-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              <TableCellsIcon className="w-5 h-5" />
              <span>列设置</span>
            </button>

            <button
              onClick={() => setShowSchemeSelector(!showSchemeSelector)}
              className="flex items-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              <BeakerIcon className="w-5 h-5" />
              <span>方案</span>
            </button>

            <button
              onClick={() => handleExport('excel')}
              className="flex items-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              <span>导出</span>
            </button>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-6">
            <span>共 {resumes.length} 份简历</span>
            <span>筛选后 {filteredResumes.length} 份</span>
            {selectedResumes.size > 0 && (
              <span className="text-indigo-600 font-medium">
                已选择 {selectedResumes.size} 份
              </span>
            )}
          </div>
          
          {selectedResumes.size > 0 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBatchTag('重点关注')}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                标为重点
              </button>
              <button
                onClick={() => handleBatchStatus('待面试')}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
              >
                待面试
              </button>
              <button
                onClick={() => handleBatchStatus('已淘汰')}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              >
                淘汰
              </button>
              <button
                onClick={handleBatchDelete}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ============= 高级筛选面板 ============= */}
      {showAdvancedFilter && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">高级筛选条件</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSaveFilterScheme}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                保存方案
              </button>
              <button
                onClick={() => setFilterConditions([])}
                className="text-sm text-gray-600 hover:text-gray-700"
              >
                清空
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filterConditions.map((condition, index) => (
              <div key={condition.id} className="flex items-center space-x-3">
                {index > 0 && (
                  <select
                    value={condition.logic}
                    onChange={(e) => {
                      const newConditions = [...filterConditions];
                      newConditions[index].logic = e.target.value as 'AND' | 'OR';
                      setFilterConditions(newConditions);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="AND">且</option>
                    <option value="OR">或</option>
                  </select>
                )}
                
                <select
                  value={condition.field}
                  onChange={(e) => {
                    const newConditions = [...filterConditions];
                    newConditions[index].field = e.target.value;
                    setFilterConditions(newConditions);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="education">学历</option>
                  <option value="schoolType">院校类型</option>
                  <option value="workYears">工作年限</option>
                  <option value="age">年龄</option>
                  <option value="expectedSalary">期望薪资</option>
                  <option value="totalScore">综合评分</option>
                  <option value="status">状态</option>
                </select>

                <select
                  value={condition.operator}
                  onChange={(e) => {
                    const newConditions = [...filterConditions];
                    newConditions[index].operator = e.target.value as any;
                    setFilterConditions(newConditions);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="=">等于</option>
                  <option value=">">大于</option>
                  <option value="<">小于</option>
                  <option value=">=">大于等于</option>
                  <option value="<=">小于等于</option>
                  <option value="包含">包含</option>
                  <option value="属于">属于</option>
                </select>

                <input
                  type="text"
                  value={condition.value}
                  onChange={(e) => {
                    const newConditions = [...filterConditions];
                    newConditions[index].value = e.target.value;
                    setFilterConditions(newConditions);
                  }}
                  placeholder="值"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                />

                <button
                  onClick={() => {
                    setFilterConditions(filterConditions.filter((_, i) => i !== index));
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}

            <button
              onClick={() => {
                setFilterConditions([
                  ...filterConditions,
                  {
                    id: `fc_${Date.now()}`,
                    field: 'education',
                    operator: '=',
                    value: '',
                    logic: 'AND'
                  }
                ]);
              }}
              className="flex items-center space-x-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
            >
              <PlusIcon className="w-5 h-5" />
              <span>添加条件</span>
            </button>
          </div>
        </div>
      )}

      {/* ============= 简历列表表格 ============= */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedResumes.size === filteredResumes.length && filteredResumes.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                </th>
                {availableColumns.filter(col => visibleColumns.has(col.key)).map(col => (
                  <th key={col.key} className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    <div className="flex items-center space-x-2">
                      <span>{col.label}</span>
                      <button
                        onClick={() => {
                          const existing = sortConditions.find(s => s.field === col.key);
                          if (existing) {
                            setSortConditions(sortConditions.map(s =>
                              s.field === col.key
                                ? { ...s, order: s.order === 'asc' ? 'desc' : 'asc' }
                                : s
                            ));
                          } else {
                            setSortConditions([
                              { field: col.key, order: 'desc', priority: sortConditions.length + 1 }
                            ]);
                          }
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <ArrowsUpDownIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedResumes.map((resume) => (
                <tr key={resume.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedResumes.has(resume.id)}
                      onChange={() => handleSelectResume(resume.id)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                  </td>
                  
                  {visibleColumns.has('name') && (
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        {resume.starred && (
                          <StarIconSolid className="w-4 h-4 text-yellow-500" />
                        )}
                        <span className="font-medium text-gray-900">{resume.basicInfo.name}</span>
                      </div>
                    </td>
                  )}
                  
                  {visibleColumns.has('gender') && (
                    <td className="px-4 py-3 text-gray-600">{resume.basicInfo.gender}</td>
                  )}
                  
                  {visibleColumns.has('age') && (
                    <td className="px-4 py-3 text-gray-600">{resume.basicInfo.age}</td>
                  )}
                  
                  {visibleColumns.has('education') && (
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-900">{resume.education[0]?.degree}</span>
                        {resume.education[0]?.schoolType && (
                          <span className={`px-2 py-0.5 text-xs rounded ${
                            resume.education[0].schoolType === '985' ? 'bg-red-100 text-red-700' :
                            resume.education[0].schoolType === '211' ? 'bg-orange-100 text-orange-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {resume.education[0].schoolType}
                          </span>
                        )}
                      </div>
                    </td>
                  )}
                  
                  {visibleColumns.has('workYears') && (
                    <td className="px-4 py-3 text-gray-600">{resume.totalWorkYears}年</td>
                  )}
                  
                  {visibleColumns.has('expectedSalary') && (
                    <td className="px-4 py-3 text-gray-900">
                      {resume.basicInfo.expectedSalary ? `${resume.basicInfo.expectedSalary/1000}K` : '-'}
                    </td>
                  )}
                  
                  {visibleColumns.has('totalScore') && (
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <span className={`text-lg font-bold ${
                          resume.scoring.totalScore >= 90 ? 'text-green-600' :
                          resume.scoring.totalScore >= 80 ? 'text-blue-600' :
                          resume.scoring.totalScore >= 70 ? 'text-yellow-600' :
                          'text-gray-600'
                        }`}>
                          {resume.scoring.totalScore}
                        </span>
                        <span className="text-sm text-gray-500">分</span>
                      </div>
                    </td>
                  )}
                  
                  {visibleColumns.has('status') && (
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        resume.status === '重点关注' ? 'bg-red-100 text-red-700' :
                        resume.status === '待面试' ? 'bg-purple-100 text-purple-700' :
                        resume.status === '已淘汰' ? 'bg-gray-100 text-gray-700' :
                        resume.status === '已录用' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {resume.status}
                      </span>
                    </td>
                  )}
                  
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedResumeForDetail(resume);
                          setShowDetailView(true);
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="查看详情"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setResumes(prev => prev.map(r =>
                            r.id === resume.id ? { ...r, starred: !r.starred } : r
                          ));
                        }}
                        className={`p-1 rounded ${
                          resume.starred ? 'text-yellow-500 hover:bg-yellow-50' : 'text-gray-400 hover:bg-gray-50'
                        }`}
                        title={resume.starred ? '取消收藏' : '收藏'}
                      >
                        {resume.starred ? (
                          <StarIconSolid className="w-5 h-5" />
                        ) : (
                          <StarIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              显示 {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredResumes.length)} 条，
              共 {filteredResumes.length} 条
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50"
              >
                上一页
              </button>
              <span className="text-sm text-gray-600">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 上传进度提示 */}
      {parsingProgress.size > 0 && (
        <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-80">
          <h4 className="font-semibold text-gray-900 mb-3">解析中...</h4>
          <div className="space-y-2">
            {Array.from(parsingProgress.entries()).map(([fileName, progress]) => (
              <div key={fileName}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600 truncate">{fileName}</span>
                  <span className="text-gray-900 font-medium">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 成功/错误提示 */}
      {success && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-xl p-4 shadow-lg flex items-start space-x-3 animate-slide-in">
          <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-green-800">成功</p>
            <p className="text-sm text-green-700">{success}</p>
          </div>
          <button onClick={() => setSuccess(null)} className="text-green-500 hover:text-green-700">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {error && (
        <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-xl p-4 shadow-lg flex items-start space-x-3 animate-slide-in">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-red-800">错误</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

