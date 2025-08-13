"use client";

import { useState } from "react";
import { WizardStepProps } from "@/types/wizard";

interface WizardProps {
  steps: React.ReactElement<WizardStepProps>[];
}

export default function Wizard({ steps }: WizardProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const CurrentStepComponent = steps[currentStep];

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-6 flex justify-between">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className={`flex-1 text-center ${
              idx === currentStep ? "font-bold text-blue-600" : "text-gray-400"
            }`}
          >
            Step {idx + 1}
          </div>
        ))}
      </div>

      {CurrentStepComponent}

      <div className="mt-6 flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {currentStep === steps.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
