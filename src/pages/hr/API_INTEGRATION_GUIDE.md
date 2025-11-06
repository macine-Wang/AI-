# 简历筛选模块 - API集成指南

## 📋 概述

本文档详细说明如何将简历筛选模块与各种外部API服务集成，实现完整的OCR识别、AI解析和智能评分功能。

---

## 🔧 需要的外部服务

### 1. OCR文档识别服务

#### 推荐方案一：百度AI OCR（推荐）

**优势：**
- 中文识别准确率高（98%+）
- 价格实惠（每月免费1000次）
- 文档齐全，易于集成

**申请地址：** https://ai.baidu.com/tech/ocr

**API调用示例：**

```typescript
// src/services/baiduOCR.ts
import axios from 'axios';

interface OCRResult {
  words: string;
  confidence: number;
  location: { left: number; top: number; width: number; height: number };
}

export class BaiduOCRService {
  private accessToken: string = '';
  private API_KEY = process.env.REACT_APP_BAIDU_API_KEY;
  private SECRET_KEY = process.env.REACT_APP_BAIDU_SECRET_KEY;

  // 获取Access Token
  async getAccessToken(): Promise<string> {
    const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${this.API_KEY}&client_secret=${this.SECRET_KEY}`;
    
    const response = await axios.post(url);
    this.accessToken = response.data.access_token;
    return this.accessToken;
  }

  // 通用文字识别
  async generalOCR(imageBase64: string): Promise<OCRResult[]> {
    if (!this.accessToken) {
      await this.getAccessToken();
    }

    const url = `https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${this.accessToken}`;
    
    const response = await axios.post(url, {
      image: imageBase64
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return response.data.words_result;
  }

  // 表格识别（识别简历中的表格内容）
  async tableOCR(imageBase64: string): Promise<any> {
    if (!this.accessToken) {
      await this.getAccessToken();
    }

    const url = `https://aip.baidubce.com/rest/2.0/solution/v1/form_ocr/request?access_token=${this.accessToken}`;
    
    const response = await axios.post(url, {
      image: imageBase64
    });

    return response.data;
  }

  // PDF文件OCR
  async pdfOCR(pdfBase64: string): Promise<any> {
    if (!this.accessToken) {
      await this.getAccessToken();
    }

    const url = `https://aip.baidubce.com/rest/2.0/ocr/v1/pdf?access_token=${this.accessToken}`;
    
    const response = await axios.post(url, {
      pdf_file: pdfBase64
    });

    return response.data;
  }
}
```

**费用：**
- 免费额度：1000次/月
- 付费价格：0.005元/次

---

#### 推荐方案二：腾讯云OCR

**优势：**
- 识别速度快
- 支持多种证件和文档类型
- 企业级稳定性

**申请地址：** https://cloud.tencent.com/product/ocr

**API调用示例：**

```typescript
// src/services/tencentOCR.ts
import tencentcloud from 'tencentcloud-sdk-nodejs';

const OcrClient = tencentcloud.ocr.v20181119.Client;

export class TencentOCRService {
  private client: any;

  constructor() {
    const clientConfig = {
      credential: {
        secretId: process.env.REACT_APP_TENCENT_SECRET_ID,
        secretKey: process.env.REACT_APP_TENCENT_SECRET_KEY,
      },
      region: "ap-beijing",
      profile: {
        httpProfile: {
          endpoint: "ocr.tencentcloudapi.com",
        },
      },
    };
    
    this.client = new OcrClient(clientConfig);
  }

  // 通用文字识别
  async generalOCR(imageBase64: string): Promise<any> {
    const params = {
      ImageBase64: imageBase64,
    };

    return await this.client.GeneralBasicOCR(params);
  }

  // 快速文本识别
  async fastOCR(imageBase64: string): Promise<any> {
    const params = {
      ImageBase64: imageBase64,
    };

    return await this.client.GeneralFastOCR(params);
  }
}
```

**费用：**
- 免费额度：1000次/月
- 付费价格：0.005元/次

---

### 2. AI简历解析服务

#### 推荐方案一：OpenAI GPT-4 API（最强大）

**优势：**
- 理解能力最强
- 提取准确度高（95%+）
- 支持复杂格式

**申请地址：** https://platform.openai.com/

**API调用示例：**

```typescript
// src/services/openaiParser.ts
import OpenAI from 'openai';

export class OpenAIResumeParser {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    });
  }

  async parseResume(resumeText: string, jobDescription?: string): Promise<any> {
    const systemPrompt = `你是一个专业的简历解析助手。请从简历文本中提取以下结构化信息，以JSON格式返回：

{
  "basicInfo": {
    "name": "姓名",
    "gender": "性别（男/女）",
    "age": 年龄（数字）,
    "phone": "电话",
    "email": "邮箱",
    "currentLocation": "现居地",
    "expectedSalary": 期望薪资（数字，单位：元/月）,
    "currentSalary": 当前薪资（数字，单位：元/月）
  },
  "education": [
    {
      "school": "学校名称",
      "major": "专业",
      "degree": "学历（博士/硕士/本科/专科）",
      "startDate": "开始日期 YYYY-MM",
      "endDate": "结束日期 YYYY-MM",
      "gpa": GPA（可选），
      "ranking": "排名（可选）",
      "schoolType": "院校类型（985/211/双一流/普通本科/专科/其他）"
    }
  ],
  "workExperience": [
    {
      "company": "公司名称",
      "position": "职位",
      "startDate": "开始日期 YYYY-MM",
      "endDate": "结束日期 YYYY-MM 或 至今",
      "description": "工作描述",
      "achievements": ["成就1", "成就2"],
      "isBigCompany": 是否为知名大公司（true/false）
    }
  ],
  "projects": [
    {
      "name": "项目名称",
      "role": "角色",
      "startDate": "开始日期",
      "endDate": "结束日期",
      "techStack": ["技术1", "技术2"],
      "description": "项目描述",
      "achievements": ["成果1", "成果2"]
    }
  ],
  "skills": {
    "professionalSkills": ["技能1", "技能2"],
    "languages": [{"language": "语言", "level": "水平"}],
    "certificates": ["证书1", "证书2"]
  },
  "selfEvaluation": "自我评价",
  "advantages": ["优势1", "优势2"],
  "awards": ["奖项1", "奖项2"],
  "expectedPosition": "期望职位",
  "availableDate": "到岗时间",
  "totalWorkYears": 总工作年限（计算得出）
}

请仔细分析简历，准确提取所有信息。如果某些字段没有提到，则返回null或空数组。`;

    const userPrompt = jobDescription
      ? `简历内容：\n${resumeText}\n\n岗位要求（用于匹配评估）：\n${jobDescription}`
      : `简历内容：\n${resumeText}`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const parsedData = JSON.parse(response.choices[0].message.content || '{}');
    
    // 计算工作年限
    if (parsedData.workExperience && parsedData.workExperience.length > 0) {
      parsedData.totalWorkYears = this.calculateWorkYears(parsedData.workExperience);
    }

    return parsedData;
  }

  // 评分和匹配
  async scoreResume(resumeData: any, jobDescription: string): Promise<any> {
    const scoringPrompt = `你是一个专业的HR。请根据以下简历数据和岗位要求，进行多维度评分（0-100分）：

简历数据：
${JSON.stringify(resumeData, null, 2)}

岗位要求：
${jobDescription}

请返回以下JSON格式的评分结果：
{
  "educationScore": 学历评分（0-100），
  "experienceMatchScore": 经验匹配度（0-100），
  "skillMatchScore": 技能匹配度（0-100），
  "stabilityScore": 稳定性评分（0-100），
  "growthScore": 成长性评分（0-100），
  "highlights": ["亮点1", "亮点2"],
  "risks": ["风险点1", "风险点2"],
  "recommendation": "推荐理由或不推荐理由"
}`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "user", content: scoringPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }

  // 计算工作年限
  private calculateWorkYears(workExperience: any[]): number {
    let totalMonths = 0;
    
    for (const exp of workExperience) {
      const start = new Date(exp.startDate);
      const end = exp.endDate === '至今' ? new Date() : new Date(exp.endDate);
      
      const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                     (end.getMonth() - start.getMonth());
      totalMonths += months;
    }
    
    return Math.round(totalMonths / 12 * 10) / 10;
  }

  // 检测简历异常
  async detectAnomalies(resumeData: any): Promise<string[]> {
    const warnings: string[] = [];

    // 检查工作时间重叠
    const experiences = resumeData.workExperience || [];
    for (let i = 0; i < experiences.length - 1; i++) {
      const current = new Date(experiences[i].endDate);
      const next = new Date(experiences[i + 1].startDate);
      
      if (current > next) {
        warnings.push('工作时间存在重叠，可能存在兼职或信息错误');
      }
    }

    // 检查频繁跳槽
    if (experiences.length > 0) {
      const avgMonths = resumeData.totalWorkYears * 12 / experiences.length;
      if (avgMonths < 12) {
        warnings.push('平均每份工作不足1年，跳槽频率较高');
      }
    }

    // 检查薪资异常
    if (resumeData.basicInfo?.expectedSalary && 
        resumeData.basicInfo?.currentSalary &&
        resumeData.basicInfo.expectedSalary > resumeData.basicInfo.currentSalary * 2) {
      warnings.push('期望薪资涨幅超过100%，可能期望过高');
    }

    return warnings;
  }
}
```

**费用：**
- GPT-4: $0.03/1K tokens (输入), $0.06/1K tokens (输出)
- GPT-3.5: $0.0015/1K tokens (输入), $0.002/1K tokens (输出)
- 每份简历大约消耗: 2000-4000 tokens
- 预估成本: $0.1-0.3/份简历（GPT-4）

---

#### 推荐方案二：Claude API（Anthropic）

**优势：**
- 长文本处理能力强
- 价格相对较低
- 输出稳定

**申请地址：** https://www.anthropic.com/

**API调用示例：**

```typescript
// src/services/claudeParser.ts
import Anthropic from '@anthropic-ai/sdk';

