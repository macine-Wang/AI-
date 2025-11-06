/**
 * 豆包AI服务 - 用于智能解析简历内容
 * 使用火山方舟豆包大模型进行NLP处理
 */

import axios from 'axios';

// 豆包AI配置接口
interface DoubaoConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

// AI解析结果接口
interface AIParseResult {
  name: string;
  gender: string;
  age?: number;
  phone: string;
  email: string;
  education: Array<{
    degree: string;
    school: string;
    major: string;
    startDate?: string;
    endDate?: string;
  }>;
  workExperience: Array<{
    company: string;
    position: string;
    duration: string;
    startDate?: string;
    endDate?: string;
    responsibilities?: string;
  }>;
  projectExperience: Array<{
    name: string;
    role: string;
    description?: string;
    technologies?: string[];
  }>;
  skills: string[];
  jobIntent?: string;
  selfEvaluation?: string;
}

class DoubaoAIService {
  private config: DoubaoConfig = {
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    apiKey: '', // 需要从环境变量或配置中读取
    model: 'doubao-1-5-thinking-pro-250415'
  };

  constructor() {
    // 从环境变量或localStorage读取API Key
    const apiKey = import.meta.env.VITE_DOUBAO_API_KEY || localStorage.getItem('doubao_api_key') || '';
    if (apiKey) {
      this.config.apiKey = apiKey;
    }
  }

