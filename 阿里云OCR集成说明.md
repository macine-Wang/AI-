# 阿里云OCR集成说明

## 📋 功能概述

已成功集成阿里云高精版OCR识别服务，实现以下功能：

### ✅ 核心功能

1. **PDF简历自动识别**
   - 支持多页PDF自动转图片
   - 逐页OCR识别并合并结果
   - 实时显示识别进度

2. **智能信息提取**
   - 姓名、电话、邮箱等基础信息
   - 学历、工作年限自动识别
   - 技能关键词智能匹配

3. **本地SQLite数据库**
   - 简历数据持久化存储
   - OCR使用记录追踪
   - 评分模板和筛选方案保存

4. **调用次数实时监控**
   - 可视化显示剩余额度
   - 使用进度条和百分比
   - 额度不足自动预警

## 📦 需要安装的依赖包

请运行以下命令安装必要的依赖：

```bash
npm install axios
npm install pdfjs-dist
npm install sql.js
```

或者使用 yarn：

```bash
yarn add axios pdfjs-dist sql.js
```

### 依赖包说明

| 包名 | 版本 | 用途 |
|------|------|------|
| `axios` | ^1.6.0 | HTTP客户端，用于调用阿里云OCR API |
| `pdfjs-dist` | ^3.11.174 | PDF解析库，将PDF转换为图片 |
| `sql.js` | ^1.8.0 | SQLite的JavaScript实现，用于本地数据存储 |

## 📁 新增文件列表

### 1. 服务层
- `src/services/aliyunOCR.ts` - 阿里云OCR服务
  - PDF转图片
  - OCR识别调用
  - 简历信息解析
  - 调用次数管理

- `src/services/database.ts` - SQLite数据库服务
  - 简历数据CRUD
  - OCR使用记录
  - 评分模板管理
  - 筛选方案管理

### 2. 组件层
- `src/components/OCRUsageIndicator.tsx` - OCR使用次数指示器
  - 完整版指示器（带详情）
  - 迷你版指示器（导航栏用）

- `src/pages/hr/ResumeScreeningWithOCR.tsx` - 简历筛选页面（OCR版）
  - 完整的简历筛选功能
  - 集成OCR和数据库
  - 实时进度显示

## 🔑 API配置信息

### 阿里云OCR

```typescript
AppKey: 204948817
AppSecret: dVO0XZJX7zCgwbqu0jd9m0UeShjf96TO
AppCode: 340dde6ffb2f4ea9913bdd65d24397dd
调用地址: https://gjbsb.market.alicloudapi.com/ocrservice/advanced
总额度: 500次
```

**已自动配置在 `src/services/aliyunOCR.ts` 文件中**

## 🚀 使用方法

### 1. 启动应用

```bash
npm install
npm run dev
```

### 2. 访问简历筛选页面

在路由中添加或修改：

```typescript
// src/App.tsx 或路由配置文件
import ResumeScreeningWithOCR from './pages/hr/ResumeScreeningWithOCR';

<Route path="/recruitment/resumes" element={<ResumeScreeningWithOCR />} />
```

### 3. 上传PDF简历

1. 点击右上角"上传简历"按钮
2. 拖拽PDF文件或点击选择文件
3. 等待OCR自动识别（会显示进度）
4. 识别完成后自动保存到数据库

### 4. 查看和筛选

- 左侧显示OCR调用次数统计
- 可按学历、分数、状态筛选
- 支持关键词搜索
- 可按评分或时间排序

## 📊 数据存储

### 存储方式

- 使用 **SQLite** 数据库（sql.js实现）
- 数据保存在浏览器的 **localStorage** 中
- 刷新页面不会丢失数据

### 数据表结构

#### 1. resumes（简历表）
```sql
- id: 唯一标识
- fileName: 文件名
- uploadTime: 上传时间
- ocrText: OCR识别的原始文本
- parsedData: 解析后的JSON数据
- status: 状态（pending/completed/failed）
- tags: 标签数组
- totalScore: 综合评分
- educationScore: 学历评分
- experienceScore: 经验评分
- skillScore: 技能评分
- notes: 备注
```

