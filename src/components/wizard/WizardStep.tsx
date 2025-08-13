// components/Wizard/WizardStep.tsx
import { WizardStepProps } from "@/types/wizard";

export default function WizardStep({ children }: WizardStepProps) {
  return <div className="bg-white p-6 shadow rounded">{children}</div>;
}