export class ClaudeResumeParser {
  private anthropic: Anthropic;

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.REACT_APP_CLAUDE_API_KEY,
    });
  }

  async parseResume(resumeText: string): Promise<any> {
    const message = await this.anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `请从以下简历文本中提取结构化信息，返回JSON格式...\n\n${resumeText}`
        }
      ]
    });

    return JSON.parse(message.content[0].text);
  }
}
```

**费用：**
- Claude 3 Opus: $15/1M输入tokens, $75/1M输出tokens
- Claude 3 Sonnet: $3/1M输入tokens, $15/1M输出tokens

---

#### 推荐方案三：国产大模型（文心一言/通义千问）

**文心一言（百度）：**
- 网址：https://yiyan.baidu.com/
- 中文理解能力强
- 价格实惠

**通义千问（阿里）：**
- 网址：https://tongyi.aliyun.com/
- 阿里云生态集成好
- 企业级支持

```typescript
// src/services/qwenParser.ts （通义千问示例）
import axios from 'axios';

export class QwenResumeParser {
  private apiKey = process.env.REACT_APP_QWEN_API_KEY;

  async parseResume(resumeText: string): Promise<any> {
    const response = await axios.post(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
      {
        model: "qwen-turbo",
        input: {
          prompt: `请解析以下简历...\n${resumeText}`
        },
        parameters: {
          result_format: "message"
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  }
}
```

---

### 3. 专业简历解析服务（可选）

#### 大简云

**特点：**
- 专业简历解析，准确率高
- 支持100+种简历格式
- 提供API和SDK

**网址：** http://www.dajianyun.com/

**费用：** 0.2-0.5元/份

---

## 💾 数据存储方案

### 方案一：MongoDB（推荐）

```typescript
// src/models/Resume.ts
import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
  fileName: String,
  fileUrl: String,
  fileType: String,
  uploadTime: Date,
  
  basicInfo: {
    name: String,
    gender: String,
    age: Number,
    phone: String,
    email: String,
    currentLocation: String,
    expectedSalary: Number,
    currentSalary: Number
  },
  
  education: [{
    school: String,
    major: String,
    degree: String,
    startDate: String,
    endDate: String,
    gpa: Number,
    schoolType: String
  }],
  
  workExperience: [{
    company: String,
    position: String,
    startDate: String,
    endDate: String,
    description: String,
    achievements: [String],
    isBigCompany: Boolean
  }],
  
  projects: [{
    name: String,
    role: String,
    startDate: String,
    endDate: String,
    techStack: [String],
    description: String,
    achievements: [String]
  }],
  
  skills: {
    professionalSkills: [String],
    languages: [{
      language: String,
      level: String
    }],
    certificates: [String]
  },
  
  totalWorkYears: Number,
  
  parseQuality: {
    overallConfidence: Number,
    fieldConfidence: Map,
    missingFields: [String],
    warnings: [String]
  },
  
  scoring: {
    educationScore: Number,
    experienceMatchScore: Number,
    skillMatchScore: Number,
    stabilityScore: Number,
    growthScore: Number,
    totalScore: Number,
    weights: Map,
    highlights: [String],
    risks: [String]
  },
  
  tags: [String],
  status: String,
  starred: Boolean,
  notes: String
});

export const Resume = mongoose.model('Resume', ResumeSchema);
```

---

## 🔄 完整集成流程

### 步骤1：文件上传

```typescript
// src/services/resumeService.ts
export class ResumeService {
  private ocrService: BaiduOCRService;
  private aiParser: OpenAIResumeParser;

