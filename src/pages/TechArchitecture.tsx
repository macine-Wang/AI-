/**
 * 技术架构页面
 * 展示ISMT系统的技术栈和架构设计
 */

import React from 'react';
import {
  CodeBracketIcon,
  CpuChipIcon,
  CloudIcon,
  ShieldCheckIcon,
  BoltIcon,
  CubeTransparentIcon,
  DevicePhoneMobileIcon,
  ChartBarIcon,
  CommandLineIcon,
  SwatchIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';

// 技术栈数据
const techStacks = {
  frontend: {
    title: '前端技术栈',
    icon: <CodeBracketIcon className="w-8 h-8" />,
    color: 'blue',
    technologies: [
      { name: 'React 18', description: '现代化前端框架', version: '18.2.0', official: true },
      { name: 'TypeScript', description: '类型安全的JavaScript', version: '5.2.2', official: true },
      { name: 'Vite', description: '极速构建工具', version: '5.1.0', official: true },
      { name: 'React Router DOM', description: '单页应用路由管理', version: '6.22.0', official: true },
      { name: 'Zustand', description: '轻量级状态管理', version: '4.5.0', official: true },
      { name: 'Tailwind CSS', description: '实用优先的CSS框架', version: '3.4.1', official: true },
      { name: 'Headless UI', description: '无样式UI组件库', version: '1.7.18', official: true },
      { name: 'Heroicons', description: '精美的SVG图标库', version: '2.1.1', official: true },
      { name: 'Lucide React', description: '现代化图标库', version: '0.344.0', official: true },
      { name: 'Chart.js', description: '数据可视化图表库', version: '4.4.1', official: true },
      { name: 'React Chart.js 2', description: 'React图表组件', version: '5.2.0', official: true },
      { name: 'Axios', description: 'HTTP客户端', version: '1.13.2', official: true },
      { name: 'clsx', description: '条件类名管理', version: '2.1.0', official: true },
      { name: 'react-markdown', description: 'Markdown渲染组件', version: '10.1.0', official: true },
      { name: 'remark-gfm', description: 'GitHub风格Markdown支持', version: '4.0.1', official: true },
      { name: 'rehype-raw', description: '原始HTML解析支持', version: '7.0.0', official: true }
    ]
  },
  dataProcessing: {
    title: '数据处理与文档支持',
    icon: <DocumentIcon className="w-8 h-8" />,
    color: 'purple',
    technologies: [
      { name: 'jsPDF', description: 'PDF生成库', version: '3.0.3', official: true },
      { name: 'jspdf-autotable', description: 'PDF表格生成', version: '5.0.2', official: true },
      { name: 'html2canvas', description: 'HTML转Canvas', version: '1.4.1', official: true },
      { name: 'pdfjs-dist', description: 'PDF解析库', version: '4.10.38', official: true },
      { name: 'mammoth', description: 'Word文档解析', version: '1.11.0', official: true },
      { name: 'xlsx', description: 'Excel文件处理', version: '0.18.5', official: true },
      { name: 'sql.js', description: '浏览器端SQL支持', version: '1.13.0', official: true }
    ]
  },
  backend: {
    title: '后端与AI',
    icon: <CloudIcon className="w-8 h-8" />,
    color: 'green',
    technologies: [
      { name: '豆包大模型', description: 'AI智能分析和对话', version: 'doubao-pro', official: true },
      { name: 'FastAPI', description: 'Python Web框架', version: '0.100+', official: true },
      { name: 'PostgreSQL', description: '关系型数据库', version: '15+', official: true },
      { name: 'Redis', description: '高速缓存系统', version: '7.0+', official: true },
      { name: 'MongoDB', description: '文档型数据库', version: '6.0+', official: true },
      { name: 'Elasticsearch', description: '全文搜索引擎', version: '8.0+', official: true }
    ]
  },
  ui: {
    title: '用户界面设计',
    icon: <SwatchIcon className="w-8 h-8" />,
    color: 'purple',
    technologies: [
      { name: '响应式设计', description: '适配各种设备尺寸', version: 'CSS3', official: true },
      { name: '组件化架构', description: '可复用的UI组件体系', version: 'React Components', official: true },
      { name: '动画效果', description: '流畅的交互体验', version: 'CSS Transitions', official: true },
      { name: '图表可视化', description: '薪酬数据可视化展示', version: 'Chart.js', official: true },
      { name: '表单处理', description: '智能表单验证', version: 'React Hook Form', official: true },
      { name: '模态弹窗', description: '优雅的弹窗交互', version: 'Custom Modal', official: true }
    ]
  },
  ai: {
    title: 'AI智能功能',
    icon: <CpuChipIcon className="w-8 h-8" />,
    color: 'red',
    technologies: [
      { name: '豆包对话模型', description: '智能薪酬顾问', version: 'doubao-pro-32k', official: true },
      { name: '薪酬预测算法', description: '基于机器学习的预测', version: 'PyTorch', official: true },
      { name: '竞争力分析', description: '多维度竞争力评估', version: 'ML Model', official: true },
      { name: '公平性检测', description: '薪酬公平性分析', version: 'Fairness AI', official: true },
      { name: '智能推荐', description: '个性化职业建议', version: 'Recommendation', official: true },
      { name: '自然语言理解', description: '准确理解用户需求', version: 'NLP', official: true },
      { name: '多轮对话', description: '上下文感知对话', version: 'Context API', official: true },
      { name: '知识库问答', description: '专业薪酬知识库', version: 'Knowledge Base', official: true }
    ]
  },
  datavis: {
    title: '数据可视化',
    icon: <ChartBarIcon className="w-8 h-8" />,
    color: 'indigo',
    technologies: [
      { name: 'Chart.js', description: '强大的图表库', version: '4.0+', official: true },
      { name: '雷达图', description: '薪酬竞争力可视化', version: 'Radar Chart', official: true },
      { name: '折线图', description: '薪酬趋势展示', version: 'Line Chart', official: true },
      { name: '柱状图', description: '数据对比分析', version: 'Bar Chart', official: true },
      { name: '饼图', description: '薪酬结构分析', version: 'Pie Chart', official: true },
      { name: '实时更新', description: '动态数据刷新', version: 'Real-time', official: true }
    ]
  },
  tools: {
    title: '开发工具链',
    icon: <CommandLineIcon className="w-8 h-8" />,
    color: 'yellow',
    technologies: [
      { name: 'ESLint', description: '代码质量检查', version: '8.0+', official: true },
      { name: 'Prettier', description: '代码格式化工具', version: '3.0+', official: true },
      { name: 'Git', description: '版本控制系统', version: '2.40+', official: true },
      { name: 'npm', description: '包管理工具', version: '9.0+', official: true },
      { name: 'TypeScript ESLint', description: 'TS代码检查', version: '6.0+', official: true },
      { name: 'Vite Plugin', description: 'Vite构建插件', version: 'Latest', official: true }
    ]
  },
  performance: {
    title: '性能优化',
    icon: <BoltIcon className="w-8 h-8" />,
    color: 'orange',
    technologies: [
      { name: 'Code Splitting', description: '路由级代码分割', version: 'React.lazy', official: true },
      { name: 'Lazy Loading', description: '组件按需加载', version: 'Dynamic Import', official: true },
      { name: 'Tree Shaking', description: '移除未使用代码', version: 'Vite Rollup', official: true },
      { name: 'Asset Optimization', description: '资源压缩优化', version: 'Vite Plugin', official: true },
      { name: 'Caching Strategy', description: '智能缓存策略', version: 'HTTP Cache', official: true },
      { name: 'Bundle Analysis', description: '打包体积分析', version: 'Rollup Plugin', official: true }
    ]
  },
  security: {
    title: '安全保障',
    icon: <ShieldCheckIcon className="w-8 h-8" />,
    color: 'green',
    technologies: [
      { name: 'HTTPS', description: '加密传输协议', version: 'TLS 1.3', official: true },
      { name: 'JWT Token', description: '身份认证令牌', version: 'RFC 7519', official: true },
      { name: 'XSS防护', description: '跨站脚本防护', version: 'Content Security', official: true },
      { name: 'CSRF防护', description: '跨站请求伪造防护', version: 'CSRF Token', official: true },
      { name: '数据加密', description: '敏感数据加密存储', version: 'AES-256', official: true },
      { name: '权限控制', description: '基于角色的访问控制', version: 'RBAC', official: true }
    ]
  }
};

// 架构特点
const architectureFeatures = [
  {
    icon: <CubeTransparentIcon className="w-12 h-12 text-blue-600" />,
    title: '微服务架构',
    description: '采用前后端分离的微服务架构，每个服务模块独立部署和扩展，提高系统的可维护性和可扩展性。',
    highlights: ['服务解耦', '独立部署', '水平扩展']
  },
  {
    icon: <CpuChipIcon className="w-12 h-12 text-red-600" />,
    title: 'AI驱动',
    description: '集成豆包大模型，提供智能薪酬分析、职业规划、谈判策略等AI功能，实现智能化薪酬管理。',
    highlights: ['智能分析', '精准预测', '个性推荐']
  },
  {
    icon: <ChartBarIcon className="w-12 h-12 text-purple-600" />,
    title: '数据可视化',
    description: '使用Chart.js构建丰富的数据可视化功能，包括薪酬趋势图、竞争力雷达图等多种图表展示。',
    highlights: ['实时图表', '交互分析', '多维展示']
  },
  {
    icon: <ShieldCheckIcon className="w-12 h-12 text-green-600" />,
    title: '安全可靠',
    description: '实施多层安全防护，包括数据加密、身份认证、权限控制等，确保用户数据和系统安全。',
    highlights: ['数据加密', '权限管理', '安全审计']
  },
  {
    icon: <DevicePhoneMobileIcon className="w-12 h-12 text-indigo-600" />,
    title: '响应式设计',
    description: '基于Tailwind CSS实现完全响应式布局，完美适配桌面端、平板和移动设备，提供一致的用户体验。',
    highlights: ['移动优先', '自适应', '跨设备']
  },
  {
    icon: <BoltIcon className="w-12 h-12 text-orange-600" />,
    title: '高性能',
    description: '通过代码分割、懒加载、缓存策略、CDN加速等技术，确保应用快速响应和流畅的用户体验。',
    highlights: ['快速加载', '优化缓存', '极速响应']
  }
];

const TechArchitecture: React.FC = () => {
  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 border-blue-200 bg-blue-50',
      green: 'from-green-500 to-green-600 border-green-200 bg-green-50',
      purple: 'from-purple-500 to-purple-600 border-purple-200 bg-purple-50',
      red: 'from-red-500 to-red-600 border-red-200 bg-red-50',
      yellow: 'from-yellow-500 to-yellow-600 border-yellow-200 bg-yellow-50',
      orange: 'from-orange-500 to-orange-600 border-orange-200 bg-orange-50',
      indigo: 'from-indigo-500 to-indigo-600 border-indigo-200 bg-indigo-50'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white dark:from-gray-900 dark:via-blue-900/10 dark:to-gray-900">
      {/* 页面头部 */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-500/5 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
        
        <div className="container max-w-6xl relative z-10">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-30"></div>
                <div className="relative p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl">
                  <CubeTransparentIcon className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  技术架构
                </h1>
                <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg mt-1">现代化技术栈驱动</p>
              </div>
            </div>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
              基于现代化全栈技术构建，前端采用React 18 + TypeScript + Vite，后端使用FastAPI + PostgreSQL，
              集成豆包大模型实现AI智能分析，
              <span className="text-blue-600 dark:text-blue-400 font-semibold">打造高性能、智能化的薪酬管理系统</span>
            </p>
            
            <div className="flex items-center justify-center space-x-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-full px-6 py-3 border border-blue-100 dark:border-blue-800 shadow-lg">
              <BoltIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">AI驱动 · 微服务架构 · 高性能 · 安全可靠</span>
            </div>
          </div>
        </div>
      </section>

      {/* 技术栈展示 */}
      <section className="py-16">
        <div className="container max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {Object.entries(techStacks).map(([key, stack]) => (
              <div
                key={key}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-500"
              >
                {/* 头部 */}
                <div className={`p-6 bg-gradient-to-r ${getColorClasses(stack.color)} border-b border-gray-200 dark:border-gray-700`}>
                  <div className="flex items-center space-x-3">
                    <div className="text-white">{stack.icon}</div>
                    <h3 className="text-xl font-bold text-white">{stack.title}</h3>
                  </div>
                </div>

                {/* 技术列表 */}
                <div className="p-6 space-y-4">
                  {stack.technologies.map((tech, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group/item"
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 ${tech.official ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 dark:text-white group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">
                            {tech.name}
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {tech.version}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {tech.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 架构特点 */}
      <section className="py-16 bg-white/50 dark:bg-gray-800/50">
        <div className="container max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">架构特点</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              采用现代化架构设计原则，确保系统的可靠性和可扩展性
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {architectureFeatures.map((feature, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-500"
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {feature.highlights.map((highlight, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 技术优势 */}
      <section className="py-16">
        <div className="container max-w-6xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">技术优势</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">为什么选择这些技术栈？</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto">
                <CpuChipIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI智能</h3>
              <p className="text-gray-600 dark:text-gray-300">
                集成豆包大模型，提供智能薪酬分析、预测和推荐，实现真正的AI驱动
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                <BoltIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">高性能</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Vite极速构建，React 18并发渲染，代码分割和懒加载，确保极致性能
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto">
                <ShieldCheckIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">安全可靠</h3>
              <p className="text-gray-600 dark:text-gray-300">
                TypeScript类型安全，多层安全防护，数据加密存储，确保系统可靠性
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                <CubeTransparentIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">可扩展</h3>
              <p className="text-gray-600 dark:text-gray-300">
                微服务架构，模块化设计，组件化开发，支持快速迭代和功能扩展
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TechArchitecture;
