/**
 * 招聘管理相关的类型定义
 */

// 职位信息
export interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'intern';
  level: 'junior' | 'mid' | 'senior' | 'lead' | 'manager';
  education: string;
  experience: string;
  skills: string[];
  description: string;
  requirements: string[];
  benefits: string[];
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  status: 'draft' | 'active' | 'paused' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  publishedPlatforms: string[];
  createdAt: Date;
  updatedAt: Date;
  deadline?: Date;
  headcount: number;
  filledCount: number;
  createdBy?: string;
  tags?: string[];
  // BOSS直聘扩展字段
  externalId?: string;
  externalPlatform?: string;
  viewCount?: number;
  applyCount?: number;
  link?: string; // 职位详情链接
  bossInfo?: {
    name: string;
    title: string;
    tiny: string;
    large: string;
    activeTimeDesc: string;
  };
}

// 候选人信息
export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  positionId?: string;
  source: string;
  status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  stage: string;
  score: number;
  experience: string;
  education: string;
  skills: string[];
  resumeUrl?: string;
  notes: string;
  appliedAt: Date;
  lastContact: Date;
  interviews: Interview[];
  salaryExpectation?: number;
  availability?: string;
  location?: string;
  currentCompany?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  referredBy?: string;
  tags?: string[];
  // BOSS直聘扩展字段
  externalId?: string;
  externalPlatform?: string;
  age?: number;
  gender?: string;
  workExperience?: Array<{
    companyName: string;
    position: string;
    startTime: string;
    endTime: string;
    description: string;
  }>;
  educationHistory?: Array<{
    schoolName: string;
    major: string;
    degree: string;
    startTime: string;
    endTime: string;
  }>;
}

// 面试信息
export interface Interview {
  id: string;
  candidateId: string;
  positionId: string;
  type: 'phone' | 'video' | 'onsite' | 'technical';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  scheduledAt: Date;
  duration: number;
  interviewer: string;
  interviewerEmail?: string;
  location?: string;
  meetingLink?: string;
  feedback?: string;
  score?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  round: number;
  questions?: InterviewQuestion[];
}

// 面试问题
export interface InterviewQuestion {
  id: string;
  question: string;
  answer?: string;
  score?: number;
  category: 'technical' | 'behavioral' | 'cultural' | 'other';
}

// 招聘分析数据
export interface RecruitmentAnalytics {
  totalPositions: number;
  activePositions: number;
  totalCandidates: number;
  newCandidates: number;
  interviewsScheduled: number;
  offersExtended: number;
  hiredCount: number;
  averageTimeToHire: number;
  sourceEffectiveness: { [key: string]: number };
  conversionRates: {
    applicationToInterview: number;
    interviewToOffer: number;
    offerToHire: number;
  };
  departmentStats?: { [key: string]: number };
  monthlyTrends?: MonthlyTrend[];
}

// 月度趋势数据
export interface MonthlyTrend {
  month: string;
  applications: number;
  hires: number;
  averageSalary: number;
}

// 市场洞察
export interface MarketInsight {
  position: string;
  demandTrend: 'increasing' | 'stable' | 'decreasing';
  competitionLevel: 'low' | 'medium' | 'high';
  averageSalary: number;
  salaryRange: {
    min: number;
    max: number;
    percentile25: number;
    percentile75: number;
  };
  skillsInDemand: string[];
  timeToFill: number;
  candidateAvailability: 'abundant' | 'moderate' | 'scarce';
  recommendations: string[];
  marketSize?: number;
  growthRate?: number;
  topCompanies?: string[];
}

// 招聘平台配置
export interface RecruitmentPlatform {
  name: string;
  apiKey: string;
  enabled: boolean;
  lastSync?: Date;
  jobsPublished?: number;
  applicationsReceived?: number;
}

// 简历解析结果
export interface ResumeParseResult {
  name: string;
  email: string;
  phone: string;
  education: string;
  experience: string;
  skills: string[];
  summary: string;
  workHistory?: WorkExperience[];
  educationHistory?: Education[];
  certifications?: string[];
  languages?: string[];
}

// 工作经历
export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  achievements?: string[];
}

// 教育经历
export interface Education {
  school: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

// 通知配置
export interface NotificationConfig {
  email: {
    enabled: boolean;
    templates: { [key: string]: string };
  };
  sms: {
    enabled: boolean;
    templates: { [key: string]: string };
  };
  webhook: {
    enabled: boolean;
    url: string;
  };
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 分页响应
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 搜索过滤参数
export interface SearchFilters {
  keyword?: string;
  status?: string;
  department?: string;
  location?: string;
  experience?: string;
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  dateFrom?: Date;
  dateTo?: Date;
}

// 导出类型
export interface ExportConfig {
  format: 'excel' | 'csv' | 'pdf';
  fields: string[];
  filters?: SearchFilters;
  includeCharts?: boolean;
}

// 批量操作
export interface BatchOperation {
  action: 'update' | 'delete' | 'publish' | 'archive';
  ids: string[];
  data?: Partial<JobPosition | Candidate>;
}

// 系统配置
export interface SystemConfig {
  company: {
    name: string;
    logo?: string;
    website?: string;
    description?: string;
  };
  recruitment: {
    defaultCurrency: string;
    workingDays: number[];
    businessHours: {
      start: string;
      end: string;
    };
    autoScreening: boolean;
    requireApproval: boolean;
  };
  integrations: {
    platforms: RecruitmentPlatform[];
    email: NotificationConfig['email'];
    sms: NotificationConfig['sms'];
  };
}

// 用户权限
export interface UserPermissions {
  canCreatePositions: boolean;
  canEditPositions: boolean;
  canDeletePositions: boolean;
  canViewCandidates: boolean;
  canEditCandidates: boolean;
  canScheduleInterviews: boolean;
  canViewAnalytics: boolean;
  canExportData: boolean;
  canManageSettings: boolean;
}

// 活动日志
export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: 'position' | 'candidate' | 'interview';
  entityId: string;
  details: string;
  timestamp: Date;
  ipAddress?: string;
}