  async uploadAndParseResume(file: File, jobDescription: string) {
    // 1. 上传文件到云存储（OSS/S3）
    const fileUrl = await this.uploadToCloud(file);

    // 2. 转换为Base64或图片
    const base64 = await this.fileToBase64(file);

    // 3. OCR识别
    let resumeText = '';
    if (file.type === 'application/pdf') {
      resumeText = await this.ocrService.pdfOCR(base64);
    } else {
      resumeText = await this.ocrService.generalOCR(base64);
    }

    // 4. AI解析
    const parsedData = await this.aiParser.parseResume(resumeText, jobDescription);

    // 5. 智能评分
    const scoring = await this.aiParser.scoreResume(parsedData, jobDescription);

    // 6. 异常检测
    const warnings = await this.aiParser.detectAnomalies(parsedData);

    // 7. 组装完整数据
    const resumeData = {
      ...parsedData,
      fileName: file.name,
      fileUrl,
      fileType: file.type,
      uploadTime: new Date(),
      scoring: {
        ...scoring,
        totalScore: this.calculateTotalScore(scoring)
      },
      parseQuality: {
        overallConfidence: this.calculateConfidence(parsedData),
        warnings
      }
    };

    // 8. 保存到数据库
    await this.saveToDatabase(resumeData);

    return resumeData;
  }