  /**
   * 设置API Key
   */
  public setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
    localStorage.setItem('doubao_api_key', apiKey);
  }

  /**
   * 检查API Key是否已配置
   */
  public hasApiKey(): boolean {
    return !!this.config.apiKey;
  }

  /**
   * 获取API Key状态
   */
  public getApiKeyStatus(): { configured: boolean; masked: string } {
    const configured = this.hasApiKey();
    const masked = configured 
      ? `${this.config.apiKey.substring(0, 8)}...${this.config.apiKey.substring(this.config.apiKey.length - 4)}`
      : '未配置';
    return { configured, masked };
  }

  /**
   * 构建简历解析的Prompt - 优化版
   */
  private buildResumeParsePrompt(ocrText: string): string {
    return `你是一个专业的简历解析AI助手。请仔细分析OCR识别的简历文本，准确提取每个字段的内容。

【核心要求】
1. 严格返回JSON格式，不要有任何多余文字、markdown标记或代码块
2. 姓名必须准确识别，通常在简历开头，是2-4个中文字符
3. 不要把"基本信息"、"个人信息"等标题当作姓名
4. 缺失的字段填空值，不要猜测或编造

【字段提取规则】

1. **姓名识别规则**：
   - 优先查找"姓名："、"姓 名："后的内容
   - 通常是简历开头的独立行
   - 2-4个中文字符，不含标点符号
   - 不要提取"基本信息"、"个人简历"等标题

2. **性别和年龄**：
   - 性别：查找"男"、"女"关键字
   - 年龄：查找"XX岁"、"年龄：XX"或通过出生日期计算

3. **联系方式**：
   - 手机：11位数字，1开头
   - 邮箱：包含@符号的完整邮箱地址

4. **教育背景**（重点）：
   - degree: 学历层次，只能是"博士"、"硕士"、"本科"或"专科"
   - school: 完整的大学名称，如"北京交通大学"
   - major: 专业名称，如"物流工程与管理"
   - 按学历高低排序（博士>硕士>本科>专科）
   - 如果有多个学历，都要提取

5. **工作经历**：
   - company: 完整公司名称
   - position: 职位名称
   - duration: 工作时长，如"2年"、"1.5年"
   - responsibilities: 主要职责和成果，简洁概括

6. **技能提取**（关键）：
   - 提取所有编程语言：Python, Java, SQL, JavaScript等
   - 提取工具软件：Excel, Word, SAP, Tableau, Office等
   - 提取专业技能：数据分析、项目管理、财务分析等
   - 提取证书：ACCA, CPA等
   - 去重，返回字符串数组

7. **核心优势总结**：
   - 在selfEvaluation字段中简洁概括候选人的3-5个核心优势
   - 包括：专业背景、工作经验、技能特长、项目经验等

【OCR原文】
${ocrText}

【返回JSON格式】（严格遵守，不要添加注释）
{
  "name": "姓名（2-4个中文字）",
  "gender": "男/女/未知",
  "age": 25,
  "phone": "11位手机号",
  "email": "邮箱地址",
  "education": [
    {
      "degree": "硕士",
      "school": "完整大学名称",
      "major": "专业名称",
      "startDate": "2020.09",
      "endDate": "2023.06"
    }
  ],
  "workExperience": [
    {
      "company": "公司名称",
      "position": "职位",
      "duration": "2年",
      "startDate": "2021.07",
      "endDate": "2023.07",
      "responsibilities": "工作内容概括"
    }
  ],
  "projectExperience": [
    {
      "name": "项目名称",
      "role": "项目角色",
      "description": "项目描述",
      "technologies": ["技术1", "技术2"]
    }
  ],
  "skills": ["Python", "SQL", "Excel", "数据分析"],
  "jobIntent": "期望职位",
  "selfEvaluation": "核心优势概括（3-5点）"
}`;
  }

  /**
   * 使用豆包AI解析简历文本
   */
  public async parseResumeWithAI(ocrText: string): Promise<AIParseResult> {
    if (!this.hasApiKey()) {
      throw new Error('豆包AI API Key未配置，请先设置API Key');
    }

    try {
      const textLength = ocrText.length;
      console.log(`开始调用豆包AI解析简历... (文本长度: ${textLength} 字符)`);
      
      // 如果文本过长，截断并警告
      const maxLength = 10000;
      const processText = textLength > maxLength
        ? ocrText.substring(0, maxLength) + '\n\n[文本已截断...]'
        : ocrText;
      
      if (textLength > maxLength) {
        console.warn(`简历文本过长(${textLength}字符)，截取前${maxLength}字符处理`);
      }
      
      const response = await axios.post(
        `${this.config.baseUrl}/chat/completions`,
        {
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: '你是一个专业的简历解析助手，擅长从OCR文本中准确提取结构化信息。请严格按照JSON格式返回结果，不要包含任何额外的解释或markdown格式。'
            },
            {
              role: 'user',
              content: this.buildResumeParsePrompt(processText)
            }
          ],
          temperature: 0.1, // 降低温度以获得更稳定的输出
          max_tokens: 4000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 120000 // 120秒超时（增加到2分钟，处理长简历）
        }
      );

      console.log('豆包AI响应:', response.data);

      // 提取AI返回的内容
      const aiContent = response.data.choices[0]?.message?.content;
      
      if (!aiContent) {
        throw new Error('AI返回内容为空');
      }

      // 清理可能的markdown代码块标记
      let jsonContent = aiContent.trim();
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonContent.startsWith('```')) {
        jsonContent = jsonContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      // 解析JSON
      const parsedResult: AIParseResult = JSON.parse(jsonContent);

      console.log('AI解析结果:', parsedResult);

      // 数据清洗和验证
      return this.cleanAndValidateResult(parsedResult);

    } catch (error: any) {
      console.error('豆包AI解析失败:', error);
      
      if (error.code === 'ECONNABORTED') {
        console.warn('AI解析超时，可能因为简历内容过长或网络延迟');
        throw new Error('AI解析超时(2分钟)，已自动降级到基础解析');
      } else if (error.response) {
        const errorMsg = error.response.data?.error?.message || error.response.statusText;
        throw new Error(`豆包AI API调用失败: ${errorMsg}`);
      } else if (error instanceof SyntaxError) {
        throw new Error('AI返回的JSON格式无效，请重试');
      } else {
        throw new Error(`简历AI解析失败: ${error.message}`);
      }
    }
  }

  /**
   * 清洗和验证AI返回的结果
   */
  private cleanAndValidateResult(result: any): AIParseResult {
    // 确保所有必需字段存在
    const cleaned: AIParseResult = {
      name: result.name || '',
      gender: result.gender || '未知',
      age: result.age ? parseInt(result.age) : undefined,
      phone: result.phone || '',
      email: result.email || '',
      education: Array.isArray(result.education) ? result.education : [],
      workExperience: Array.isArray(result.workExperience) ? result.workExperience : [],
      projectExperience: Array.isArray(result.projectExperience) ? result.projectExperience : [],
      skills: Array.isArray(result.skills) ? result.skills : [],
      jobIntent: result.jobIntent || '',
      selfEvaluation: result.selfEvaluation || ''
    };

    // 清理电话号码（只保留数字）
    if (cleaned.phone) {
      cleaned.phone = cleaned.phone.replace(/\D/g, '');
      if (cleaned.phone.length !== 11) {
        cleaned.phone = ''; // 如果不是11位，清空
      }
    }

    // 清理邮箱格式
    if (cleaned.email && !cleaned.email.includes('@')) {
      cleaned.email = '';
    }

    // 去重技能
    cleaned.skills = [...new Set(cleaned.skills.filter(s => s && s.trim()))];

    return cleaned;
  }

  /**
   * 流式解析简历（用于实时显示解析进度）
   */
  public async parseResumeWithAIStream(
    ocrText: string,
    onProgress: (chunk: string) => void
  ): Promise<AIParseResult> {
    if (!this.hasApiKey()) {
      throw new Error('豆包AI API Key未配置，请先设置API Key');
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: '你是一个专业的简历解析助手，擅长从OCR文本中准确提取结构化信息。请严格按照JSON格式返回结果。'
            },
            {
              role: 'user',
              content: this.buildResumeParsePrompt(ocrText)
            }
          ],
          temperature: 0.1,
          max_tokens: 4000,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应流');
      }

      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.substring(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || '';
              if (content) {
                fullContent += content;
                onProgress(content);
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }

      // 清理并解析最终结果
      let jsonContent = fullContent.trim();
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonContent.startsWith('```')) {
        jsonContent = jsonContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const parsedResult: AIParseResult = JSON.parse(jsonContent);
      return this.cleanAndValidateResult(parsedResult);

    } catch (error: any) {
      console.error('豆包AI流式解析失败:', error);
      throw new Error(`简历AI流式解析失败: ${error.message}`);
    }
  }
}

// 导出单例
export const doubaoAI = new DoubaoAIService();

