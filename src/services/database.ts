/**
 * SQLite 数据库服务
 * 使用 sql.js (SQLite for JavaScript)
 */

// @ts-ignore - sql.js类型声明问题
import initSqlJs, { Database, SqlJsStatic } from 'sql.js';

interface ResumeRecord {
  id: string;
  fileName: string;
  uploadTime: string;
  ocrText: string;
  parsedData: string; // JSON string
  status: string;
  tags: string; // JSON array string
  totalScore: number;
  educationScore: number;
  experienceScore: number;
  skillScore: number;
  notes: string;
}

interface OCRUsageRecord {
  id: number;
  timestamp: string;
  fileName: string;
  pageCount: number;
  success: boolean;
  errorMessage?: string;
}

export class DatabaseService {
  private SQL: SqlJsStatic | null = null;
  private db: Database | null = null;
  private initialized: boolean = false;

  /**
   * 初始化数据库
   */
  public async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // 加载 sql.js
      this.SQL = await initSqlJs({
        locateFile: (file: string) => `https://sql.js.org/dist/${file}`
      });

      // 尝试从 localStorage 加载已有数据库
      const savedDb = localStorage.getItem('recruitment_db');
      
      if (savedDb) {
        // 恢复已有数据库
        const uint8Array = new Uint8Array(JSON.parse(savedDb));
        this.db = new this.SQL.Database(uint8Array);
        console.log('数据库已从本地存储恢复');
        
        // 检查并创建缺失的表（兼容旧版本数据库）
        this.ensureTablesExist();
      } else {
        // 创建新数据库
        this.db = new this.SQL.Database();
        this.createTables();
        console.log('已创建新数据库');
      }

