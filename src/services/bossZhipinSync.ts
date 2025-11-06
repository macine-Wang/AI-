/**
 * BOSS直聘职位同步服务
 * 通过公司名称搜索并同步BOSS直聘上的职位信息
 */

import { JobPosition } from '@/types/recruitment';
import { RecruitmentAPI } from './recruitmentApi';


export class BossZhipinSyncService {
  private static readonly SEARCH_BASE = 'https://www.zhipin.com';

  /**
   * 生成BOSS直聘公司搜索URL
   */
  static generateCompanySearchUrl(companyName: string): string {
    const encodedCompanyName = encodeURIComponent(companyName);
    return `${this.SEARCH_BASE}/web/geek/job?query=${encodedCompanyName}&city=100010000&experience=&degree=&industry=&scale=&stage=&position=&salary=&multiBusinessDistrict=&page=1`;
  }

  /**
   * 生成BOSS直聘职位详情URL
   */
  static generateJobDetailUrl(jobId: string): string {
    return `${this.SEARCH_BASE}/job_detail/${jobId}.html`;
  }

  /**
   * 从手动输入的数据解析职位信息
   * 支持从复制的HTML或文本中提取职位信息
   */
  static parseJobFromText(text: string, companyName: string): Partial<JobPosition> | null {
    try {
      // 创建临时DOM元素来解析HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      
      // 尝试从HTML中提取职位信息
      const jobTitle = doc.querySelector('.job-name, .job-title, h1, .name')?.textContent?.trim() || 
                      this.extractField(text, ['职位', '岗位', 'Job', 'Title']);
      
      if (!jobTitle) {
        return null;
      }

      // 提取薪资
      const salaryText = doc.querySelector('.salary, .job-salary, .money')?.textContent?.trim() ||
                        this.extractField(text, ['薪资', '工资', 'Salary']);
      const salaryRange = this.parseSalaryFromText(salaryText || '');

      // 提取地点
      const location = doc.querySelector('.location, .job-location, .address')?.textContent?.trim() ||
                      this.extractField(text, ['地点', '位置', 'Location', '地址']) ||
                      '北京';

      // 提取经验要求
      const experience = doc.querySelector('.experience, .work-exp')?.textContent?.trim() ||
                        this.extractField(text, ['经验', 'Experience', '工作经验']) ||
                        '经验不限';

      // 提取学历要求
      const education = doc.querySelector('.education, .degree')?.textContent?.trim() ||
                       this.extractField(text, ['学历', 'Education', 'Degree']) ||
                       '学历不限';

      // 提取技能标签
      const skillElements = doc.querySelectorAll('.skill, .tag, .label');
      const skills: string[] = [];
      skillElements.forEach(el => {
        const skill = el.textContent?.trim();
        if (skill) skills.push(skill);
      });
      
      // 如果没有从HTML提取到技能，尝试从文本中提取
      if (skills.length === 0) {
        skills.push(...this.extractSkillsFromText(text));
      }

      // 提取职位描述
      const description = doc.querySelector('.job-desc, .description, .detail')?.textContent?.trim() ||
                         this.extractField(text, ['描述', 'Description', '职位描述', '工作职责']) ||
                         '';

      return {
        title: jobTitle,
        department: this.inferDepartment(jobTitle, skills),
        location: location,
        type: 'full-time',
        level: this.inferLevel(jobTitle, experience),
        education: education,
        experience: experience,
        skills: skills.length > 0 ? skills : [],
        description: description,
        requirements: this.extractRequirements(text),
        benefits: this.extractBenefits(text),
        salaryRange: salaryRange || { min: 0, max: 0, currency: 'CNY' },
        status: 'active',
        priority: 'medium',
        headcount: 1,
        filledCount: 0,
        publishedPlatforms: ['BOSS直聘'],
        tags: [`来源:BOSS直聘`, `公司:${companyName}`]
      };
    } catch (error) {
      console.error('解析职位信息失败:', error);
      return null;
    }
  }

