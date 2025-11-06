/**
 * 招聘系统配置文件
 * 管理API密钥、平台设置和系统配置
 */

// 招聘平台API配置
export const RECRUITMENT_PLATFORMS = {
  BOSS_ZHIPIN: {
    name: 'BOSS直聘',
    apiUrl: 'https://api.zhipin.com',
    apiKey: process.env.REACT_APP_BOSS_API_KEY || '',
    enabled: true,
    features: ['job_posting', 'candidate_search', 'application_sync']
  },
  ZHILIAN: {
    name: '智联招聘',
    apiUrl: 'https://api.zhaopin.com',
    apiKey: process.env.REACT_APP_ZHILIAN_API_KEY || '',
    enabled: true,
    features: ['job_posting', 'resume_download', 'candidate_management']
  },
  QIANCHENGWUYOU: {
    name: '前程无忧',
    apiUrl: 'https://api.51job.com',
    apiKey: process.env.REACT_APP_51JOB_API_KEY || '',
    enabled: true,
    features: ['job_posting', 'candidate_search']
  },
  LAGOU: {
    name: '拉勾网',
    apiUrl: 'https://api.lagou.com',
    apiKey: process.env.REACT_APP_LAGOU_API_KEY || '',
    enabled: true,
    features: ['job_posting', 'tech_talent_search']
  }
};

// 薪酬数据API配置
export const SALARY_DATA_APIS = {
  PRIMARY: {
    name: '薪酬数据主API',
    apiUrl: 'https://api.salary-data.com',
    apiKey: process.env.REACT_APP_SALARY_API_KEY || '',
    enabled: true
  },
  BACKUP: {
    name: '薪酬数据备用API',
    apiUrl: 'https://api.payscale.com',
    apiKey: process.env.REACT_APP_PAYSCALE_API_KEY || '',
    enabled: false
  }
};

// 简历解析API配置
export const RESUME_PARSER_APIS = {
  ALIYUN_OCR: {
    name: '阿里云文档解析',
    apiUrl: 'https://docmind.cn-hangzhou.aliyuncs.com',
    accessKeyId: process.env.REACT_APP_ALIYUN_ACCESS_KEY_ID || '',
    accessKeySecret: process.env.REACT_APP_ALIYUN_ACCESS_KEY_SECRET || '',
    enabled: true
  },
  TENCENT_OCR: {
    name: '腾讯云OCR',
    apiUrl: 'https://ocr.tencentcloudapi.com',
    secretId: process.env.REACT_APP_TENCENT_SECRET_ID || '',
    secretKey: process.env.REACT_APP_TENCENT_SECRET_KEY || '',
    enabled: false
  },
  BAIDU_AI: {
    name: '百度AI文档解析',
    apiUrl: 'https://aip.baidubce.com',
    apiKey: process.env.REACT_APP_BAIDU_API_KEY || '',
    secretKey: process.env.REACT_APP_BAIDU_SECRET_KEY || '',
    enabled: false
  }
};

// 通知服务配置
export const NOTIFICATION_SERVICES = {
  EMAIL: {
    SENDGRID: {
      name: 'SendGrid',
      apiKey: process.env.REACT_APP_SENDGRID_API_KEY || '',
      fromEmail: process.env.REACT_APP_FROM_EMAIL || 'hr@company.com',
      enabled: true
    },
    ALIYUN_DM: {
      name: '阿里云邮件推送',
      accessKeyId: process.env.REACT_APP_ALIYUN_DM_ACCESS_KEY_ID || '',
      accessKeySecret: process.env.REACT_APP_ALIYUN_DM_ACCESS_KEY_SECRET || '',
      enabled: false
    }
  },
  SMS: {
    ALIYUN_SMS: {
      name: '阿里云短信',
      accessKeyId: process.env.REACT_APP_ALIYUN_SMS_ACCESS_KEY_ID || '',
      accessKeySecret: process.env.REACT_APP_ALIYUN_SMS_ACCESS_KEY_SECRET || '',
      signName: process.env.REACT_APP_SMS_SIGN_NAME || '',
      enabled: true
    },
    TENCENT_SMS: {
      name: '腾讯云短信',
      secretId: process.env.REACT_APP_TENCENT_SMS_SECRET_ID || '',
      secretKey: process.env.REACT_APP_TENCENT_SMS_SECRET_KEY || '',
      sdkAppId: process.env.REACT_APP_TENCENT_SMS_SDK_APP_ID || '',
      enabled: false
    }
  }
};

