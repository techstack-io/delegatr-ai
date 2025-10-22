// components/tour/scout-tour.tsx
'use client';

import { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Bot, Target, Users, BarChart3, CheckCircle } from 'lucide-react';

interface TourStep {
  id: number;
  title: string;
  description: string;
  highlight?: string;
  position: 'center' | 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    id: 1,
    title: "Meet Scout!",
    description: "Hi! I'm Scout, your AI lead intelligence agent. I'm here to help you find and prioritize your best leads. Let me show you around with a sample week of data!",
    position: 'center'
  },
  {
    id: 2,
    title: "Your Dashboard",
    description: "This is your command center. Here's what last week looked like: 245 visitors monitored, 12 hot targets identified, and 34 promising leads flagged.",
    highlight: 'stats-cards',
    position: 'top'
  },
  {
    id: 3,
    title: "Hot Targets",
    description: "These are your priority prospects! I analyze visitor behavior and score each lead. Scores above 85 are high-intent targets worth immediate attention.",
    highlight: 'hot-leads',
    position: 'center'
  },
  {
    id: 4,
    title: "Weekly Reports",
    description: "Every Monday morning, I'll deliver a comprehensive intel report with all your leads organized by priority. No manual work needed!",
    position: 'center'
  },
  {
    id: 5,
    title: "Ready to Deploy?",
    description: "That's the tour! Now let's connect your Leadfeeder account so I can start scouting real leads for you. It takes less than 2 minutes!",
    position: 'center'
  }
];

export function ScoutTour({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const step = tourSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      setIsVisible(false);
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" />

      {/* Tour Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-purple-600 p-6 relative">
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{step.title}</h2>
                <p className="text-purple-100 text-sm">
                  Step {currentStep + 1} of {tourSteps.length}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {step.description}
            </p>

            {/* Sample Data Preview */}
            {currentStep === 1 && <StatsPreview />}
            {currentStep === 2 && <HotLeadsPreview />}

            {/* Progress Dots */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'w-8 bg-purple-600'
                      : index < currentStep
                      ? 'w-2 bg-purple-400'
                      : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={isFirstStep}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  isFirstStep
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>

              <button
                onClick={handleSkip}
                className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >
                Skip Tour
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all shadow-lg"
              >
                {isLastStep ? (
                  <>
                    Get Started
                    <CheckCircle className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StatsPreview() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-6 bg-purple-50 rounded-xl border border-purple-200">
      <StatMini icon={<Users className="w-5 h-5" />} label="Total Leads" value="245" color="purple" />
      <StatMini icon={<Target className="w-5 h-5" />} label="Hot Leads" value="12" color="red" />
      <StatMini icon={<BarChart3 className="w-5 h-5" />} label="Agent Runs" value="8" color="blue" />
      <StatMini icon={<Bot className="w-5 h-5" />} label="Active" value="24/7" color="green" />
    </div>
  );
}

function StatMini({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const colorClasses = {
    purple: "text-purple-600 bg-purple-100",
    red: "text-red-600 bg-red-100",
    blue: "text-blue-600 bg-blue-100",
    green: "text-green-600 bg-green-100"
  }[color];

  return (
    <div className="text-center">
      <div className={`w-10 h-10 ${colorClasses} rounded-lg flex items-center justify-center mx-auto mb-2`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-600">{label}</p>
    </div>
  );
}

function HotLeadsPreview() {
  return (
    <div className="space-y-3 mb-6 p-6 bg-purple-50 rounded-xl border border-purple-200">
      <LeadPreviewCard
        company="TechCorp Solutions"
        score={95}
        trend="Viewed pricing 3x"
      />
      <LeadPreviewCard
        company="Global Manufacturing"
        score={92}
        trend="Downloaded case study"
      />
      <LeadPreviewCard
        company="HealthTech Partners"
        score={88}
        trend="Heavy compliance research"
      />
    </div>
  );
}

function LeadPreviewCard({ company, score, trend }: { company: string; score: number; trend: string }) {
  return (
    <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border border-purple-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
          {company.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{company}</p>
          <p className="text-xs text-gray-500">{trend}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-purple-600">{score}</p>
        <p className="text-xs text-gray-500">Score</p>
      </div>
    </div>
  );
}