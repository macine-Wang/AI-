/**
 * 阿里云OCR服务
 * 高精版OCR文字识别
 */

import axios from 'axios';

interface OCRConfig {
  appCode: string;
  requestUrl: string;
  maxCalls: number;
}

interface OCRParams {
  img?: string;
  url?: string;
  prob?: boolean;
  charInfo?: boolean;
  rotate?: boolean;
  table?: boolean;
  sortPage?: boolean;
  noStamp?: boolean;
  figure?: boolean;
  row?: boolean;
  paragraph?: boolean;
  oricoord?: boolean;
}

interface OCRResponse {
  success: boolean;
  data?: {
    ret: Array<{
      word: string;
      prob: number;
      rect: {
        left: number;
        top: number;
        width: number;
        height: number;
      };
    }>;
    prism_version: string;
    prism_wnum: number;
    prism_wordsInfo?: any[];
  };
  message?: string;
  requestId?: string;
}

export class AliyunOCRService {
  private config: OCRConfig = {
    appCode: '340dde6ffb2f4ea9913bdd65d24397dd',
    requestUrl: 'https://gjbsb.market.alicloudapi.com/ocrservice/advanced',
    maxCalls: 500
  };

  private callCount: number = 0;

  constructor() {
    this.loadCallCount();
  }

  /**
   * 从localStorage加载调用次数
   */
  private loadCallCount(): void {
    const savedCount = localStorage.getItem('aliyun_ocr_call_count');
    this.callCount = savedCount ? parseInt(savedCount) : 0;
  }

  /**
   * 保存调用次数到localStorage
   */
  private saveCallCount(): void {
    localStorage.setItem('aliyun_ocr_call_count', this.callCount.toString());
  }

  /**
   * 获取剩余调用次数
   */
  public getRemainingCalls(): number {
    return this.config.maxCalls - this.callCount;
  }

  /**
   * 获取已使用次数
   */
  public getUsedCalls(): number {
    return this.callCount;
  }

  /**
   * 获取总次数
   */
  public getTotalCalls(): number {
    return this.config.maxCalls;
  }

  /**
   * 重置调用次数（管理员功能）
   */
  public resetCallCount(): void {
    this.callCount = 0;
    this.saveCallCount();
  }

