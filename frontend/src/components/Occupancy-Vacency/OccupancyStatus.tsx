import React, { useState } from "react";
import PageC from "@/components/global/PageC";

interface OccupancyStatusProps {
  HeaderTest?: React.ComponentType<any>;
}

interface Step {
  id: number;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}

const OccupancyStatus: React.FC<OccupancyStatusProps> = ({  }) => {
  const [currentStep, setCurrentStep] = useState(2); // Start at step 2 (Usage-Summary) as shown in image

  const steps: Step[] = [
    {
      id: 1,
      label: "Confirmation",
      isActive: currentStep === 1,
      isCompleted: currentStep > 1,
    },
    {
      id: 2,
      label: "Usage-Summary",
      isActive: currentStep === 2,
      isCompleted: currentStep > 2,
    },
    {
      id: 3,
      label: "Payment",
      isActive: currentStep === 3,
      isCompleted: currentStep > 3,
    },
    {
      id: 4,
      label: "Freeze-Status",
      isActive: currentStep === 4,
      isCompleted: currentStep > 4,
    },
  ];

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
  };

  return (
    <div className="h-screen overflow-hidden scroll-y-hidden">
      <PageC
        sections={[
          {
            layout: {
              type: "column",
              className: "bg-white px-6 py-4",
              gap: "gap-6",
            },
            components: [
              {
                name: "Steps",
                props: {
                  steps: steps,
                  currentStep: currentStep,
                  onStepClick: handleStepClick,
                  className: "w-full justify-center ",
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default OccupancyStatus;