#### 2. ocr_usage（OCR使用记录表）
```sql
- id: 自增ID
- timestamp: 时间戳
- fileName: 文件名
- pageCount: 页数
- success: 是否成功
- errorMessage: 错误信息
```

## ⚠️ 注意事项

### OCR调用限制

- **总额度：500次**
- 每上传一份PDF简历消耗1次
- 额度用完后无法继续上传
- 建议批量上传以提高效率

### 文件格式支持

- ✅ 仅支持 **PDF** 格式
- ❌ 不支持 Word、图片等其他格式
- 💡 如需支持其他格式，可自行扩展

### 数据安全

- 所有数据存储在**本地浏览器**中
- 不会上传到服务器
- 清除浏览器缓存会丢失数据
- 建议定期使用"导出"功能备份

## 🎨 UI特性

### OCR使用次数指示器

- **绿色**：正常（使用率 < 70%）
- **黄色**：警告（使用率 70-90%）
- **红色**：紧急（使用率 > 90%）

### 简历状态

- 🔄 **解析中**：黄色标签，显示进度
- ✅ **已完成**：绿色标签
- ❌ **失败**：红色标签

### 评分系统

- **综合评分**：根据学历、经验、技能加权计算
  - 学历权重：30%
  - 经验权重：40%
  - 技能权重：30%

- **评分标准**：
  - ≥80分：绿色（优秀）
  - 60-79分：蓝色（良好）
  - <60分：灰色（一般）

## 🔧 常见问题

### Q1: OCR识别不准确怎么办？

**A:** 可能原因和解决方案：
1. PDF质量太低 → 使用高清PDF
2. 文字排版复杂 → 简化简历格式
3. 包含大量图片 → 减少图片使用
4. 手写内容 → OCR主要识别印刷体

### Q2: 数据库初始化失败？

**A:** 检查以下几点：
1. 浏览器是否支持localStorage
2. 是否有足够的存储空间
3. 是否启用了隐私保护模式
4. 尝试清除缓存后重新加载

### Q3: 如何重置OCR调用次数？

**A:** 两种方式：
```javascript
// 方式1：在浏览器控制台执行
localStorage.removeItem('aliyun_ocr_call_count');

// 方式2：调用API
import { aliyunOCR } from './services/aliyunOCR';
aliyunOCR.resetCallCount();
```

### Q4: 如何导出数据库？

**A:** 在代码中调用：
```javascript
import { database } from './services/database';

// 导出数据库
const data = database.exportDatabase();
const blob = new Blob([data], { type: 'application/octet-stream' });
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'recruitment_db.sqlite';
link.click();
```

## 📈 性能优化建议

### 1. 批量上传
- 一次上传多份简历比分批上传更高效
- 减少用户等待时间

### 2. 缓存策略
- 已识别的简历不会重复OCR
- 利用数据库缓存机制

### 3. 异步处理
- OCR识别采用异步方式
- 不阻塞UI界面操作

### 4. 进度反馈
- 实时显示识别进度
- 提升用户体验

## 🔄 后续扩展建议

### 功能扩展

1. **支持更多格式**
   - Word文档（.doc/.docx）
   - 图片格式（.jpg/.png）
   - 压缩包批量导入

2. **增强解析能力**
   - 接入GPT-4等AI模型
   - 更精准的信息提取
   - 智能匹配岗位JD

3. **数据分析**
   - 简历质量统计
   - 来源渠道分析
   - 时间趋势图表

4. **协同功能**
   - 多人评价系统
   - 评论和备注
   - 面试记录关联

### 技术优化

1. **后端服务**
   - 迁移到真实数据库（PostgreSQL/MongoDB）
   - 搭建Node.js后端服务
   - 实现用户认证和权限

2. **性能提升**
   - PDF处理使用Web Worker
   - 虚拟滚动优化列表渲染
   - 图片懒加载

3. **安全加固**
   - API密钥加密存储
   - 数据传输HTTPS
   - 敏感信息脱敏

## 📞 技术支持

如有问题，请查看：
- `src/services/aliyunOCR.ts` - OCR服务实现
- `src/services/database.ts` - 数据库服务实现
- `src/pages/hr/ResumeScreeningWithOCR.tsx` - 页面组件

---

**开发完成时间**: 2025年11月6日
**版本**: 1.0.0
**开发者**: AI Assistant