  /**
   * 将File转换为base64
   */
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        // 移除 data:application/pdf;base64, 前缀
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
  }

  /**
   * PDF转图片（使用pdf.js）
   */
  private async pdfToImages(file: File): Promise<string[]> {
    // 动态导入pdf.js
    const pdfjsLib = await import('pdfjs-dist');

    // 设置worker路径 - 使用多个CDN源确保可用性
    const version = pdfjsLib.version || '4.10.38';
    
    // pdfjs-dist 4.x版本使用.mjs格式的worker
    // 按优先级尝试不同的CDN源
    const workerSources = [
      `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`,
      `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.mjs`,
      `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.mjs`
    ];
    
    // 使用第一个CDN源（unpkg通常最稳定）
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSources[0];

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
      const images: string[] = [];
      
      // 遍历每一页
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 }); // 提高分辨率
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
        
        // 转换为base64
        const base64 = canvas.toDataURL('image/png').split(',')[1];
        images.push(base64);
      }
      
      return images;
    } catch (error: any) {
      // 如果第一个CDN失败，尝试其他CDN源
      if (error.message && (error.message.includes('worker') || error.message.includes('Failed to fetch'))) {
        console.warn('第一个worker源失败，尝试备用源...', error.message);
        
        // 重新读取文件（因为之前的arrayBuffer可能已失效）
        const fileBuffer = await file.arrayBuffer();
        
        for (let i = 1; i < workerSources.length; i++) {
          try {
            pdfjsLib.GlobalWorkerOptions.workerSrc = workerSources[i];
            console.log(`尝试worker源 ${i + 1}: ${workerSources[i]}`);
            const pdf = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
            
            const images: string[] = [];
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
              const page = await pdf.getPage(pageNum);
              const viewport = page.getViewport({ scale: 2.0 });
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d')!;
              canvas.width = viewport.width;
              canvas.height = viewport.height;
              
              await page.render({
                canvasContext: context,
                viewport: viewport
              }).promise;
              
              const base64 = canvas.toDataURL('image/png').split(',')[1];
              images.push(base64);
            }
            
            return images;
          } catch (retryError) {
            if (i === workerSources.length - 1) {
              throw new Error(`所有worker源都失败，最后一个错误: ${retryError}`);
            }
            continue;
          }
        }
      }
      throw error;
    }
  }

  /**
   * 调用OCR识别
   */
  private async callOCR(params: OCRParams): Promise<OCRResponse> {
    // 检查剩余次数
    if (this.getRemainingCalls() <= 0) {
      throw new Error('OCR调用次数已用完！当前已使用500次。');
    }

    try {
      const response = await axios.post(
        this.config.requestUrl,
        params,
        {
          headers: {
            'Authorization': `APPCODE ${this.config.appCode}`,
            'Content-Type': 'application/json; charset=UTF-8'
          },
          timeout: 30000 // 30秒超时
        }
      );

      // 增加调用次数
      this.callCount++;
      this.saveCallCount();

      // 记录响应数据以便调试
      console.log('OCR API响应:', {
        status: response.status,
        dataKeys: Object.keys(response.data || {}),
        hasRet: !!response.data?.ret,
        retType: Array.isArray(response.data?.ret) ? 'array' : typeof response.data?.ret,
        retLength: Array.isArray(response.data?.ret) ? response.data.ret.length : 'N/A'
      });

      return {
        success: true,
        data: response.data,
        requestId: response.headers['x-ca-request-id']
      };
    } catch (error: any) {
      console.error('OCR调用失败:', error);
      console.error('错误详情:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      
      // 如果是网络错误，也要计数（因为已经发送请求）
      if (error.response) {
        this.callCount++;
        this.saveCallCount();
      }

      // 检查是否是API返回的错误信息
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.response?.data?.msg
        || error.message 
        || 'OCR识别失败';

      return {
        success: false,
        message: errorMessage,
        data: error.response?.data // 保留原始错误数据以便调试
      };
    }
  }

  /**
   * 识别PDF简历
   */
  public async recognizePDF(file: File, onProgress?: (current: number, total: number) => void): Promise<string> {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      throw new Error('只支持PDF格式的文件');
    }

    try {
      // 1. 将PDF转换为图片
      const images = await this.pdfToImages(file);
      
      if (images.length === 0) {
        throw new Error('PDF转换失败，未能提取到图片');
      }

      console.log(`PDF共${images.length}页，开始OCR识别...`);

      // 2. 对每一页进行OCR识别
      const allText: string[] = [];
      
      for (let i = 0; i < images.length; i++) {
        if (onProgress) {
          onProgress(i + 1, images.length);
        }

        const params: OCRParams = {
          img: images[i],
          prob: true,        // 需要置信度
          charInfo: false,
          rotate: true,      // 自动旋转
          table: true,       // 识别表格
          sortPage: false,
          noStamp: true,     // 去除印章
          figure: false,
          row: true,         // 成行返回
          paragraph: true,   // 分段
          oricoord: true
        };

        const result = await this.callOCR(params);

        if (!result.success || !result.data) {
          console.warn(`第${i + 1}页识别失败:`, result.message);
          continue;
        }

        // 提取文字 - 阿里云OCR返回的数据结构
        let pageText = '';
        
        // 优先使用 prism_wordsInfo（阿里云OCR标准格式）
        if (result.data.prism_wordsInfo && Array.isArray(result.data.prism_wordsInfo)) {
          pageText = result.data.prism_wordsInfo
            .map((item: any) => {
              // prism_wordsInfo 的格式可能是 {word: "文字"} 或直接是字符串
              return typeof item === 'string' ? item : (item.word || item.content || '');
            })
            .filter((word: string) => word && word.trim())
            .join('\n');
        }
        // 备用：使用 ret 字段（如果存在）
        else if (result.data.ret && Array.isArray(result.data.ret)) {
          pageText = result.data.ret
            .map((item: any) => item.word || '')
            .filter((word: string) => word && word.trim())
            .join('\n');
        }
        // 如果都没有，尝试从其他字段提取
        else {
          console.warn(`第${i + 1}页OCR返回数据格式异常:`, {
            hasRet: !!result.data.ret,
            hasPrismWordsInfo: !!result.data.prism_wordsInfo,
            dataKeys: Object.keys(result.data || {})
          });
          
          // 尝试从原始数据中查找文字字段
          const data = result.data as any;
          if (data.words && Array.isArray(data.words)) {
            pageText = data.words
              .map((item: any) => typeof item === 'string' ? item : (item.word || ''))
              .filter((word: string) => word && word.trim())
              .join('\n');
          }
        }
        
        if (pageText && pageText.trim()) {
          allText.push(pageText);
        } else {
          console.warn(`第${i + 1}页未识别到文字内容`);
        }
      }

      // 3. 合并所有页面的文字
      const fullText = allText.join('\n\n=== 分页 ===\n\n');

      return fullText;

    } catch (error: any) {
      console.error('PDF识别失败:', error);
      throw new Error(`PDF识别失败: ${error.message}`);
    }
  }

  /**
   * 识别图片格式的简历
   */
  public async recognizeImage(file: File): Promise<string> {
    try {
      const base64 = await this.fileToBase64(file);

      const params: OCRParams = {
        img: base64,
        prob: true,
        rotate: true,
        table: true,
        noStamp: true,
        row: true,
        paragraph: true,
        oricoord: true
      };

      const result = await this.callOCR(params);

      if (!result.success || !result.data) {
        throw new Error(result.message || '图片识别失败');
      }

      // 提取文字 - 阿里云OCR返回的数据结构
      let text = '';
      
      // 优先使用 prism_wordsInfo（阿里云OCR标准格式）
      if (result.data.prism_wordsInfo && Array.isArray(result.data.prism_wordsInfo)) {
        text = result.data.prism_wordsInfo
          .map((item: any) => {
            // prism_wordsInfo 的格式可能是 {word: "文字"} 或直接是字符串
            return typeof item === 'string' ? item : (item.word || item.content || '');
          })
          .filter((word: string) => word && word.trim())
          .join('\n');
      }
      // 备用：使用 ret 字段（如果存在）
      else if (result.data.ret && Array.isArray(result.data.ret)) {
        text = result.data.ret
          .map((item: any) => item.word || '')
          .filter((word: string) => word && word.trim())
          .join('\n');
      }
      // 如果都没有，尝试从其他字段提取
      else {
        console.warn('OCR返回数据格式异常:', {
          hasRet: !!result.data.ret,
          hasPrismWordsInfo: !!result.data.prism_wordsInfo,
          dataKeys: Object.keys(result.data || {})
        });
        
        // 尝试从原始数据中查找文字字段
        const data = result.data as any;
        if (data.words && Array.isArray(data.words)) {
          text = data.words
            .map((item: any) => typeof item === 'string' ? item : (item.word || ''))
            .filter((word: string) => word && word.trim())
            .join('\n');
        }
      }

      if (!text || !text.trim()) {
        throw new Error('未识别到文字内容');
      }

      return text;

    } catch (error: any) {
      console.error('图片识别失败:', error);
      throw new Error(`图片识别失败: ${error.message}`);
    }
  }

  /**
   * 自动识别简历（根据文件类型）
   */
  public async recognizeResume(
    file: File, 
    onProgress?: (current: number, total: number) => void
  ): Promise<string> {
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.pdf')) {
      return await this.recognizePDF(file, onProgress);
    } else if (fileName.match(/\.(jpg|jpeg|png|bmp)$/)) {
      return await this.recognizeImage(file);
    } else {
      throw new Error('不支持的文件格式，仅支持PDF、JPG、PNG、BMP');
    }
  }

  /**
   * 从OCR文本中提取简历信息（使用正则和规则）
   * 注意：这是基础版本，建议使用 parseResumeWithAI 获得更高准确率
   */
  public parseResumeFromText(text: string): any {
    const resumeData: any = {
      name: '',
      phone: '',
      email: '',
      gender: '',
      age: undefined,
      education: [],
      workExperience: [],
      projectExperience: [],
      skills: [],
      jobIntent: ''
    };

    // 1. 提取姓名（通常在简历开头）
    const nameMatch = text.match(/姓\s*名[：:]\s*([^\s\n]+)|^([^\s\n]{2,4})$/m);
    if (nameMatch) {
      resumeData.name = nameMatch[1] || nameMatch[2];
    }

    // 2. 提取电话
    const phoneMatch = text.match(/1[3-9]\d{9}/);
    if (phoneMatch) {
      resumeData.phone = phoneMatch[0];
    }

    // 3. 提取邮箱
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) {
      resumeData.email = emailMatch[0];
    }

    // 4. 提取性别
    const genderMatch = text.match(/性\s*别[：:]\s*(男|女)/);
    if (genderMatch) {
      resumeData.gender = genderMatch[1];
    }

    // 5. 提取年龄
    const ageMatch = text.match(/年\s*龄[：:]\s*(\d+)|(\d+)\s*岁/);
    if (ageMatch) {
      resumeData.age = parseInt(ageMatch[1] || ageMatch[2]);
    }

    // 6. 提取教育背景（更详细的匹配）
    const educationPatterns = [
      /(博士|硕士|本科|专科|大专)[\s\S]*?([^\s\n]{2,10}大学|学院|学校)[\s\S]*?([^\s\n]{2,20}专业)/g,
      /([^\s\n]{2,10}大学|学院|学校)[\s\S]*?(博士|硕士|本科|专科|大专)[\s\S]*?([^\s\n]{2,20}专业)/g,
      /(博士|硕士|本科|专科|大专)[\s\S]*?([^\s\n]{2,10}大学|学院|学校)/g
    ];
    
    educationPatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        if (match[1] && match[2]) {
          resumeData.education.push({
            degree: match[1].includes('博士') ? '博士' : 
                   match[1].includes('硕士') ? '硕士' : 
                   match[1].includes('本科') ? '本科' : '专科',
            school: match[2] || '未知',
            major: match[3] || '未知'
          });
        }
      });
    });
    
    // 如果没有匹配到，尝试简单匹配
    if (resumeData.education.length === 0) {
      const simpleEducationMatch = text.match(/(博士|硕士|本科|专科|大专)/);
      if (simpleEducationMatch) {
        resumeData.education.push({
          degree: simpleEducationMatch[1],
          school: '未知',
          major: '未知'
        });
      }
    }

    // 7. 提取工作经历（简单匹配）
    const workExpPattern = /([^\s\n]{2,20}(公司|企业|集团))[\s\S]*?([^\s\n]{2,20}(工程师|开发|经理|主管|专员))/g;
    const workMatches = [...text.matchAll(workExpPattern)];
    workMatches.forEach(match => {
      resumeData.workExperience.push({
        company: match[1] || '未知',
        position: match[3] || '未知',
        duration: '未知'
      });
    });

    // 8. 提取项目经验（简单匹配）
    const projectPattern = /项目[：:]([^\s\n]{2,30})|([^\s\n]{2,30})项目/g;
    const projectMatches = [...text.matchAll(projectPattern)];
    projectMatches.forEach(match => {
      resumeData.projectExperience.push({
        name: match[1] || match[2] || '未知',
        role: '未知'
      });
    });

    // 9. 提取技能关键词（返回数组格式）
    const skillKeywords = ['Java', 'Python', 'JavaScript', 'React', 'Vue', 'Angular', 
                          'Node.js', 'SQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes',
                          'Spring', 'Django', 'Flask', 'Express', 'TypeScript', 'Go',
                          'C++', 'C#', '.NET', 'PHP', 'Ruby', 'Swift', 'Kotlin'];
    
    skillKeywords.forEach(skill => {
      if (text.includes(skill)) {
        resumeData.skills.push(skill);
      }
    });

    // 去重
    resumeData.skills = [...new Set(resumeData.skills)];

    // 10. 提取求职意向
    const jobIntentMatch = text.match(/求职意向[：:]([^\s\n]+)|期望职位[：:]([^\s\n]+)/);
    if (jobIntentMatch) {
      resumeData.jobIntent = jobIntentMatch[1] || jobIntentMatch[2];
    }

    return resumeData;
  }

  /**
   * 使用AI增强的简历解析（推荐使用）
   * 结合OCR识别和豆包AI进行智能解析
   */
  public async parseResumeWithAI(text: string): Promise<any> {
    // 动态导入豆包AI服务
    const { doubaoAI } = await import('./doubaoAI');
    
    if (!doubaoAI.hasApiKey()) {
      console.warn('豆包AI未配置，使用基础正则解析');
      return this.parseResumeFromText(text);
    }

    try {
      console.log('使用豆包AI进行智能解析...');
      const aiResult = await doubaoAI.parseResumeWithAI(text);
      return aiResult;
    } catch (error) {
      console.error('AI解析失败，降级使用正则解析:', error);
      return this.parseResumeFromText(text);
    }
  }
}

// 导出单例
export const aliyunOCR = new AliyunOCRService();