// 系统配置
export const SYSTEM_CONFIG = {
  // 数据存储
  STORAGE: {
    type: 'localStorage', // 'localStorage' | 'indexedDB' | 'remote'
    encryptionEnabled: true,
    backupEnabled: true
  },
  
  // 分页设置
  PAGINATION: {
    defaultPageSize: 20,
    maxPageSize: 100
  },
  
  // 文件上传
  FILE_UPLOAD: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['.pdf', '.doc', '.docx', '.txt'],
    uploadPath: '/uploads/resumes/'
  },
  
  // 缓存设置
  CACHE: {
    salaryDataTTL: 24 * 60 * 60 * 1000, // 24小时
    marketInsightsTTL: 7 * 24 * 60 * 60 * 1000, // 7天
    candidateDataTTL: 30 * 24 * 60 * 60 * 1000 // 30天
  },
  
  // 自动化设置
  AUTOMATION: {
    autoScreening: true,
    autoStatusUpdate: true,
    autoNotification: true,
    autoBackup: true
  },
  
  // 安全设置
  SECURITY: {
    sessionTimeout: 8 * 60 * 60 * 1000, // 8小时
    maxLoginAttempts: 5,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    }
  }
};

// 邮件模板
export const EMAIL_TEMPLATES = {
  INTERVIEW_INVITATION: {
    subject: '面试邀请 - {{positionTitle}}',
    template: `
      <h2>面试邀请</h2>
      <p>亲爱的 {{candidateName}}，</p>
      <p>感谢您申请我们的 {{positionTitle}} 职位。经过初步筛选，我们很高兴邀请您参加面试。</p>
      <p><strong>面试详情：</strong></p>
      <ul>
        <li>时间：{{interviewTime}}</li>
        <li>地点：{{interviewLocation}}</li>
        <li>面试官：{{interviewer}}</li>
        <li>联系电话：{{contactPhone}}</li>
      </ul>
      <p>请提前10分钟到达面试地点，并携带身份证和相关证书。</p>
      <p>如有任何问题，请随时联系我们。</p>
      <p>祝好！<br>{{companyName}} 人力资源部</p>
    `
  },
  
  OFFER_LETTER: {
    subject: '工作邀请 - {{positionTitle}}',
    template: `
      <h2>工作邀请</h2>
      <p>亲爱的 {{candidateName}}，</p>
      <p>恭喜！经过综合评估，我们很高兴向您提供 {{positionTitle}} 职位。</p>
      <p><strong>职位详情：</strong></p>
      <ul>
        <li>职位：{{positionTitle}}</li>
        <li>部门：{{department}}</li>
        <li>薪资：{{salary}}</li>
        <li>入职时间：{{startDate}}</li>
      </ul>
      <p>请在 {{offerExpiry}} 前回复确认是否接受此职位。</p>
      <p>我们期待您的加入！</p>
      <p>祝好！<br>{{companyName}} 人力资源部</p>
    `
  },
  
  STATUS_UPDATE: {
    subject: '申请状态更新 - {{positionTitle}}',
    template: `
      <h2>申请状态更新</h2>
      <p>亲爱的 {{candidateName}}，</p>
      <p>您申请的 {{positionTitle}} 职位状态已更新为：{{newStatus}}</p>
      <p>{{statusMessage}}</p>
      <p>如有任何问题，请随时联系我们。</p>
      <p>祝好！<br>{{companyName}} 人力资源部</p>
    `
  }
};

// 短信模板
export const SMS_TEMPLATES = {
  INTERVIEW_REMINDER: '【{{companyName}}】提醒：您有一场面试将在{{time}}开始，地点：{{location}}。请准时参加。',
  OFFER_NOTIFICATION: '【{{companyName}}】恭喜！您已收到我们的工作邀请，请查收邮件了解详情。',
  STATUS_UPDATE: '【{{companyName}}】您的申请状态已更新，请登录系统查看详情。'
};

// 默认设置
export const DEFAULT_SETTINGS = {
  language: 'zh-CN',
  timezone: 'Asia/Shanghai',
  currency: 'CNY',
  dateFormat: 'YYYY-MM-DD',
  timeFormat: 'HH:mm',
  theme: 'light'
};

// 验证配置是否完整
export const validateConfig = () => {
  const errors: string[] = [];
  
  // 检查必要的API密钥
  if (!RECRUITMENT_PLATFORMS.BOSS_ZHIPIN.apiKey && RECRUITMENT_PLATFORMS.BOSS_ZHIPIN.enabled) {
    errors.push('BOSS直聘 API密钥未配置');
  }
  
  if (!NOTIFICATION_SERVICES.EMAIL.SENDGRID.apiKey && NOTIFICATION_SERVICES.EMAIL.SENDGRID.enabled) {
    errors.push('SendGrid API密钥未配置');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// 获取启用的平台列表
export const getEnabledPlatforms = () => {
  return Object.entries(RECRUITMENT_PLATFORMS)
    .filter(([_, config]) => config.enabled)
    .map(([key, config]) => ({ key, ...config }));
};

// 获取启用的通知服务
export const getEnabledNotificationServices = () => {
  const emailServices = Object.entries(NOTIFICATION_SERVICES.EMAIL)
    .filter(([_, config]) => config.enabled)
    .map(([key, config]) => ({ key, type: 'email', ...config }));
    
  const smsServices = Object.entries(NOTIFICATION_SERVICES.SMS)
    .filter(([_, config]) => config.enabled)
    .map(([key, config]) => ({ key, type: 'sms', ...config }));
    
  return [...emailServices, ...smsServices];
};
