/**
 * ISMT - Intelligent Salary Management Tool
 * 主应用程序组件
 */


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { SalaryQueryPage } from '@/pages/jobseeker/SalaryQueryPage';
import { SalaryAnalysisResultPage } from '@/pages/jobseeker/SalaryAnalysisResultPage';
import { NotificationContainer } from '@/components/Notification';
import { ResultsPage } from '@/pages/ResultsPage';
import { HRDashboard } from '@/pages/hr/HRDashboard';
import { RecruitmentPage } from '@/pages/hr/RecruitmentPage';
import ResumeScreeningWithOCR from '@/pages/hr/ResumeScreeningWithOCR';
import SimpleResumeScreening from '@/pages/hr/SimpleResumeScreening';
import { SalaryAuditPage } from '@/pages/hr/SalaryAuditPage';
import { OptimizationPage } from '@/pages/hr/OptimizationPage';
import { SalaryDiagnosisPage } from '@/pages/hr/SalaryDiagnosisPage';
import { DynamicSalaryAdjustmentPage } from '@/pages/hr/DynamicSalaryAdjustmentPage';
import { SalaryCompetitivenessRadarPage } from '@/pages/hr/SalaryCompetitivenessRadarPage';
import { AISalaryAdvisorPage } from '@/pages/hr/AISalaryAdvisorPage';
import { SalaryFairnessDetectorPage } from '@/pages/hr/SalaryFairnessDetectorPage';
import { SmartJDWriterPage } from '@/pages/hr/SmartJDWriterPage';
import { BatchJDGeneratorPage } from '@/pages/hr/BatchJDGeneratorPage';
import RetentionRiskSystemPage from '@/pages/hr/RetentionRiskSystemPage';
import TechArchitecture from '@/pages/TechArchitecture';
import EncodingTest from '@/components/test/EncodingTest';
import { JobseekerCenter } from '@/pages/JobseekerCenter';
import { CareerPlanningPage } from '@/pages/jobseeker/CareerPlanningPage';
import { MarketInsightsPage } from '@/pages/jobseeker/MarketInsightsPage';
import { SalaryCalculatorPage } from '@/pages/jobseeker/SalaryCalculatorPage';
import { InterviewNegotiationPage } from '@/pages/jobseeker/InterviewNegotiationPage';
import { SalaryMonitoringPage } from '@/pages/jobseeker/SalaryMonitoringPage';
import ResumeOptimizerPage from '@/pages/jobseeker/ResumeOptimizerPage';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AIAssistantTrigger } from '@/components/AIAssistantTrigger';
import './styles/globals.css';

function App() {
  return (
    <Router 
      basename="/"
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true
      }}
    >
      <div className="min-h-screen bg-white flex flex-col">
          <Navbar />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/query" element={<SalaryQueryPage />} />
            <Route path="/results" element={<SalaryAnalysisResultPage />} />
            <Route path="/old-results" element={<ResultsPage />} />
            
            {/* 求职者模块路由 */}
            <Route path="/jobseeker" element={<JobseekerCenter />} />
            <Route path="/career-planning" element={<CareerPlanningPage />} />
            <Route path="/market-insights" element={<MarketInsightsPage />} />
            <Route path="/salary-calculator" element={<SalaryCalculatorPage />} />
            <Route path="/interview-prep" element={<InterviewNegotiationPage />} />
            <Route path="/salary-alerts" element={<SalaryMonitoringPage />} />
            <Route path="/resume-optimizer" element={<ResumeOptimizerPage />} />
            
            {/* HR模块路由 */}
            <Route path="/hr" element={<HRDashboard />} />
            <Route path="/hr/recruitment" element={<RecruitmentPage />} />
            <Route path="/hr/resume-screening" element={<SimpleResumeScreening />} />
            <Route path="/hr/resume-screening-advanced" element={<ResumeScreeningWithOCR />} />
            <Route path="/hr/audit" element={<SalaryAuditPage />} />
            <Route path="/hr/optimization" element={<OptimizationPage />} />
                <Route path="/hr/diagnosis" element={<SalaryDiagnosisPage />} />
                <Route path="/hr/dynamic-adjustment" element={<DynamicSalaryAdjustmentPage />} />
                <Route path="/hr/competitiveness-radar" element={<SalaryCompetitivenessRadarPage />} />
                <Route path="/hr/ai-advisor" element={<AISalaryAdvisorPage />} />
                <Route path="/hr/fairness-detector" element={<SalaryFairnessDetectorPage />} />
                <Route path="/hr/smart-jd-writer" element={<SmartJDWriterPage />} />
                <Route path="/hr/batch-jd-generator" element={<BatchJDGeneratorPage />} />
                <Route path="/hr/retention-risk" element={<RetentionRiskSystemPage />} />
                
                {/* 技术架构页面 */}
                <Route path="/tech-architecture" element={<TechArchitecture />} />
                <Route path="/encoding-test" element={<EncodingTest />} />
          </Routes>
        </main>
        
        <Footer />
        
        {/* AI智能助手 */}
        <AIAssistantTrigger />
        
        {/* 全局通知容器 */}
        <NotificationContainer />
      </div>
    </Router>
  );
}

export default App;