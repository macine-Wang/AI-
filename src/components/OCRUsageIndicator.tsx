/**
 * OCR使用次数指示器组件
 * 实时显示阿里云OCR剩余调用次数
 */

import React from 'react';
import { ExclamationTriangleIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface OCRUsageIndicatorProps {
  usedCalls: number;
  totalCalls: number;
  className?: string;
  showDetails?: boolean;
}

export const OCRUsageIndicator: React.FC<OCRUsageIndicatorProps> = ({
  usedCalls,
  totalCalls,
  className = '',
  showDetails = true
}) => {
  const remainingCalls = totalCalls - usedCalls;
  const usagePercentage = (usedCalls / totalCalls) * 100;

  // 根据使用比例确定状态
  const getStatus = () => {
    if (usagePercentage >= 90) return { color: 'red', icon: XCircleIcon, text: '紧急' };
    if (usagePercentage >= 70) return { color: 'yellow', icon: ExclamationTriangleIcon, text: '警告' };
    return { color: 'green', icon: CheckCircleIcon, text: '正常' };
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  // 渐变色
  const getGradientColor = () => {
    if (usagePercentage >= 90) return 'from-red-500 to-red-600';
    if (usagePercentage >= 70) return 'from-yellow-500 to-orange-500';
    return 'from-green-500 to-emerald-500';
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* 顶部标题栏 */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded-lg bg-${status.color}-100`}>
              <StatusIcon className={`h-5 w-5 text-${status.color}-600`} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">OCR调用额度</h3>
              <p className="text-xs text-gray-500">阿里云高精版OCR</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium bg-${status.color}-100 text-${status.color}-700`}>
            {status.text}
          </div>
        </div>
      </div>

      {/* 进度条区域 */}
      <div className="px-4 py-4">
        {/* 数字显示 */}
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="text-3xl font-bold text-gray-900">
              {remainingCalls}
              <span className="text-lg text-gray-500 ml-1">次</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">剩余可用次数</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-700">
              {usedCalls} / {totalCalls}
            </div>
            <p className="text-xs text-gray-500 mt-1">已使用 / 总额度</p>
          </div>
        </div>

        {/* 进度条 */}
        <div className="relative">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${getGradientColor()} transition-all duration-500 ease-out relative`}
              style={{ width: `${usagePercentage}%` }}
            >
              {/* 动画光效 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
            </div>
          </div>
          <div className="mt-1.5 text-right">
            <span className={`text-xs font-medium text-${status.color}-600`}>
              {usagePercentage.toFixed(1)}% 已使用
            </span>
          </div>
        </div>

        {/* 详细信息 */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2 rounded-lg bg-blue-50">
                <div className="text-lg font-bold text-blue-600">{totalCalls}</div>
                <div className="text-xs text-gray-600 mt-0.5">总额度</div>
              </div>
              <div className="p-2 rounded-lg bg-purple-50">
                <div className="text-lg font-bold text-purple-600">{usedCalls}</div>
                <div className="text-xs text-gray-600 mt-0.5">已使用</div>
              </div>
              <div className="p-2 rounded-lg bg-green-50">
                <div className="text-lg font-bold text-green-600">{remainingCalls}</div>
                <div className="text-xs text-gray-600 mt-0.5">剩余</div>
              </div>
            </div>
          </div>
        )}

        {/* 警告提示 */}
        {usagePercentage >= 70 && (
          <div className={`mt-4 p-3 rounded-lg bg-${status.color}-50 border border-${status.color}-200`}>
            <div className="flex items-start space-x-2">
              <ExclamationTriangleIcon className={`h-5 w-5 text-${status.color}-600 flex-shrink-0 mt-0.5`} />
              <div className="flex-1">
                <p className={`text-sm font-medium text-${status.color}-800`}>
                  {usagePercentage >= 90 
                    ? '⚠️ OCR额度即将用尽！' 
                    : '⚠️ OCR额度使用较多'}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {usagePercentage >= 90
                    ? `仅剩 ${remainingCalls} 次调用额度，请注意控制使用频率`
                    : `还剩 ${remainingCalls} 次调用额度，建议合理安排使用`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 额度用尽提示 */}
        {remainingCalls === 0 && (
          <div className="mt-4 p-4 rounded-lg bg-red-50 border-2 border-red-300">
            <div className="text-center">
              <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-red-800">OCR额度已用尽</p>
              <p className="text-xs text-gray-600 mt-1">
                请联系管理员增加额度或等待下月重置
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 迷你版指示器（用于顶部导航栏）
export const OCRUsageMini: React.FC<{ usedCalls: number; totalCalls: number }> = ({ 
  usedCalls, 
  totalCalls 
}) => {
  const remainingCalls = totalCalls - usedCalls;
  const usagePercentage = (usedCalls / totalCalls) * 100;

  const getStatusColor = () => {
    if (usagePercentage >= 90) return 'red';
    if (usagePercentage >= 70) return 'yellow';
    return 'green';
  };

  const statusColor = getStatusColor();

  return (
    <div className="flex items-center space-x-2 px-3 py-1.5 bg-white rounded-full shadow-sm border border-gray-200">
      <div className="relative">
        <div className={`h-2 w-2 rounded-full bg-${statusColor}-500 animate-pulse`} />
      </div>
      <span className="text-xs font-medium text-gray-700">
        OCR: <span className="font-bold text-gray-900">{remainingCalls}</span>
        <span className="text-gray-400">/{totalCalls}</span>
      </span>
    </div>
  );
};

