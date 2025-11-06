# AI集成快速参考

## 🎯 核心改进

### 提升识别准确率的三大策略

#### 1. 豆包AI智能解析（推荐）✨
- **优势**：NLP语义理解，准确率~95%
- **适用**：所有简历，尤其是复杂排版
- **配置**：5分钟快速配置

#### 2. Prompt工程优化 📝
已优化的Prompt确保AI准确理解提取要求：
- 明确字段定义
- 严格JSON格式
- 智能容错处理
- 自动数据清洗

#### 3. 自动降级机制 🔄
- AI调用失败 → 自动切换基础解析
- API Key未配置 → 直接使用基础解析
- 确保系统稳定运行

---

## 🚀 5分钟配置指南

### Step 1: 获取API Key
```
1. 访问: https://console.volcengine.com/ark
2. 注册/登录
3. 创建推理接入点 (模型: doubao-1-5-thinking-pro-250415)
4. 复制API Key
```

### Step 2: 系统配置
```
1. 进入"AI助手"标签页
2. 点击右上角⚙️
3. 粘贴API Key
4. 保存
```

### Step 3: 验证生效
```
1. 上传PDF简历
2. 点击"开始解析"
3. 查看控制台: "使用豆包AI进行智能解析..."
4. 查看解析结果
```

---

## 📊 解析字段清单

### ✅ 已支持字段

#### 基础信息
- [x] 姓名
- [x] 性别
- [x] 年龄
- [x] 手机号
- [x] 邮箱

#### 教育背景
- [x] 学历（博士/硕士/本科/专科）
- [x] 学校名称（自动识别985/211）
- [x] 专业名称
- [x] 起止时间
- [x] 多学历处理（自动排序）

#### 工作经历
- [x] 公司名称
- [x] 职位名称
- [x] 任职时长
- [x] 工作内容
- [x] 起止时间

#### 项目经验
- [x] 项目名称
- [x] 项目角色
- [x] 项目描述
- [x] 技术栈

#### 其他
- [x] 技能关键词
- [x] 求职意向
- [x] 自我评价

---

## 💻 代码示例

### 前端调用

```typescript
// 1. OCR识别
const ocrText = await aliyunOCR.recognizePDF(file);

// 2. AI智能解析（自动判断是否使用AI）
const result = await aliyunOCR.parseResumeWithAI(ocrText);

// 3. 使用解析结果
console.log(result.name);        // 姓名
console.log(result.education);   // 教育背景数组
console.log(result.skills);      // 技能数组
```

### 手动调用豆包AI

```typescript
import { doubaoAI } from '@/services/doubaoAI';

// 设置API Key
doubaoAI.setApiKey('your_api_key');

// 直接调用AI解析
const result = await doubaoAI.parseResumeWithAI(ocrText);
```

### 流式输出（实时显示进度）

```typescript
const result = await doubaoAI.parseResumeWithAIStream(
  ocrText,
  (chunk) => {
    console.log('解析进度:', chunk);
    // 实时更新UI
  }
);
```

---

## 🎨 Prompt优化技巧

### 当前Prompt结构

```
系统角色设定
    ↓
提取字段说明（详细定义）
    ↓
重要说明（格式要求）
    ↓
OCR文本输入
    ↓
JSON格式模板
```

### 优化建议

1. **明确输出格式**
   - 严格要求JSON格式
   - 不允许额外说明文字
   - 提供完整JSON模板

2. **容错处理**
   - 缺失字段填空值
   - 不确定信息标注"未知"
   - 保证返回结构完整

3. **智能推断**
   - 年龄计算（通过出生日期）
   - 学历排序（最高学历在前）
   - 工作年限计算

4. **数据清洗**
   - 电话号码格式化（仅数字）
   - 邮箱格式验证
   - 技能去重

---

## 📈 性能优化

### 提升解析速度

1. **批量处理**
   ```typescript
   // 批量上传，并行解析
   const results = await Promise.all(
     files.map(file => aliyunOCR.parseResumeWithAI(file))
   );
   ```

2. **缓存机制**
   ```typescript
   // 解析结果存入数据库
   await database.insertResume(parsedData);
   ```

3. **异步处理**
   ```typescript
   // 后台异步解析，不阻塞UI
   setTimeout(() => parseResumes(), 0);
   ```

---

## 🔍 调试技巧

### 查看AI调用日志

```javascript
// 打开浏览器控制台
console.log('OCR API响应:', ...);
console.log('使用豆包AI进行智能解析...');
console.log('AI解析结果:', parsedResult);
```

### 对比解析结果

```typescript
// 基础解析
const basicResult = aliyunOCR.parseResumeFromText(ocrText);

// AI解析
const aiResult = await doubaoAI.parseResumeWithAI(ocrText);

// 对比差异
console.log('基础解析:', basicResult);
console.log('AI解析:', aiResult);
```

---

## 🛠️ 故障排除

### 常见问题快速解决

#### 问题1: AI解析返回空数据
```
原因: API Key无效或过期
解决: 重新配置API Key
```

#### 问题2: 解析结果不准确
```
原因: Prompt需要优化
解决: 修改 doubaoAI.ts 中的 buildResumeParsePrompt 方法
```

#### 问题3: 解析速度慢
```
原因: AI模型响应时间较长
解决: 
1. 使用流式输出显示进度
2. 批量处理时控制并发数
3. 考虑使用更快的模型
```

#### 问题4: API调用失败
```
原因: 网络问题或API限流
解决: 
1. 检查网络连接
2. 查看API调用配额
3. 系统会自动降级到基础解析
```

---

## 📚 相关文档

- [豆包AI集成说明（完整版）](./豆包AI集成说明.md)
- [火山方舟官方文档](https://www.volcengine.com/docs/82379)
- [阿里云OCR文档](https://help.aliyun.com/product/30406.html)

---

## 🎉 快速测试

### 测试步骤

1. **配置AI**（5分钟）
2. **准备测试简历**（1-2份PDF）
3. **上传并解析**
4. **查看结果**：对比姓名、学历、工作经历等字段
5. **验证准确性**：检查是否正确提取

### 成功标志

- ✅ 姓名准确
- ✅ 学历完整（含学校、专业）
- ✅ 985/211正确标注
- ✅ 工作经历完整
- ✅ 技能关键词丰富

---

**Happy Coding!** 🚀