  /**
   * 辅助方法：从文本中提取字段
   */
  private static extractField(text: string, keywords: string[]): string | null {
    for (const keyword of keywords) {
      const regex = new RegExp(`${keyword}[：:]([^\\n\\r]+)`, 'i');
      const match = text.match(regex);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    return null;
  }

  /**
   * 从文本中提取技能标签
   */
  private static extractSkillsFromText(text: string): string[] {
    const skillKeywords = [
      'Java', 'Python', 'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular',
      'Node.js', 'Spring', 'MySQL', 'Redis', 'MongoDB', 'Docker', 'Kubernetes',
      '产品经理', 'UI设计', 'UX设计', '数据分析', '运营', '销售'
    ];
    
    const foundSkills: string[] = [];
    skillKeywords.forEach(skill => {
      if (text.includes(skill)) {
        foundSkills.push(skill);
      }
    });
    
    return foundSkills;
  }

  /**
   * 从文本中解析薪资范围
   */
  private static parseSalaryFromText(salaryText: string): { min: number; max: number; currency: string } | null {
    if (!salaryText) return null;

    // 匹配 "15K-25K" 或 "15-25K" 或 "面议" 等格式
    const match = salaryText.match(/(\d+)\s*[Kk千]?\s*[-~至]?\s*(\d+)?\s*[Kk千]/);
    if (match) {
      const min = parseInt(match[1]) * 1000;
      const max = match[2] ? parseInt(match[2]) * 1000 : min * 1.5;
      return { min, max, currency: 'CNY' };
    }

    // 匹配 "15000-25000" 格式
    const match2 = salaryText.match(/(\d+)\s*[-~至]?\s*(\d+)/);
    if (match2) {
      return {
        min: parseInt(match2[1]),
        max: parseInt(match2[2]),
        currency: 'CNY'
      };
    }

    return null;
  }

  /**
   * 提取任职要求
   */
  private static extractRequirements(text: string): string[] {
    const requirements: string[] = [];
    const reqKeywords = ['任职要求', '职位要求', '要求', 'Requirements'];
    
    reqKeywords.forEach(keyword => {
      const regex = new RegExp(`${keyword}[：:]([\\s\\S]*?)(?:职位描述|工作职责|职责|Description|$)`, 'i');
      const match = text.match(regex);
      if (match && match[1]) {
        const reqText = match[1].trim();
        // 按句号、换行符分割
        reqText.split(/[。\n\r;；]/).forEach(req => {
          const trimmed = req.trim();
          if (trimmed.length > 5) {
            requirements.push(trimmed);
          }
        });
      }
    });

    return requirements.length > 0 ? requirements : [];
  }

  /**
   * 推断部门
   */
  private static inferDepartment(jobTitle: string, skills: string[]): string {
    const titleLower = jobTitle.toLowerCase();
    const skillsLower = skills.join(' ').toLowerCase();

    if (titleLower.includes('前端') || titleLower.includes('前端开发') || 
        titleLower.includes('后端') || titleLower.includes('后端开发') ||
        titleLower.includes('开发') || titleLower.includes('工程师') ||
        skillsLower.includes('java') || skillsLower.includes('python') ||
        skillsLower.includes('react') || skillsLower.includes('vue')) {
      return '技术部';
    }
    
    if (titleLower.includes('产品') || titleLower.includes('pm') || 
        titleLower.includes('产品经理')) {
      return '产品部';
    }
    
    if (titleLower.includes('设计') || titleLower.includes('ui') || 
        titleLower.includes('ux') || titleLower.includes('视觉')) {
      return '设计部';
    }
    
    if (titleLower.includes('运营') || titleLower.includes('内容') ||
        titleLower.includes('活动')) {
      return '运营部';
    }
    
    if (titleLower.includes('市场') || titleLower.includes('营销') ||
        titleLower.includes('推广')) {
      return '市场部';
    }

    return '其他部门';
  }

  /**
   * 推断职位级别
   */
  private static inferLevel(jobTitle: string, experience: string): JobPosition['level'] {
    const titleLower = jobTitle.toLowerCase();
    
    if (titleLower.includes('高级') || titleLower.includes('senior') || 
        experience.includes('5') || experience.includes('10')) {
      return 'senior';
    }
    if (titleLower.includes('初级') || titleLower.includes('junior') || 
        experience.includes('应届')) {
      return 'junior';
    }
    if (titleLower.includes('主管') || titleLower.includes('经理') || 
        titleLower.includes('lead')) {
      return 'lead';
    }
    if (titleLower.includes('总监') || titleLower.includes('manager')) {
      return 'manager';
    }
    
    return 'mid';
  }

  /**
   * 提取福利信息
   */
  private static extractBenefits(text: string): string[] {
    const benefits: string[] = [];
    const benefitKeywords = [
      '五险一金', '六险一金', '年终奖', '股权', '期权',
      '弹性工作', '远程', '年假', '培训', '晋升',
      '餐补', '交通', '住房', ' gym', '健身房', '下午茶'
    ];

    benefitKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        if (keyword === '五险一金' || keyword === '六险一金') {
          benefits.push(keyword);
        } else if (keyword.includes('股权') || keyword.includes('期权')) {
          benefits.push('股权激励');
        } else if (keyword.includes('弹性') || keyword.includes('远程')) {
          benefits.push('弹性工作');
        } else if (keyword.includes('年假')) {
          benefits.push('带薪年假');
        } else if (keyword.includes('培训')) {
          benefits.push('培训机会');
        } else if (keyword.includes('餐补')) {
          benefits.push('餐补');
        } else if (keyword.includes('交通')) {
          benefits.push('交通补贴');
        }
      }
    });

    return [...new Set(benefits)]; // 去重
  }

  /**
   * 手动导入职位信息
   * 从粘贴的文本或HTML中解析并导入职位
   */
  static importJobFromText(text: string, companyName: string): JobPosition | null {
    const jobData = this.parseJobFromText(text, companyName);
    
    if (!jobData || !jobData.title) {
      return null;
    }

    // 生成完整的职位对象
    const job: JobPosition = {
      id: `boss_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: jobData.title!,
      department: jobData.department || '其他部门',
      location: jobData.location || '北京',
      type: jobData.type || 'full-time',
      level: jobData.level || 'mid',
      education: jobData.education || '学历不限',
      experience: jobData.experience || '经验不限',
      skills: jobData.skills || [],
      description: jobData.description || '',
      requirements: jobData.requirements || [],
      benefits: jobData.benefits || [],
      salaryRange: jobData.salaryRange || { min: 0, max: 0, currency: 'CNY' },
      status: 'active',
      priority: jobData.priority || 'medium',
      publishedPlatforms: ['BOSS直聘'],
      createdAt: new Date(),
      updatedAt: new Date(),
      headcount: jobData.headcount || 1,
      filledCount: 0,
      tags: [`来源:BOSS直聘`, `公司:${companyName}`]
    };

    return job;
  }

  /**
   * 批量导入职位
   * 从多段文本中解析多个职位
   */
  static importMultipleJobs(texts: string[], companyName: string): {
    success: JobPosition[];
    failed: string[];
  } {
    const success: JobPosition[] = [];
    const failed: string[] = [];

    texts.forEach((text, index) => {
      try {
        const job = this.importJobFromText(text, companyName);
        if (job) {
          success.push(job);
        } else {
          failed.push(`第${index + 1}个职位解析失败`);
        }
      } catch (error) {
        failed.push(`第${index + 1}个职位导入失败: ${error}`);
      }
    });

    return { success, failed };
  }


  /**
   * 保存导入的职位到本地
   */
  static saveImportedJobs(jobs: JobPosition[]): void {
    jobs.forEach(job => {
      RecruitmentAPI.createPosition(job);
    });
  }
}
