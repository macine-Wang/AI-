/**
 * HR中心主页
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BriefcaseIcon, 
  ChartBarIcon, 
  DocumentArrowUpIcon,
  ArrowRightIcon,
  CurrencyDollarIcon,
  ScaleIcon,
  ChatBubbleLeftRightIcon,
  AdjustmentsHorizontalIcon,
  PencilSquareIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';

export const HRDashboard: React.FC = () => {
  const features = [
    {
      id: 'recruitment',
      title: '智能招聘助手',
      description: '企业级招聘全流程管理平台，从职位发布到候选人管理，提供完整的招聘解决方案',
      icon: BriefcaseIcon,
      link: '/hr/recruitment',
      color: 'bg-orange-50 text-orange-600',
      highlights: ['全流程管理', '候选人筛选', '数据分析', '市场洞察', '面试安排'],
      featured: true
    },
    {
      id: 'smart_jd_writer',
      title: '智能JD写作助手',
      description: 'AI驱动的职位描述生成平台，8大核心模块助力高效招聘',
      icon: PencilSquareIcon,
      link: '/hr/smart-jd-writer',
      color: 'bg-indigo-50 text-indigo-600',
      highlights: ['智能生成', '多语言支持', '合规检查', '一键发布'],
      featured: true
    },
    {
      id: 'diagnosis',
      title: '智能薪酬诊断中心',
      description: '一键上传企业薪酬数据，AI秒出诊断报告，提供薪酬健康度评分和优化建议',
      icon: ChartBarIcon,
      link: '/hr/diagnosis',
      color: 'bg-purple-50 text-purple-600',
      highlights: ['健康度评分', '问题识别', 'AI建议', '可视化分析'],
      featured: true
    },
    {
      id: 'competitiveness_radar',
      title: '薪酬竞争力雷达',
      description: '实时对标市场，一目了然竞争地位，监控关键岗位薪酬竞争力',
      icon: AdjustmentsHorizontalIcon,
      link: '/hr/competitiveness-radar',
      color: 'bg-blue-50 text-blue-600',
      highlights: ['市场定位', '关键岗位监控', '人才流失预警', '竞对分析']
    },
    {
      id: 'ai_advisor',
      title: 'AI薪酬顾问助手',
      description: '自然语言对话，像咨询专家一样解答薪酬问题，提供个性化建议',
      icon: ChatBubbleLeftRightIcon,
      link: '/hr/ai-advisor',
      color: 'bg-purple-50 text-purple-600',
      highlights: ['智能问答', '方案推荐', '政策解读', '最佳实践']
    },
    {
      id: 'fairness_detector',
      title: '薪酬公平性检测器',
      description: '一键扫描，发现隐藏的薪酬不公平问题，确保合规管理',
      icon: ScaleIcon,
      link: '/hr/fairness-detector',
      color: 'bg-indigo-50 text-indigo-600',
      highlights: ['同工同酬检测', '性别差距分析', '部门平衡评估', '修正建议']
    },
    {
      id: 'audit',
      title: '薪酬体系评估',
      description: '导入工资单数据，与市场薪酬对标，生成诊断报告和个性化优化方案',
      icon: DocumentArrowUpIcon,
      link: '/hr/audit',
      color: 'bg-teal-50 text-teal-600',
      highlights: ['数据对标', '诊断报告', '优化方案', '本地处理']
    },
    {
      id: 'retention_risk',
      title: '员工离职风险预警',
      description: '基于多维度数据分析，智能预测员工离职风险，提供个性化保留策略',
      icon: ShieldExclamationIcon,
      link: '/hr/retention-risk',
      color: 'bg-red-50 text-red-600',
      highlights: ['风险预测', '保留策略', '人才预警', '主动管理']
    },
    {
      id: 'dynamic_adjustment',
      title: '动态调薪决策引擎',
      description: '输入调薪预算，AI智能分配到每个员工，生成多种调薪方案并预测影响',
      icon: CurrencyDollarIcon,
      link: '/hr/dynamic-adjustment',
      color: 'bg-green-50 text-green-600',
      highlights: ['智能分配', '方案对比', '影响预测', '预算优化']
    }
  ];

  return (
    <div className="bg-gradient-to-br from-red-50 via-orange-50/30 to-white min-h-screen">
      {/* Header */}
      <section className="relative py-20 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-orange-500/5 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-400/20 to-transparent rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-orange-400/15 to-transparent rounded-full blur-3xl transform -translate-x-24 translate-y-24"></div>
        
        <div className="container max-w-6xl relative z-10">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 rounded-3xl blur-xl opacity-30"></div>
                <div className="relative p-4 bg-gradient-to-r from-red-600 to-orange-500 rounded-3xl">
                  <BriefcaseIcon className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  HR中心
                </h1>
                <p className="text-red-600 font-semibold text-lg mt-1">企业薪酬管理专家</p>
              </div>
            </div>
            
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              智能化HR工具套件，为企业提供全流程薪酬管理和人才招聘解决方案，
              <span className="text-red-600 font-semibold">提升HR工作效率</span>
            </p>
            
            <div className="flex items-center justify-center space-x-3 bg-white/70 backdrop-blur-sm rounded-full px-6 py-3 border border-red-100 shadow-lg">
              <DocumentArrowUpIcon className="w-5 h-5 text-red-600" />
              <span className="text-slate-700 font-medium">所有数据本地处理，确保企业信息安全</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 relative">
        <div className="container max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-50 to-orange-50 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-red-200">
              <BriefcaseIcon className="w-4 h-4" />
              <span>核心功能</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              AI驱动的企业薪酬管理
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              专业化薪酬管理工具，从诊断分析到优化决策，全方位提升HR工作效率
            </p>
          </div>
          {/* 特色功能 */}
          <div className="mb-16 space-y-8">
            {features.filter(f => f.featured).map((feature) => {
              const Icon = feature.icon;
              const getGradientColors = (id: string) => {
                switch(id) {
                  case 'recruitment': return {
                    bg: 'from-orange-50/80 via-white to-red-50/80',
                    border: 'border-orange-200 group-hover:border-orange-300',
                    icon: 'from-orange-600 to-red-500',
                    badge: 'from-orange-600 to-red-500',
                    hover: 'group-hover:text-orange-600'
                  };
                  case 'smart_jd_writer': return {
                    bg: 'from-indigo-50/80 via-white to-blue-50/80',
                    border: 'border-indigo-200 group-hover:border-indigo-300',
                    icon: 'from-indigo-600 to-blue-500',
                    badge: 'from-indigo-600 to-blue-500',
                    hover: 'group-hover:text-indigo-600'
                  };
                  case 'diagnosis': return {
                    bg: 'from-purple-50/80 via-white to-pink-50/80',
                    border: 'border-purple-200 group-hover:border-purple-300',
                    icon: 'from-purple-600 to-pink-500',
                    badge: 'from-purple-600 to-pink-500',
                    hover: 'group-hover:text-purple-600'
                  };
                  default: return {
                    bg: 'from-red-50/80 via-white to-orange-50/80',
                    border: 'border-red-200 group-hover:border-red-300',
                    icon: 'from-red-600 to-orange-500',
                    badge: 'from-red-600 to-orange-500',
                    hover: 'group-hover:text-red-600'
                  };
                }
              };
              const colors = getGradientColors(feature.id);
              
              return (
                <Link
                  key={feature.id}
                  to={feature.link}
                  className="group relative block overflow-hidden max-w-5xl mx-auto"
                >
                  {/* 背景装饰 */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${colors.bg} rounded-3xl border-2 ${colors.border} transition-all duration-500 group-hover:shadow-2xl`}></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-50/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-400/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative p-10">
                    <div className="flex items-center space-x-8">
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className={`absolute inset-0 bg-gradient-to-r ${colors.icon} rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                          <div className={`relative p-5 bg-gradient-to-r ${colors.icon} rounded-3xl group-hover:scale-110 transition-transform duration-500`}>
                            <Icon className="w-12 h-12 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-3 mb-3">
                              <h3 className={`text-3xl font-bold text-slate-800 transition-colors duration-300 ${colors.hover}`}>
                                {feature.title}
                              </h3>
                              <div className="relative">
                                <div className={`absolute inset-0 bg-gradient-to-r ${colors.badge} rounded-full blur-lg opacity-20`}></div>
                                <span className={`relative px-4 py-2 bg-gradient-to-r ${colors.badge} text-white text-sm font-bold rounded-full shadow-lg`}>
                                  ⭐ 核心功能
                                </span>
                              </div>
                            </div>
                            <p className="text-slate-600 leading-relaxed text-xl">
                              {feature.description}
                            </p>
                          </div>
                          <ArrowRightIcon className={`w-8 h-8 text-slate-400 group-hover:translate-x-3 transition-all duration-300 flex-shrink-0 ${colors.hover}`} />
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                          {feature.highlights.map((highlight, index) => (
                            <span
                              key={highlight}
                              className={`px-4 py-2 bg-white/80 text-sm font-semibold rounded-xl border transition-all duration-300 shadow-sm ${
                                feature.id === 'recruitment' ? 'text-orange-700 border-orange-200 group-hover:bg-orange-50 group-hover:border-orange-300' : 
                                feature.id === 'smart_jd_writer' ? 'text-indigo-700 border-indigo-200 group-hover:bg-indigo-50 group-hover:border-indigo-300' :
                                feature.id === 'diagnosis' ? 'text-purple-700 border-purple-200 group-hover:bg-purple-50 group-hover:border-purple-300' : 
                                'text-red-700 border-red-200 group-hover:bg-red-50 group-hover:border-red-300'
                              }`}
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* 其他功能 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.filter(f => !f.featured).map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.id}
                  to={feature.link}
                  className="group relative block overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 rounded-3xl border-2 border-slate-200 group-hover:border-red-200 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-red-500/10"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-red-50/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative p-8 h-full">
                    <div className="space-y-6">
                      {/* Icon */}
                      <div className="relative">
                        <div className={`absolute inset-0 ${feature.color.replace('bg-', 'bg-').replace('text-', 'bg-').replace('50', '100')} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                        <div className={`relative inline-flex p-4 rounded-2xl ${feature.color} group-hover:scale-110 transition-transform duration-500`}>
                          <Icon className="w-7 h-7" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-slate-800 group-hover:text-red-600 transition-colors duration-300">
                            {feature.title}
                          </h3>
                          <ArrowRightIcon className="w-5 h-5 text-slate-400 group-hover:text-red-600 group-hover:translate-x-2 transition-all duration-300" />
                        </div>
                        
                        <p className="text-slate-600 leading-relaxed">
                          {feature.description}
                        </p>
                        
                        {/* Highlights */}
                        <div className="flex flex-wrap gap-2">
                          {feature.highlights.map((highlight, index) => (
                            <span
                              key={highlight}
                              className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg group-hover:bg-red-50 group-hover:text-red-700 transition-colors duration-300"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center text-red-600 font-semibold group-hover:translate-x-2 transition-all duration-300 pt-2">
                          <span>了解更多</span>
                          <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              为什么选择ISMT HR中心？
            </h2>
            <p className="text-gray-600">
              基于海量真实招聘数据，提供专业的HR决策支持
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="text-3xl font-bold text-dsp-red">7亿+</div>
              <div className="text-gray-600">真实招聘职位数据</div>
            </div>
            <div className="text-center space-y-3">
              <div className="text-3xl font-bold text-dsp-red">7000+</div>
              <div className="text-gray-600">覆盖职业类别</div>
            </div>
            <div className="text-center space-y-3">
              <div className="text-3xl font-bold text-dsp-red">100%</div>
              <div className="text-gray-600">本地数据处理</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};