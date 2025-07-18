import React from "react";
import Page from "@components/global/Page";
import { useNavigate } from "react-router-dom";
import { useFormData, createFormInputs, Form } from "@components/Form";
import type { FormInputConfig } from "@components/Form";

// Define the meter data structure
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

// Base form inputs without onChange handlers
const baseFormInputs: FormInputConfig[] = [
  {
    name: "meterName",
    type: "text",
    label: "Meter Name",
    placeholder: "Enter meter name",
    required: true,
    row: 1,
    validation: {
      maxLength: 5,
    },
  },
  {
    name: "meterId",
    type: "text",
    label: "Meter ID",
    placeholder: "Enter meter ID",
    required: true,
    row: 1,
  },
  {
    name: "meterNumber",
    type: "text",
    label: "Meter Number",
    placeholder: "Enter meter number",
    required: true,
    row: 1,
  },
  {
    name: "meterPhase",
    type: "radio",
    label: "Meter Phase",
    options: [
      { value: "single", label: "Single Phase" },
      { value: "three", label: "Three Phase" }
    ],
    row: 2,
  },
  {
    name: "meterType",
    type: "dropdown",
    label: "Meter Type",
    placeholder: "Select meter type",
    required: true,
    options: [
      { value: "smart", label: "Smart Meter" },
      { value: "digital", label: "Digital Meter" },
      { value: "analog", label: "Analog Meter" }
    ],
    row: 2,
  },
  {
    name: "meterColor",
    type: "colorpicker",
    label: "Meter Color",
    required: true,
    colorOptions: [
      { value: "#ff0000", label: "Red", color: "#ff0000" },
      { value: "#00ff00", label: "Green", color: "#00ff00" },
      { value: "#0000ff", label: "Blue", color: "#0000ff" },
      { value: "#ffa500", label: "Orange", color: "#ffa500" },
    ],
    row: 2,
  },
  {
    name: "meterStatus",
    type: "dropdown",
    label: "Meter Status",
    placeholder: "Select meter status",
    required: true,
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "maintenance", label: "Maintenance" }
    ],
    row: 2,
  },
  {
    name: "isPrepaid",
    type: "switch",
    label: "Prepaid Meter",
    description: "Enable if this is a prepaid meter.",
    row: 3,
  },
  {
    name: "meterLocation",
    type: "text",
    label: "Meter Location",
    placeholder: "Enter meter location",
    row: 3,
  },
  {
    name:"choseFile",
    type: "chosenfile",
    label: "Meter Document",
    placeholder: "Choose a file",
    accept: "image/*,application/pdf,.doc,.docx",
    row: 3,
  },
  {
    name:"notes",
    label: "Notes",
    type: "textareafield",
    placeholder: "Enter any additional notes",
    row: 3,
  },
];

const AddMeter: React.FC = () => {
  const navigate = useNavigate();
  
  // Use the custom hook for form data management
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

  // Create form inputs with onChange handlers
  const formInputs = createFormInputs(baseFormInputs, updateFormData);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSave = (formData: Record<string, any>) => {
    console.log('AddMeter Form Data:', formData);
    
    // Process the form data
    const meterData = {
      ...formData,
      createdAt: new Date().toISOString(),
    };

    console.log('Processed Meter Data:', meterData);
    console.log('Current State Data:', formData);
    
    // TODO: Send data to API
    // Example: await api.createMeter(meterData);
    
    alert("Meter data collected successfully!");
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
              inputs={formInputs}
              rowLayout={{
                rows: [
                  // Row 1: 2 inputs in 2-column grid (each input takes 1 column - equal width)
                  { row: 1, columns: 3, gap: "gap-4", autoFullWidth: true },
                  { row: 2, columns: 3, gap: "gap-4", autoFullWidth: true },
                  {row: 3, columns: 3, gap: "gap-4", autoFullWidth: true },
              
                ],
              }}
              onSubmit={handleSave}
              onCancel={handleCancel}
              submitLabel="Save"
              cancelLabel="Cancel"
              gridCols={1}
              showCancel
              className=""
              isLoading={false}
              formId="add-meter-form"
            />
          ),
        },
      ]}
    />
  );
};

export default AddMeter;
