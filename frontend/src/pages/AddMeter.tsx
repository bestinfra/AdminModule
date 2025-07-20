import React, { useState, useRef } from "react";
import Page from "@components/global/Page";
import { useNavigate } from "react-router-dom";
import { useFormData, createFormInputs, Form } from "@components/Form";
import type { FormInputConfig, FormInputValue, FormRef } from "@components/Form/types";

interface MeterData {
  meterName: string;
  meterId: string;
  meterNumber: string;
  meterPhase: string;
  meterType: string;
  meterColor: string;
  meterStatus: string;
  isPrepaid: boolean;
  meterLocation: string;
  meterDocument: File | null; 
  notes: string;
}

const baseFormInputs: FormInputConfig[] = [
  {
    name: "meterName",
    type: "text",
    label: "Meter Name",
    placeholder: "Enter Meter Name",
    required: true,
    validation: {
      maxLength: 5,
    },
  },
  
  {
    name: "meterId",
    type: "text",
    label: "Meter ID",
    placeholder: "Enter Meter ID",
    required: true,
  },
  {
    name: "meterNumber",
    type: "number",
    label: "Meter Number",
    placeholder: "Enter Meter Number",
    required: true,
    validation: {
      min: 1,
      max: 999999,
      custom: (value) => {
        if (typeof value === 'number' && value % 1 !== 0) {
          return 'Meter number must be a whole number';
        }
        return null;
      }
    }
  },
];

const AddMeter: React.FC = () => {
  const navigate = useNavigate();
  const formRef = useRef<FormRef>(null);
  const [formData, setFormData] = useState<Record<string, FormInputValue>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { updateFormData } = useFormData<MeterData>({
    meterName: '',
    meterId: '',
    meterNumber: '',
    meterPhase: '',
    meterType: '',
    meterColor: '',
    meterStatus: '',
    isPrepaid: false,
    meterLocation: '',
    meterDocument: null,
    notes: '',
  });

  const formInputs = createFormInputs(baseFormInputs, updateFormData);

  const handleFormChange = (data: Record<string, FormInputValue>) => {
    setFormData(data);
    console.log('Meter form data changed:', data);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSave = (formData: Record<string, any>) => {
    setIsSubmitting(true);
    
    const meterData = {
      ...formData,
    };

    console.log('Saving meter data:', meterData);

    setTimeout(() => {
      setIsSubmitting(false);
      navigate(-1);
    }, 1000);
  };

  const handleSubmitAction = () => {
    if (formRef.current) {
      const { hasErrors, validate } = formRef.current;
      
      if (!hasErrors()) {
        const { success } = validate();
        if (success) {
          const formValues = formRef.current.getFormValues();
          handleSave(formValues);
        }
      } else {
        alert('Please fix validation errors before saving.');
      }
    }
  };

  const handleCancelAction = () => {
    if (formRef.current) {
      formRef.current.reset();
      setFormData({});
    }
    navigate(-1);
  };

  return (
    <Page
      layout="single-column"
      className=""
      sections={[
        {
          id: "add-meter-form",
          component: (
            <Form
              ref={formRef}
              inputs={formInputs}
              gridLayout={{
                gridRows: 2,
                gridColumns: 3,
                gap: "gap-4",
                className: "",
                autoFullWidth: false,
              }}
              onSubmit={handleSave}
              onChange={handleFormChange}
              className=""
              isLoading={isSubmitting}
              formId="add-meter-form"
              showFormActions={true}
              submitLabel="Saving"
              cancelLabel="Cancel"
              submitAction={handleSubmitAction}
              cancelAction={handleCancelAction}
            />
          ),
        },
      ]}
    />
  );
};

export default AddMeter;
