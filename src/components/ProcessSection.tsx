import React, { useState, useEffect } from 'react';
import { Ear, Pencil, Box, Ruler, Hammer, Home, PhoneCall, Activity } from 'lucide-react';
import { useStudioData } from '../context/StudioDataContext';

interface ProcessSectionProps {
  onOpenContact: () => void;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ onOpenContact }) => {
  const { processSteps, siteContent } = useStudioData();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isAutoCycling, setIsAutoCycling] = useState<boolean>(true);

  const processPageTitle = siteContent?.processPageTitle || 'Our Collaborative 6-Step Process.';
  const processPageSubtitle = siteContent?.processPageSubtitle || 'METHODOLOGY & WORKFLOW';
  const processPageDescription = siteContent?.processPageDescription || 'Continuous rhythmic cadence from deep listening to keys handover. Click any phase to inspect details.';
  const editableProcessSteps = siteContent?.processSteps || processSteps;

  useEffect(() => {
    if (!isAutoCycling || editableProcessSteps.length === 0) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % editableProcessSteps.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoCycling, editableProcessSteps.length]);

  const currentStepIndex = Math.min(activeStep, Math.max(0, editableProcessSteps.length - 1));
  const currentStep = editableProcessSteps[currentStepIndex] || {
    number: '01',
    title: 'LISTEN',
    iconName: 'Ear',
    description: 'We listen deeply to understand your needs, context and aspirations.'
  };

  const getProcessIcon = (name: string) => {
    switch (name) {
      case 'Ear': return <Ear className="w-4 h-4" />;
      case 'Pencil': return <Pencil className="w-4 h-4" />;
      case 'Box': return <Box className="w-4 h-4" />;
      case 'Ruler': return <Ruler className="w-4 h-4" />;
      case 'Hammer': return <Hammer className="w-4 h-4" />;
      case 'Home': return <Home className="w-4 h-4" />;
      default: return <Pencil className="w-4 h-4" />;
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-[#F4F1EC] border-b border-[#D8D2C7]">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#8A6A3D] font-semibold block">
                {processPageSubtitle}
              </span>
              <span className="inline-flex items-center gap-1 bg-[#8A6A3D]/15 text-[#8A6A3D] border border-[#8A6A3D]/30 px-2 py-0.5 text-[9px] tracking-[0.15em] uppercase font-medium">
                <Activity className="w-2.5 h-2.5 animate-pulse text-[#8A6A3D]" />
                <span>STEP-BY-STEP BOUNCING WAVE</span>
              </span>
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#1C1C1C] font-normal">
              {processPageTitle}
            </h3>
          </div>

          <div className="flex items-center gap-4 mt-3 md:mt-0">
            <p className="text-xs text-[#1C1C1C]/70 max-w-sm">
              {processPageDescription}
            </p>
          </div>
        </div>

        {/* 6 Process Cards Grid with Continuous Step-by-Step Bouncing Wave Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8 pt-4 pb-2">
          {editableProcessSteps.map((step, index) => {
            const bounceClass = `animate-step-bounce-${index % 6}`;
            const numPopClass = `animate-num-pop-${index % 6}`;
            const iconPulseClass = `animate-icon-pulse-${index % 6}`;
            const isActive = activeStep === index;

            return (
              <div
                key={step.number}
                onClick={() => {
                  setActiveStep(index);
                  setIsAutoCycling(false);
                }}
                className={`p-5 border cursor-pointer transition-all duration-300 flex flex-col justify-between min-h-[230px] rounded-none will-change-transform ${bounceClass} ${
                  isActive
                    ? 'bg-[#1C1C1C] text-white border-[#8A6A3D] shadow-xl'
                    : 'bg-[#E6E1DB]/50 text-[#1C1C1C] border-[#D8D2C7] hover:border-[#8A6A3D]'
                }`}
                title={`Phase ${step.number}: ${step.title}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`font-serif text-3xl font-light transition-all ${numPopClass} ${
                        isActive ? 'text-[#8A6A3D]' : 'text-[#1C1C1C]'
                      }`}
                    >
                      {step.number}
                    </span>
                    <div
                      className={`p-1.5 border transition-all ${iconPulseClass} ${
                        isActive
                          ? 'border-[#8A6A3D] text-[#8A6A3D] bg-[#8A6A3D]/20'
                          : 'border-[#D8D2C7] text-[#1C1C1C]/70 bg-white/40'
                      }`}
                    >
                      {getProcessIcon(step.iconName)}
                    </div>
                  </div>

                  <h4
                    className={`font-sans text-xs tracking-[0.2em] uppercase font-semibold mb-2 transition-colors ${
                      isActive ? 'text-white' : 'text-[#1C1C1C]'
                    }`}
                  >
                    {step.title}
                  </h4>

                  <p
                    className={`text-[11px] leading-relaxed transition-colors ${
                      isActive ? 'text-white/85' : 'text-[#1C1C1C]/75'
                    }`}
                  >
                    {step.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-current/20 flex items-center justify-between text-[9px] tracking-[0.15em] uppercase opacity-70">
                  <span>PHASE {step.number}</span>
                  <span className="text-[#8A6A3D] font-mono">0{index + 1}/06</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Step Highlight Details Box */}
        <div className="bg-[#1C1C1C] text-white p-6 sm:p-8 border border-[#1C1C1C] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="flex items-start gap-4">
            <span className="font-serif text-4xl sm:text-5xl text-[#8A6A3D] font-light leading-none">
              {currentStep.number}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] tracking-[0.2em] uppercase text-[#8A6A3D] font-semibold block">
                  ACTIVE METHODOLOGY HIGHLIGHT
                </span>
                <span className="text-[9px] text-white/40 tracking-wider">
                  · PHASE {currentStepIndex + 1} OF 6
                </span>
              </div>
              <h4 className="font-serif text-2xl text-white font-light mt-0.5">
                {currentStep.title}
              </h4>
              <p className="text-xs text-white/80 mt-1 max-w-2xl leading-relaxed">
                {currentStep.description} During this phase, client collaboration, spatial volume planning, and material selections take center stage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsAutoCycling(!isAutoCycling)}
              className="border border-white/20 text-white/80 hover:text-white hover:border-white px-4 py-3 text-[10px] tracking-[0.15em] uppercase font-medium transition-colors cursor-pointer"
              title="Toggle continuous step cycle"
            >
              {isAutoCycling ? 'PAUSE WAVE' : 'RESUME WAVE'}
            </button>
            <button
              onClick={onOpenContact}
              className="bg-[#8A6A3D] hover:bg-[#6e532d] text-white px-6 py-3 text-xs tracking-[0.2em] uppercase font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>START AT PHASE {currentStep.number}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