      this.initialized = true;
    } catch (error) {
      console.error('数据库初始化失败:', error);
      throw error;
    }
  }

  /**
   * 确保所有表都存在（用于数据库升级）
   */
  private ensureTablesExist(): void {
    if (!this.db) return;

    // 检查并创建缺失的表
    const tablesToCheck = [
      {
        name: 'resumes',
        sql: `
          CREATE TABLE IF NOT EXISTS resumes (
            id TEXT PRIMARY KEY,
            fileName TEXT NOT NULL,
            uploadTime TEXT NOT NULL,
            ocrText TEXT,
            parsedData TEXT,
            status TEXT DEFAULT 'pending',
            tags TEXT DEFAULT '[]',
            totalScore REAL DEFAULT 0,
            educationScore REAL DEFAULT 0,
            experienceScore REAL DEFAULT 0,
            skillScore REAL DEFAULT 0,
            notes TEXT
          )
        `
      },
      {
        name: 'ocr_usage',
        sql: `
          CREATE TABLE IF NOT EXISTS ocr_usage (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            fileName TEXT NOT NULL,
            pageCount INTEGER DEFAULT 1,
            success INTEGER DEFAULT 1,
            errorMessage TEXT
          )
        `
      },
      {
        name: 'scoring_templates',
        sql: `
          CREATE TABLE IF NOT EXISTS scoring_templates (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            weights TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL
          )
        `
      },
      {
        name: 'filter_schemes',
        sql: `
          CREATE TABLE IF NOT EXISTS filter_schemes (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            conditions TEXT NOT NULL,
            createdAt TEXT NOT NULL
          )
        `
      },
      {
        name: 'candidates',
        sql: `
          CREATE TABLE IF NOT EXISTS candidates (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            position TEXT,
            source TEXT,
            status TEXT DEFAULT 'new',
            matchScore REAL DEFAULT 0,
            skills TEXT DEFAULT '[]',
            experience TEXT,
            education TEXT,
            expectedSalary REAL,
            currentCompany TEXT,
            resumeUrl TEXT,
            appliedAt TEXT NOT NULL,
            tags TEXT DEFAULT '[]',
            notes TEXT,
            gender TEXT,
            age INTEGER,
            university TEXT,
            is985 INTEGER DEFAULT 0,
            is211 INTEGER DEFAULT 0,
            major TEXT,
            advantages TEXT,
            description TEXT
          )
        `
      },
      {
        name: 'interviews',
        sql: `
          CREATE TABLE IF NOT EXISTS interviews (
            id TEXT PRIMARY KEY,
            candidateId TEXT NOT NULL,
            date TEXT NOT NULL,
            interviewer TEXT,
            round INTEGER DEFAULT 1,
            type TEXT,
            score REAL,
            feedback TEXT,
            status TEXT DEFAULT 'scheduled',
            createdAt TEXT NOT NULL
          )
        `
      },
      {
        name: 'communications',
        sql: `
          CREATE TABLE IF NOT EXISTS communications (
            id TEXT PRIMARY KEY,
            candidateId TEXT NOT NULL,
            type TEXT NOT NULL,
            content TEXT NOT NULL,
            sendAt TEXT NOT NULL,
            template TEXT,
            createdAt TEXT NOT NULL
          )
        `
      },
      {
        name: 'email_templates',
        sql: `
          CREATE TABLE IF NOT EXISTS email_templates (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            subject TEXT NOT NULL,
            content TEXT NOT NULL,
            type TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL
          )
        `
      }
    ];

    tablesToCheck.forEach(table => {
      try {
        this.db!.run(table.sql);
      } catch (error) {
        console.warn(`创建表 ${table.name} 时出错:`, error);
      }
    });

    this.saveToLocalStorage();
  }

  /**
   * 创建数据表
   */
  private createTables(): void {
    if (!this.db) return;

    // 简历表
    this.db.run(`
      CREATE TABLE IF NOT EXISTS resumes (
        id TEXT PRIMARY KEY,
        fileName TEXT NOT NULL,
        uploadTime TEXT NOT NULL,
        ocrText TEXT,
        parsedData TEXT,
        status TEXT DEFAULT 'pending',
        tags TEXT DEFAULT '[]',
        totalScore REAL DEFAULT 0,
        educationScore REAL DEFAULT 0,
        experienceScore REAL DEFAULT 0,
        skillScore REAL DEFAULT 0,
        notes TEXT
      )
    `);

    // OCR使用记录表
    this.db.run(`
      CREATE TABLE IF NOT EXISTS ocr_usage (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        fileName TEXT NOT NULL,
        pageCount INTEGER DEFAULT 1,
        success INTEGER DEFAULT 1,
        errorMessage TEXT
      )
    `);

    // 评分模板表
    this.db.run(`
      CREATE TABLE IF NOT EXISTS scoring_templates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        weights TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);

    // 筛选方案表
    this.db.run(`
      CREATE TABLE IF NOT EXISTS filter_schemes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        conditions TEXT NOT NULL,
        createdAt TEXT NOT NULL
      )
    `);

    // 候选人表
    this.db.run(`
      CREATE TABLE IF NOT EXISTS candidates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        position TEXT,
        source TEXT,
        status TEXT DEFAULT 'new',
        matchScore REAL DEFAULT 0,
        skills TEXT DEFAULT '[]',
        experience TEXT,
        education TEXT,
        expectedSalary REAL,
        currentCompany TEXT,
        resumeUrl TEXT,
        appliedAt TEXT NOT NULL,
        tags TEXT DEFAULT '[]',
        notes TEXT,
        gender TEXT,
        age INTEGER,
        university TEXT,
        is985 INTEGER DEFAULT 0,
        is211 INTEGER DEFAULT 0,
        major TEXT,
        advantages TEXT,
        description TEXT
      )
    `);

    // 面试记录表
    this.db.run(`
      CREATE TABLE IF NOT EXISTS interviews (
        id TEXT PRIMARY KEY,
        candidateId TEXT NOT NULL,
        date TEXT NOT NULL,
        interviewer TEXT,
        round INTEGER DEFAULT 1,
        type TEXT,
        score REAL,
        feedback TEXT,
        status TEXT DEFAULT 'scheduled',
        createdAt TEXT NOT NULL,
        FOREIGN KEY (candidateId) REFERENCES candidates(id)
      )
    `);

    // 沟通记录表
    this.db.run(`
      CREATE TABLE IF NOT EXISTS communications (
        id TEXT PRIMARY KEY,
        candidateId TEXT NOT NULL,
        type TEXT NOT NULL,
        content TEXT NOT NULL,
        sendAt TEXT NOT NULL,
        template TEXT,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (candidateId) REFERENCES candidates(id)
      )
    `);

    // 邮件模板表
    this.db.run(`
      CREATE TABLE IF NOT EXISTS email_templates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        subject TEXT NOT NULL,
        content TEXT NOT NULL,
        type TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);

    this.saveToLocalStorage();
  }

  /**
   * 保存数据库到 localStorage
   */
  private saveToLocalStorage(): void {
    if (!this.db) return;

    try {
      const data = this.db.export();
      const jsonData = JSON.stringify(Array.from(data));
      localStorage.setItem('recruitment_db', jsonData);
    } catch (error) {
      console.error('保存数据库失败:', error);
    }
  }

  // ==================== 简历操作 ====================

  /**
   * 插入简历记录
   */
  public insertResume(resume: Partial<ResumeRecord>): void {
    if (!this.db) throw new Error('数据库未初始化');

    const stmt = this.db.prepare(`
      INSERT INTO resumes (id, fileName, uploadTime, ocrText, parsedData, status, tags, totalScore, educationScore, experienceScore, skillScore, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run([
      resume.id || this.generateId(),
      resume.fileName || '',
      resume.uploadTime || new Date().toISOString(),
      resume.ocrText || '',
      resume.parsedData || '{}',
      resume.status || 'pending',
      resume.tags || '[]',
      resume.totalScore || 0,
      resume.educationScore || 0,
      resume.experienceScore || 0,
      resume.skillScore || 0,
      resume.notes || ''
    ]);

    stmt.free();
    this.saveToLocalStorage();
  }

  /**
   * 更新简历记录
   */
  public updateResume(id: string, updates: Partial<ResumeRecord>): void {
    if (!this.db) throw new Error('数据库未初始化');

    const fields = Object.keys(updates)
      .filter(key => key !== 'id')
      .map(key => `${key} = ?`)
      .join(', ');

    const values = Object.keys(updates)
      .filter(key => key !== 'id')
      .map(key => (updates as any)[key]);

    const stmt = this.db.prepare(`
      UPDATE resumes 
      SET ${fields}
      WHERE id = ?
    `);

    stmt.run([...values, id]);
    stmt.free();
    this.saveToLocalStorage();
  }

  /**
   * 删除简历记录
   */
  public deleteResume(id: string): void {
    if (!this.db) throw new Error('数据库未初始化');

    this.db.run('DELETE FROM resumes WHERE id = ?', [id]);
    this.saveToLocalStorage();
  }

  /**
   * 查询所有简历
   */
  public getAllResumes(): ResumeRecord[] {
    if (!this.db) throw new Error('数据库未初始化');

    const stmt = this.db.prepare('SELECT * FROM resumes ORDER BY uploadTime DESC');
    const results: ResumeRecord[] = [];

    while (stmt.step()) {
      const row = stmt.getAsObject() as ResumeRecord;
      results.push(row);
    }

    stmt.free();
    return results;
  }

  /**
   * 根据ID查询简历
   */
  public getResumeById(id: string): ResumeRecord | null {
    if (!this.db) throw new Error('数据库未初始化');

    const stmt = this.db.prepare('SELECT * FROM resumes WHERE id = ?');
    stmt.bind([id]);

    if (stmt.step()) {
      const row = stmt.getAsObject() as ResumeRecord;
      stmt.free();
      return row;
    }

    stmt.free();
    return null;
  }

  /**
   * 搜索简历（全文搜索）
   */
  public searchResumes(keyword: string): ResumeRecord[] {
    if (!this.db) throw new Error('数据库未初始化');

    const stmt = this.db.prepare(`
      SELECT * FROM resumes 
      WHERE fileName LIKE ? 
         OR ocrText LIKE ? 
         OR parsedData LIKE ?
         OR notes LIKE ?
      ORDER BY totalScore DESC
    `);

    const searchTerm = `%${keyword}%`;
    stmt.bind([searchTerm, searchTerm, searchTerm, searchTerm]);

    const results: ResumeRecord[] = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject() as ResumeRecord);
    }

    stmt.free();
    return results;
  }

  // ==================== OCR使用记录 ====================

  /**
   * 记录OCR使用
   */
  public recordOCRUsage(fileName: string, pageCount: number, success: boolean, errorMessage?: string): void {
    if (!this.db) throw new Error('数据库未初始化');

    const stmt = this.db.prepare(`
      INSERT INTO ocr_usage (timestamp, fileName, pageCount, success, errorMessage)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run([
      new Date().toISOString(),
      fileName,
      pageCount,
      success ? 1 : 0,
      errorMessage || null
    ]);

    stmt.free();
    this.saveToLocalStorage();
  }

  /**
   * 获取OCR使用统计
   */
  public getOCRUsageStats(): { total: number; success: number; failed: number; totalPages: number } {
    if (!this.db) throw new Error('数据库未初始化');

    const result = this.db.exec(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as success,
        SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END) as failed,
        SUM(pageCount) as totalPages
      FROM ocr_usage
    `);

    if (result.length > 0 && result[0].values.length > 0) {
      const [total, success, failed, totalPages] = result[0].values[0];
      return {
        total: Number(total) || 0,
        success: Number(success) || 0,
        failed: Number(failed) || 0,
        totalPages: Number(totalPages) || 0
      };
    }

    return { total: 0, success: 0, failed: 0, totalPages: 0 };
  }

  /**
   * 获取最近的OCR使用记录
   */
  public getRecentOCRUsage(limit: number = 10): OCRUsageRecord[] {
    if (!this.db) throw new Error('数据库未初始化');

    const stmt = this.db.prepare(`
      SELECT * FROM ocr_usage 
      ORDER BY timestamp DESC 
      LIMIT ?
    `);

    stmt.bind([limit]);

    const results: OCRUsageRecord[] = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject() as OCRUsageRecord);
    }

    stmt.free();
    return results;
  }

  // ==================== 评分模板操作 ====================

  /**
   * 保存评分模板
   */
  public saveScoringTemplate(template: {
    id: string;
    name: string;
    description: string;
    weights: any;
  }): void {
    if (!this.db) throw new Error('数据库未初始化');

    const now = new Date().toISOString();
    
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO scoring_templates (id, name, description, weights, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run([
      template.id,
      template.name,
      template.description,
      JSON.stringify(template.weights),
      now,
      now
    ]);

    stmt.free();
    this.saveToLocalStorage();
  }

  /**
   * 获取所有评分模板
   */
  public getAllScoringTemplates(): any[] {
    if (!this.db) throw new Error('数据库未初始化');

    const stmt = this.db.prepare('SELECT * FROM scoring_templates ORDER BY updatedAt DESC');
    const results: any[] = [];

    while (stmt.step()) {
      const row = stmt.getAsObject();
      row.weights = JSON.parse(row.weights as string);
      results.push(row);
    }

    stmt.free();
    return results;
  }

  // ==================== 筛选方案操作 ====================

  /**
   * 保存筛选方案
   */
  public saveFilterScheme(scheme: {
    id: string;
    name: string;
    description: string;
    conditions: any;
  }): void {
    if (!this.db) throw new Error('数据库未初始化');

    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO filter_schemes (id, name, description, conditions, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run([
      scheme.id,
      scheme.name,
      scheme.description,
      JSON.stringify(scheme.conditions),
      new Date().toISOString()
    ]);

    stmt.free();
    this.saveToLocalStorage();
  }

  /**
   * 获取所有筛选方案
   */
  public getAllFilterSchemes(): any[] {
    if (!this.db) throw new Error('数据库未初始化');

    const stmt = this.db.prepare('SELECT * FROM filter_schemes ORDER BY createdAt DESC');
    const results: any[] = [];

    while (stmt.step()) {
      const row = stmt.getAsObject();
      row.conditions = JSON.parse(row.conditions as string);
      results.push(row);
    }

    stmt.free();
    return results;
  }

  // ==================== 工具方法 ====================

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 清空所有数据（慎用）
   */
  public clearAllData(): void {
    if (!this.db) throw new Error('数据库未初始化');

    this.db.run('DELETE FROM resumes');
    this.db.run('DELETE FROM ocr_usage');
    this.db.run('DELETE FROM scoring_templates');
    this.db.run('DELETE FROM filter_schemes');
    
    this.saveToLocalStorage();
  }

  /**
   * 导出数据库
   */
  public exportDatabase(): Uint8Array {
    if (!this.db) throw new Error('数据库未初始化');
    return this.db.export();
  }

  /**
   * 导入数据库
   */
  public importDatabase(data: Uint8Array): void {
    if (!this.SQL) throw new Error('SQL.js未初始化');

    this.db?.close();
    this.db = new this.SQL.Database(data);
    this.saveToLocalStorage();
  }

  // ==================== 候选人操作 ====================

  /**
   * 插入候选人
   */
  public insertCandidate(candidate: any): void {
    if (!this.db) throw new Error('数据库未初始化');

    const stmt = this.db.prepare(`
      INSERT INTO candidates (
        id, name, email, phone, position, source, status, matchScore, skills, experience,
        education, expectedSalary, currentCompany, resumeUrl, appliedAt, tags, notes,
        gender, age, university, is985, is211, major, advantages, description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run([
      candidate.id || this.generateId(),
      candidate.name || '',
      candidate.email || '',
      candidate.phone || '',
      candidate.position || '',
      candidate.source || '',
      candidate.status || 'new',
      candidate.matchScore || 0,
      JSON.stringify(candidate.skills || []),
      candidate.experience || '',
      candidate.education || '',
      candidate.expectedSalary || null,
      candidate.currentCompany || null,
      candidate.resumeUrl || null,
      candidate.appliedAt ? new Date(candidate.appliedAt).toISOString() : new Date().toISOString(),
      JSON.stringify(candidate.tags || []),
      candidate.notes || '',
      candidate.gender || null,
      candidate.age || null,
      candidate.university || null,
      candidate.is985 ? 1 : 0,
      candidate.is211 ? 1 : 0,
      candidate.major || null,
      candidate.advantages || null,
      candidate.description || null
    ]);

    stmt.free();
    this.saveToLocalStorage();
  }

  /**
   * 更新候选人
   */
  public updateCandidate(id: string, updates: any): void {
    if (!this.db) throw new Error('数据库未初始化');

    const fields: string[] = [];
    const values: any[] = [];

    Object.keys(updates).forEach(key => {
      if (key === 'id') return;
      
      if (key === 'skills' || key === 'tags') {
        fields.push(`${key} = ?`);
        values.push(JSON.stringify(updates[key]));
      } else if (key === 'appliedAt' && updates[key] instanceof Date) {
        fields.push(`${key} = ?`);
        values.push(updates[key].toISOString());
      } else if (key === 'is985' || key === 'is211') {
        fields.push(`${key} = ?`);
        values.push(updates[key] ? 1 : 0);
      } else {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });

    if (fields.length === 0) return;

    const stmt = this.db.prepare(`UPDATE candidates SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run([...values, id]);
    stmt.free();
    this.saveToLocalStorage();
  }

  /**
   * 删除候选人
   */
  public deleteCandidate(id: string): void {
    if (!this.db) throw new Error('数据库未初始化');

    // 删除关联的面试和沟通记录
    this.db.run('DELETE FROM interviews WHERE candidateId = ?', [id]);
    this.db.run('DELETE FROM communications WHERE candidateId = ?', [id]);
    this.db.run('DELETE FROM candidates WHERE id = ?', [id]);
    this.saveToLocalStorage();
  }

  /**
   * 获取所有候选人
   */
  public getAllCandidates(): any[] {
    if (!this.db) throw new Error('数据库未初始化');

    const stmt = this.db.prepare('SELECT * FROM candidates ORDER BY appliedAt DESC');
    const results: any[] = [];

    while (stmt.step()) {
      const row = stmt.getAsObject() as any;
      results.push(this.parseCandidateRow(row));
    }

    stmt.free();
    return results;
  }

  /**
   * 根据ID获取候选人
   */
  public getCandidateById(id: string): any | null {
    if (!this.db) throw new Error('数据库未初始化');

    const stmt = this.db.prepare('SELECT * FROM candidates WHERE id = ?');
    stmt.bind([id]);

    if (stmt.step()) {
      const row = stmt.getAsObject() as any;
      stmt.free();
      return this.parseCandidateRow(row);
    }

    stmt.free();
    return null;
  }

  /**
   * 解析候选人行数据
   */
  private parseCandidateRow(row: any): any {
    return {
      ...row,
      skills: JSON.parse(row.skills || '[]'),
      tags: JSON.parse(row.tags || '[]'),
      appliedAt: new Date(row.appliedAt),
      is985: row.is985 === 1,
      is211: row.is211 === 1,
      interviews: this.getInterviewsByCandidateId(row.id),
      communications: this.getCommunicationsByCandidateId(row.id)
    };
  }

  // ==================== 面试操作 ====================

  /**
   * 插入面试记录
   */
  public insertInterview(interview: any): void {
    if (!this.db) throw new Error('数据库未初始化');

    const stmt = this.db.prepare(`
      INSERT INTO interviews (id, candidateId, date, interviewer, round, type, score, feedback, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run([
      interview.id || this.generateId(),
      interview.candidateId,
      interview.date instanceof Date ? interview.date.toISOString() : interview.date,
      interview.interviewer || '',
      interview.round || 1,
      interview.type || '',
      interview.score || null,
      interview.feedback || null,
      interview.status || 'scheduled',
      new Date().toISOString()
    ]);

    stmt.free();
    this.saveToLocalStorage();
  }

  /**
   * 获取候选人的所有面试记录
   */
  public getInterviewsByCandidateId(candidateId: string): any[] {
    if (!this.db) throw new Error('数据库未初始化');

    const stmt = this.db.prepare('SELECT * FROM interviews WHERE candidateId = ? ORDER BY date DESC');
    stmt.bind([candidateId]);
    const results: any[] = [];

    while (stmt.step()) {
      const row = stmt.getAsObject() as any;
      results.push({
        ...row,
        date: new Date(row.date)
      });
    }

    stmt.free();
    return results;
  }

  /**
   * 更新面试记录
   */
  public updateInterview(id: string, updates: any): void {
    if (!this.db) throw new Error('数据库未初始化');

    const fields: string[] = [];
    const values: any[] = [];

    Object.keys(updates).forEach(key => {
      if (key === 'id') return;
      
      if (key === 'date' && updates[key] instanceof Date) {
        fields.push(`${key} = ?`);
        values.push(updates[key].toISOString());
      } else {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });

    if (fields.length === 0) return;

    const stmt = this.db.prepare(`UPDATE interviews SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run([...values, id]);
    stmt.free();
    this.saveToLocalStorage();
  }

  /**
   * 删除面试记录
   */
  public deleteInterview(id: string): void {
    if (!this.db) throw new Error('数据库未初始化');
    this.db.run('DELETE FROM interviews WHERE id = ?', [id]);
    this.saveToLocalStorage();
  }

  // ==================== 沟通操作 ====================

  /**
   * 插入沟通记录
   */
  public insertCommunication(communication: any): void {
    if (!this.db) throw new Error('数据库未初始化');

    const stmt = this.db.prepare(`
      INSERT INTO communications (id, candidateId, type, content, sendAt, template, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run([
      communication.id || this.generateId(),
      communication.candidateId,
      communication.type,
      communication.content,
      communication.sendAt instanceof Date ? communication.sendAt.toISOString() : communication.sendAt,
      communication.template || null,
      new Date().toISOString()
    ]);

    stmt.free();
    this.saveToLocalStorage();
  }

  /**
   * 获取候选人的所有沟通记录
   */
  public getCommunicationsByCandidateId(candidateId: string): any[] {
    if (!this.db) throw new Error('数据库未初始化');

    const stmt = this.db.prepare('SELECT * FROM communications WHERE candidateId = ? ORDER BY sendAt DESC');
    stmt.bind([candidateId]);
    const results: any[] = [];

    while (stmt.step()) {
      const row = stmt.getAsObject() as any;
      results.push({
        ...row,
        sendAt: new Date(row.sendAt)
      });
    }

    stmt.free();
    return results;
  }

  // ==================== 邮件模板操作 ====================

  /**
   * 插入或更新邮件模板
   */
  public saveEmailTemplate(template: any): void {
    if (!this.db) throw new Error('数据库未初始化');

    const now = new Date().toISOString();
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO email_templates (id, name, subject, content, type, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run([
      template.id || this.generateId(),
      template.name,
      template.subject,
      template.content,
      template.type,
      template.createdAt || now,
      now
    ]);

    stmt.free();
    this.saveToLocalStorage();
  }

  /**
   * 获取所有邮件模板
   */
  public getAllEmailTemplates(): any[] {
    if (!this.db) throw new Error('数据库未初始化');

    const stmt = this.db.prepare('SELECT * FROM email_templates ORDER BY updatedAt DESC');
    const results: any[] = [];

    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }

    stmt.free();
    return results;
  }

  /**
   * 根据类型获取邮件模板
   */
  public getEmailTemplatesByType(type: string): any[] {
    if (!this.db) throw new Error('数据库未初始化');

    const stmt = this.db.prepare('SELECT * FROM email_templates WHERE type = ? ORDER BY updatedAt DESC');
    stmt.bind([type]);
    const results: any[] = [];

    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }

    stmt.free();
    return results;
  }
}

// 导出单例
export const database = new DatabaseService();

