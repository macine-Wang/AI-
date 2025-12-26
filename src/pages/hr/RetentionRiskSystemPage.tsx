/**
 * 员工离职风险预警系统页面
 * 基于多维度数据分析，预测员工离职风险
 */

import React, { useState, useEffect } from 'react';
import {
  ExclamationTriangleIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ShieldExclamationIcon,
  LightBulbIcon,
  MagnifyingGlassIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline';

// 类型定义
interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  tenure: number; // 工作年限
  lastPromotionDate: string;
  currentSalary: number;
  marketSalary: number;
  performanceScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  riskFactors: RiskFactor[];
  predictedTimeframe: string;
  avatar?: string;
}

interface RiskFactor {
  factor: string;
  impact: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  description: string;
}

interface RetentionStrategy {
  type: 'salary' | 'promotion' | 'training' | 'environment' | 'recognition';
  title: string;
  description: string;
  urgency: 'immediate' | 'short-term' | 'long-term';
  cost: 'low' | 'medium' | 'high';
}

const RetentionRiskSystemPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showStrategies, setShowStrategies] = useState(false);

  // 模拟数据
  useEffect(() => {
    const mockEmployees: Employee[] = [
      {
        id: '1',
        name: '张三',
        position: '高级前端工程师',
        department: '技术部',
        tenure: 2.5,
        lastPromotionDate: '2023-01-15',
        currentSalary: 18000,
        marketSalary: 22000,
        performanceScore: 4.2,
        riskLevel: 'high',
        riskScore: 78,
        predictedTimeframe: '2-3个月内',
        riskFactors: [
          { factor: '薪酬低于市场水平', impact: 35, trend: 'increasing', description: '当前薪酬比市场均价低18%' },
          { factor: '晋升周期过长', impact: 25, trend: 'stable', description: '已14个月未获得晋升' },
          { factor: '工作负荷过重', impact: 18, trend: 'increasing', description: '近期项目压力较大' }
        ]
      },
      {
        id: '2',
        name: '李四',
        position: '产品经理',
        department: '产品部',
        tenure: 1.8,
        lastPromotionDate: '2024-06-01',
        currentSalary: 16000,
        marketSalary: 19000,
        performanceScore: 4.5,
        riskLevel: 'medium',
        riskScore: 62,
        predictedTimeframe: '4-6个月内',
        riskFactors: [
          { factor: '薪酬竞争力不足', impact: 28, trend: 'stable', description: '薪酬水平略低于市场' },
          { factor: '职业发展空间有限', impact: 20, trend: 'increasing', description: '缺乏明确的晋升路径' },
          { factor: '团队协作满意度', impact: 14, trend: 'decreasing', description: '与技术团队配合待改善' }
        ]
      },
      {
        id: '3',
        name: '王五',
        position: 'UI设计师',
        department: '设计部',
        tenure: 3.2,
        lastPromotionDate: '2023-09-01',
        currentSalary: 14000,
        marketSalary: 16000,
        performanceScore: 4.0,
        riskLevel: 'critical',
        riskScore: 85,
        predictedTimeframe: '1个月内',
        riskFactors: [
          { factor: '薪酬严重偏低', impact: 40, trend: 'increasing', description: '薪酬比市场低14%' },
          { factor: '工作内容单一', impact: 25, trend: 'increasing', description: '缺乏挑战性项目' },
          { factor: '团队氛围问题', impact: 20, trend: 'stable', description: '部门内部沟通不畅' }
        ]
      },
      {
        id: '4',
        name: '刘大强',
        position: '后端工程师',
        department: '技术部',
        tenure: 4.1,
        lastPromotionDate: '2024-03-01',
        currentSalary: 20000,
        marketSalary: 21000,
        performanceScore: 3.8,
        riskLevel: 'low',
        riskScore: 35,
        predictedTimeframe: '12个月以上',
        riskFactors: [
          { factor: '技能提升需求', impact: 15, trend: 'stable', description: '希望学习新技术栈' },
          { factor: '工作稳定性高', impact: -10, trend: 'stable', description: '对当前工作较为满意' }
        ]
      }
    ];
    
    setEmployees(mockEmployees);
    setFilteredEmployees(mockEmployees);
  }, []);

  // 筛选和搜索
  useEffect(() => {
    let filtered = employees;
    
    if (filterRisk !== 'all') {
      filtered = filtered.filter(emp => emp.riskLevel === filterRisk);
    }
    
    if (filterDepartment !== 'all') {
      filtered = filtered.filter(emp => emp.department === filterDepartment);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredEmployees(filtered);
  }, [employees, filterRisk, filterDepartment, searchTerm]);

  // 获取风险等级颜色
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  // 获取风险等级文本
  const getRiskText = (level: string) => {
    switch (level) {
      case 'critical': return '极高风险';
      case 'high': return '高风险';
      case 'medium': return '中风险';
      case 'low': return '低风险';
      default: return '未知';
    }
  };

  // 获取趋势图标
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <ArrowTrendingUpIcon className="w-4 h-4 text-red-500" />;
      case 'decreasing': return <ArrowTrendingDownIcon className="w-4 h-4 text-green-500" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  // 生成保留策略
  const generateRetentionStrategies = (employee: Employee): RetentionStrategy[] => {
    const strategies: RetentionStrategy[] = [];
    
    if (employee.currentSalary < employee.marketSalary) {
      strategies.push({
        type: 'salary',
        title: '薪酬调整',
        description: `建议将薪酬调整至${employee.marketSalary}元，与市场水平保持一致`,
        urgency: employee.riskLevel === 'critical' ? 'immediate' : 'short-term',
        cost: 'high'
      });
    }
    
    if (employee.tenure > 2 && !employee.lastPromotionDate.includes('2024')) {
      strategies.push({
        type: 'promotion',
        title: '晋升机会',
        description: '考虑提供晋升机会或明确职业发展路径',
        urgency: 'short-term',
        cost: 'medium'
      });
    }
    
    strategies.push({
      type: 'training',
      title: '技能培训',
      description: '提供专业技能培训或学习机会，增强员工能力',
      urgency: 'long-term',
      cost: 'low'
    });
    
    if (employee.riskLevel === 'critical' || employee.riskLevel === 'high') {
      strategies.push({
        type: 'recognition',
        title: '认可激励',
        description: '增加工作认可和成就感，改善工作环境',
        urgency: 'immediate',
        cost: 'low'
      });
    }
    
    return strategies;
  };

  const departments = ['all', '技术部', '产品部', '设计部', '运营部', '市场部'];
  const riskLevels = [
    { value: 'all', label: '全部风险等级' },
    { value: 'critical', label: '极高风险' },
    { value: 'high', label: '高风险' },
    { value: 'medium', label: '中风险' },
    { value: 'low', label: '低风险' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50/30 to-white dark:from-gray-900 dark:via-red-900/10 dark:to-gray-900">
      {/* 页面头部 */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-orange-500/5 to-transparent"></div>
        
        <div className="container max-w-7xl relative z-10">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 rounded-3xl blur-xl opacity-30"></div>
                <div className="relative p-4 bg-gradient-to-r from-red-600 to-orange-500 rounded-3xl">
                  <ShieldExclamationIcon className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  员工离职风险预警系统
                </h1>
                <p className="text-red-600 dark:text-red-400 font-semibold text-lg mt-1">智能预测，主动保留</p>
              </div>
            </div>
            
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              基于薪酬竞争力、工作满意度、发展机会等多维度数据，
              <span className="text-red-600 dark:text-red-400 font-semibold">AI智能预测员工离职风险并提供保留策略</span>
            </p>
          </div>
        </div>
      </section>

      {/* 统计概览 */}
      <section className="py-8">
        <div className="container max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">极高风险</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {employees.filter(e => e.riskLevel === 'critical').length}
                  </p>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                  <BellAlertIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">高风险</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {employees.filter(e => e.riskLevel === 'high').length}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                  <ExclamationTriangleIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">中风险</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {employees.filter(e => e.riskLevel === 'medium').length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                  <ClockIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">总员工数</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {employees.length}
                  </p>
                </div>
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                  <UserGroupIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 筛选和搜索 */}
      <section className="py-4">
        <div className="container max-w-7xl">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索员工姓名或职位..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4">
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {riskLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
                
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">全部部门</option>
                  {departments.slice(1).map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 员工列表 */}
      <section className="py-8">
        <div className="container max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                onClick={() => setSelectedEmployee(employee)}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {employee.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{employee.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{employee.position}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{employee.department}</p>
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getRiskColor(employee.riskLevel)}`}>
                    {getRiskText(employee.riskLevel)}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">风险评分</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            employee.riskScore >= 80 ? 'bg-red-500' :
                            employee.riskScore >= 60 ? 'bg-orange-500' :
                            employee.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${employee.riskScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {employee.riskScore}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">预测时间</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {employee.predictedTimeframe}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">薪酬竞争力</span>
                    <span className={`text-sm font-medium ${
                      employee.currentSalary < employee.marketSalary ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                    }`}>
                      {((employee.currentSalary / employee.marketSalary) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">主要风险因素</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {employee.riskFactors.length} 项
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 员工详情模态框 */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                    {selectedEmployee.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedEmployee.name}</h2>
                    <p className="text-gray-600 dark:text-gray-300">{selectedEmployee.position}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedEmployee.department}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* 风险概览 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <ChartBarIcon className="w-5 h-5 mr-2 text-red-600" />
                  风险分析
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">{selectedEmployee.riskScore}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">风险评分</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {selectedEmployee.predictedTimeframe}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">预测离职时间</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {selectedEmployee.performanceScore.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">绩效评分</div>
                  </div>
                </div>
              </div>

              {/* 风险因素详情 */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">风险因素分析</h4>
                <div className="space-y-3">
                  {selectedEmployee.riskFactors.map((factor, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900 dark:text-white">{factor.factor}</span>
                          {getTrendIcon(factor.trend)}
                        </div>
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                          影响度: {factor.impact}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{factor.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 保留策略 */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                    <LightBulbIcon className="w-5 h-5 mr-2 text-yellow-500" />
                    保留策略建议
                  </h4>
                  <button
                    onClick={() => setShowStrategies(!showStrategies)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {showStrategies ? '收起' : '展开'}
                  </button>
                </div>
                
                {showStrategies && (
                  <div className="space-y-3">
                    {generateRetentionStrategies(selectedEmployee).map((strategy, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900 dark:text-white">{strategy.title}</h5>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              strategy.urgency === 'immediate' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                              strategy.urgency === 'short-term' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                              'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            }`}>
                              {strategy.urgency === 'immediate' ? '立即执行' :
                               strategy.urgency === 'short-term' ? '短期' : '长期'}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              strategy.cost === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                              strategy.cost === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                              'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            }`}>
                              {strategy.cost === 'high' ? '高成本' :
                               strategy.cost === 'medium' ? '中成本' : '低成本'}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{strategy.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetentionRiskSystemPage;
