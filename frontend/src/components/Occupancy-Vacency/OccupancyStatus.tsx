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

// Data interfaces for each step
interface OccupancyData {
  unit_id?: string;
  meter_no?: string;
  consumer_name?: string;
  property_address?: string;
  current_reading?: string;
  previous_reading?: string;
  electricity_usage?: string;
  electricity_charges?: string;
  final_amount?: string;
  bill_date?: string;
  bill_id?: string;
  payment_method?: string;
  completion_date?: string;
}

const OccupancyStatus: React.FC<OccupancyStatusProps> = ({  }) => {
  const [currentStep, setCurrentStep] = useState(1); // Start at step 1 (Confirmation) as shown in image

  // Centralized data management for all steps
  const [occupancyData, setOccupancyData] = useState<OccupancyData>({
    unit_id: "UNIT001",
    meter_no: "METER123",
    consumer_name: "John Doe",
    property_address: "123 Main Street, City, State",
    current_reading: "1200.00",
    previous_reading: "1000.00",
    electricity_usage: "200.00",
    electricity_charges: "1500.00",
    final_amount: "1500.00",
    bill_date: "August 6, 2025",
    bill_id: "BILL00123",
    payment_method: "Cash",
    completion_date: "August 6, 2025 at 2:30 PM"
  });

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

  const handleDarkModeToggle = () => {
    // Handle dark mode toggle
    console.log("Dark mode toggled");
  };

  const handleClose = () => {
    // Handle close action
    console.log("Close clicked");
  };

  const handleLogoClick = () => {
    // Handle logo click - navigate to dashboard or home
    console.log("Logo clicked");
  };

  // Update occupancy data
  const updateOccupancyData = (newData: Partial<OccupancyData>) => {
    setOccupancyData(prev => ({ ...prev, ...newData }));
  };

  // Get the component name and props based on current step
  const getStepComponentConfig = () => {
    switch (currentStep) {
      case 1:
        return {
          name: "ConfirmationPage",
          props: {
            currentStep: currentStep,
            onStepChange: setCurrentStep,
            unit_id: occupancyData.unit_id,
            meter_no: occupancyData.meter_no,
            consumer_name: occupancyData.consumer_name,
            property_address: occupancyData.property_address,
            className: "w-full h-full",
          }
        };
      case 2:
        return {
          name: "UsageSummaryPage",
          props: {
            currentStep: currentStep,
            onStepChange: setCurrentStep,
            meter_no: occupancyData.meter_no,
            unit_id: occupancyData.unit_id,
            previous_reading: occupancyData.previous_reading,
            final_reading: occupancyData.current_reading,
            electricity_usage: occupancyData.electricity_usage,
            electricity_charges: occupancyData.electricity_charges,
            onDataUpdate: updateOccupancyData,
            className: "w-full h-full",
          }
        };
      case 3:
        return {
          name: "Payment",
          props: {
            currentStep: currentStep,
            onStepChange: setCurrentStep,
            amount: occupancyData.final_amount,
            billId: occupancyData.bill_id,
            billDate: occupancyData.bill_date,
            onPaymentComplete: (paymentMethod: string) => {
              updateOccupancyData({ payment_method: paymentMethod });
              setCurrentStep(4);
            },
            className: "w-full h-full",
          }
        };
      case 4:
        return {
          name: "FreezeStatus",
          props: {
            currentStep: currentStep,
            onStepChange: setCurrentStep,
            completionDate: occupancyData.completion_date,
            electricity_usage: occupancyData.electricity_usage,
            final_reading: occupancyData.current_reading,
            final_amount: occupancyData.final_amount,
            payment_method: occupancyData.payment_method,
            onDone: () => {
              console.log("Occupancy process completed");
              // Navigate to dashboard or show success message
            },
            className: "w-full h-full",
          }
        };
      default:
        return {
          name: "ConfirmationPage",
          props: {
            currentStep: currentStep,
            onStepChange: setCurrentStep,
            className: "w-full h-full",
          }
        };
    }
  };

  const stepConfig = getStepComponentConfig();

  return (
    <div className="h-screen overflow-hidden scroll-y-hidden bg-background-secondary">
      <PageC
        sections={[
          {
            layout: {
              type: "column",
              className: "bg-background-secondary h-100vh",
              gap: "gap-0",
              rows: [
                {
                  layout: "row",
                  columns: [
                    {
                      name: "OccupancyHeader",
                      props: {
                        logo: "/icons/bi-logo-latest.svg", // Pass icon path
                        onLogoClick: handleLogoClick,
                        steps: steps,
                        currentStep: currentStep,
                        onStepClick: handleStepClick,
                        onDarkModeToggle: handleDarkModeToggle,
                        onClose: handleClose,
                        className: "border-b border-gray-200",
                      },
                    },
                  ],
                },
                {
                  layout: "row",
                  className: "flex-1",
                  columns: [
                    {
                      name: stepConfig.name,
                      props: stepConfig.props,
                    },
                  ],
                },
              ],
            },
          },
        ]}
      />
    </div>
  );
};

export default OccupancyStatus;