  private calculateTotalScore(scoring: any): number {
    const weights = {
      education: 0.2,
      experience: 0.25,
      skill: 0.35,
      stability: 0.1,
      growth: 0.1
    };

    return Math.round(
      scoring.educationScore * weights.education +
      scoring.experienceMatchScore * weights.experience +
      scoring.skillMatchScore * weights.skill +
      scoring.stabilityScore * weights.stability +
      scoring.growthScore * weights.growth
    );
  }

  private calculateConfidence(data: any): number {
    // 根据提取字段的完整性计算置信度
    let score = 0;
    let total = 0;

    // 基础信息
    if (data.basicInfo?.name) score += 20;
    total += 20;

    if (data.basicInfo?.phone) score += 10;
    total += 10;

    if (data.basicInfo?.email) score += 10;
    total += 10;

    // 教育背景
    if (data.education?.length > 0) score += 20;
    total += 20;

    // 工作经历
    if (data.workExperience?.length > 0) score += 20;
    total += 20;

    // 技能
    if (data.skills?.professionalSkills?.length > 0) score += 20;
    total += 20;

    return Math.round((score / total) * 100);
  }
}
```

---

## 📊 成本估算

### 按1000份简历/月计算：

**方案一：百度OCR + OpenAI GPT-4**
- OCR成本：免费（1000次内）
- AI解析：$100-300
- **总成本：$100-300/月（约700-2100元）**

**方案二：百度OCR + GPT-3.5**
- OCR成本：免费
- AI解析：$10-20
- **总成本：$10-20/月（约70-140元）**

**方案三：百度OCR + 通义千问**
- OCR成本：免费
- AI解析：约50-100元
- **总成本：约50-100元/月**

**方案四：专业简历解析服务**
- 大简云：200-500元/月
- **总成本：200-500元/月**

---

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install openai @anthropic-ai/sdk axios mongoose
npm install --save-dev @types/node
```

### 2. 配置环境变量

```env
# .env
REACT_APP_BAIDU_API_KEY=your_api_key
REACT_APP_BAIDU_SECRET_KEY=your_secret_key
REACT_APP_OPENAI_API_KEY=your_openai_key
REACT_APP_CLAUDE_API_KEY=your_claude_key
REACT_APP_MONGODB_URI=mongodb://localhost:27017/recruitment
```

### 3. 使用示例

```typescript
import { ResumeService } from './services/resumeService';

const resumeService = new ResumeService();

// 上传并解析简历
const handleUpload = async (file: File) => {
  const jobDescription = `
    招聘前端开发工程师
    要求：
    - 本科及以上学历
    - 3年以上工作经验
    - 熟悉React/Vue
    - 有大型项目经验
  `;

  const result = await resumeService.uploadAndParseResume(file, jobDescription);
  console.log('解析结果：', result);
};
```

---

## 📞 技术支持

如需帮助，请联系：
- 邮箱：tech@example.com
- 技术文档：查看各服务商官方文档

---

**祝集成顺利！** 🎯

