// form for buisness related information
import * as React from "react";
// ui fabric
import { 
  Stack, Dropdown, Label,
  IDropdownOption,
  StackItem,
} from "office-ui-fabric-react";
// types
import type { IFullFormData, 
  keysOfFullFormData, formSettings
} from "../../types/custom";
// custom comp
import ResponsiveTextField from "../utils/ResponsiveTextField";
import PeoplePickerComp from "../utils/PeoplePickerComp";
import CustomMultiCheckBox from "../utils/CustomMultiCheckBox";
// query
import { useMediaQuery } from "react-responsive";
// utils
import { pick } from "lodash";



// list options for dropdowns
const salaryGradeDropdownOpts: IDropdownOption[] = [];
const salaryStepDropdownOpts: IDropdownOption[] = [];
const businessJustificationOpts: IDropdownOption[] = [
  {key: "New Work Scope", text: "New Work Scope"},
  {key: "Job Replacement", text: "Job Replacement"}
];
const sbuOpts: IDropdownOption[] = [
  {key: "DCP-Ibese", text: "DCP-Ibese"},
  {key: "DCP-Transport Ibese", text: "DCP-Transport Ibese"},
  {key: "DCP-Transport Gboko", text: "DCP-Transport Gboko"},
  {key: "DCP-Transport Obajana", text: "DCP-Transport Obajana"},
  {key: "DCP-Obajana", text: "DCP-Obajana"},
  {key: "DCP-Gboko", text: "DCP-Gboko"},
  {key: "DCP-Cameroun", text: "DCP-Cameroun"},
  {key: "DCP-Congo", text: "DCP-Congo"},
  {key: "DCP-Ethopia", text: "DCP-Ethopia"},
  {key: "DCP-Ghana", text: "DCP-Ghana"},
  {key: "DCP-HQ", text: "DCP-HQ"},
  {key: "DCP-Okpella", text: "DCP-Okpella"},
  {key: "DCP-Senegal", text: "DCP-Senegal"},
  {key: "DCP-Sierra Leone", text: "DCP-Sierra Leone"},
  {key: "DCP-Tanzania", text: "DCP-Tanzania"},
  {key: "DCP-Zambia", text: "DCP-Zambia"},
];

// loop for steps and grade options
for (let i = 0; i < 20; i++) {
  // push to grade
  const grade = {
    key: `Grade ${i+1}`,
    text: `Grade ${i+1}`
  }
  salaryGradeDropdownOpts.push((grade));
  // push to step
  const step = {
    key: `Step ${i+1}`,
    text: `Step ${i+1}`
  }
  salaryStepDropdownOpts.push((step));
}

// for react memo
const arePropsEqual = (prevProps: IComponentProps, nextProps: IComponentProps) => {
  // user form only cares for 
  const userFormArr: keysOfFullFormData[] = [
    "jobTitle", "office",
    "department", "supervisorEmail",
    "dangoteEmail", "directReports",
    "salaryLevel", "salaryStep", "businessJustification",
    "hardware", "staffReplaced"
  ];
  // compare
  // layout first
  if (prevProps.layout !== nextProps.layout) {
    return false;
  }
  // filter
  // guessing a dependecy installed lodash cause, not me
  const previousPropsFiltered = pick(prevProps.formData, userFormArr);
  // form props
  for ( const [key, value] of Object.entries(previousPropsFiltered)) {
    if (value !== nextProps.formData[key as keysOfFullFormData]) {
      return false;
    }
  }
  // equal, fucntion doesnt change? not checking, memory reference value might change but doesnt matter?
  return true;
}

interface IComponentProps {
  formData: IFullFormData;
  formSetting: formSettings;
  setFormData: <T extends keysOfFullFormData, A>(key: T, value: A) => void;
  layout: "single" | "double";
}

// main component
export default React.memo(({formData, setFormData, layout, formSetting}: IComponentProps): JSX.Element => {

  // for alignment
  const horizAlign = layout === "single" ? "center" : undefined;
  // responsive
  const isWideScreen = useMediaQuery({ minWidth: 768});
  console.log("render bisinfo");

  return(
    <Stack tokens={{childrenGap:8}}>
      <StackItem align="center">
        <Label>
          Business Information
        </Label>
      </StackItem>
      <Stack tokens={{ childrenGap: 8 }}>
        {
          layout === "double" &&
          <>
            <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign={"end"}  horizontalAlign={horizAlign} >
              <StackItem grow={1}>
                <Dropdown
                  disabled={formSetting.mode === "readOnly" ? true : undefined}
                  label="Business Justification"
                  selectedKey={formData.businessJustification}
                  options={businessJustificationOpts}
                  onChange={(_, newValue) => {setFormData("businessJustification", newValue?.text)}}
                />
              </StackItem>
              {
                formData.businessJustification === "Job Replacement" &&
                <StackItem grow={1}>
                  <ResponsiveTextField
                    readOnly={formSetting.mode === "readOnly" ? true : undefined}
                    prefix="Staff Being Replaced"
                    value={formData.staffReplaced}
                    onChange={ formSetting.mode === "readOnly" ? 
                      (_, newValue) => {setFormData("staffReplaced", newValue as string)}
                      : undefined
                    }
                  />
                </StackItem>
              }
              <StackItem grow={1}>
                <ResponsiveTextField
                  readOnly={formSetting.mode === "readOnly" ? true : undefined}
                  prefix="Job Title"
                  value={formData.jobTitle}
                  onChange={(_, newValue) => {setFormData("jobTitle", newValue as string)}}
                />
              </StackItem>
            </Stack>
            <Stack horizontal tokens={{childrenGap:8}}  horizontalAlign={horizAlign}>
              <StackItem grow={1}>
                <Dropdown
                  disabled={formSetting.mode === "readOnly" ? true : undefined}
                  label="SBU"
                  selectedKey={formData.office}
                  options={sbuOpts}
                  onChange={(_, newValue) => {setFormData("office", newValue?.text)}}
                />
              </StackItem>
              <StackItem grow={1}>
                <ResponsiveTextField
                  readOnly={formSetting.mode === "readOnly" ? true : undefined}
                  prefix="Department"
                  value={formData.department}
                  onChange={(_, newValue) => {setFormData("department", newValue as string)}}
                />
              </StackItem>
            </Stack>
            <Stack horizontal tokens={{childrenGap:8}} horizontalAlign={horizAlign}>
              <StackItem grow={1}>
                <ResponsiveTextField
                  readOnly={formSetting.mode === "readOnly" ? true : undefined}
                  prefix="Dangote Email"
                  value={formData.dangoteEmail}
                  onChange={(_, newValue) => {setFormData("dangoteEmail", newValue as string)}}
                  onGetErrorMessage={(value) => {
                    return value.includes("@") ? "" : "Error, Not an email"
                  }}
                  validateOnLoad={false}
                  validateOnFocusOut
                  type="email"
                />
              </StackItem>
              <StackItem grow={1}>
                <PeoplePickerComp 
                  formData={formData}
                  setFormData={setFormData}
                />
              </StackItem>
            </Stack>
            <Stack horizontal tokens={{childrenGap:8}} horizontalAlign={horizAlign}>
              <StackItem grow={1}>
                <Dropdown
                  disabled={formSetting.mode === "readOnly" ? true : undefined}
                  label="Salary Grade"
                  selectedKey={formData.salaryLevel}
                  options={salaryGradeDropdownOpts}
                  onChange={(_, newValue) => {setFormData("salaryLevel", newValue?.text)}}
                />
              </StackItem>
              <StackItem grow={1}>
                <Dropdown
                  disabled={formSetting.mode === "readOnly" ? true : undefined}
                  label="Salary Step"
                  selectedKey={formData.salaryStep}
                  options={salaryStepDropdownOpts}
                  onChange={(_, newValue) => {setFormData("salaryStep", newValue?.text)}}
                />
              </StackItem>
              <StackItem grow={1} shrink>
                <ResponsiveTextField
                  readOnly={formSetting.mode === "readOnly" ? true : undefined}
                  prefix="Direct Reports"
                  value={formData.directReports}
                  onChange={(_, newValue) => {setFormData("directReports", newValue as string)}}
                  type="number"
                  min={0}
                  max={10}
                />
              </StackItem>
            </Stack>
            <Stack horizontal tokens={{childrenGap:8}} >
              <CustomMultiCheckBox
                formData={formData}
                setFormData={setFormData}
                disabled={formSetting.mode === "readOnly" ? true : undefined}
              />
            </Stack>
          </>
        }
        {
          layout === "single" &&
          <>
            <Stack horizontal={isWideScreen ? true : undefined} wrap tokens={{ childrenGap: 8 }} verticalAlign={"end"}>
              <StackItem grow={1}>
                <Dropdown
                  disabled={formSetting.mode === "readOnly" ? true : undefined} 
                  label="Business Justification"
                  selectedKey={formData.businessJustification}
                  options={businessJustificationOpts}
                  onChange={(_, newValue) => {setFormData("businessJustification", newValue?.text)}}
                />
              </StackItem>
                {
                  formData.businessJustification === "Job Replacement" &&
                  <StackItem grow={1}>
                    <ResponsiveTextField
                      readOnly={formSetting.mode === "readOnly" ? true : undefined}
                      prefix="Staff Replaced"
                      value={formData.staffReplaced}
                      onChange={(_, newValue) => {setFormData("staffReplaced", newValue as string)}}
                    />
                  </StackItem>
                }
              <StackItem grow={1}>
                <ResponsiveTextField
                  readOnly={formSetting.mode === "readOnly" ? true : undefined}
                  prefix="Job Title"
                  value={formData.jobTitle}
                  onChange={(_, newValue) => {setFormData("jobTitle", newValue as string)}}
                />
              </StackItem>
            </Stack>
            <Stack horizontal={isWideScreen ? true : undefined} wrap tokens={{ childrenGap: 8 }}>
              <StackItem grow={2}>
                <Dropdown
                  disabled={formSetting.mode === "readOnly" ? true : undefined} 
                  label="SBU"
                  selectedKey={formData.office}
                  options={sbuOpts}
                  onChange={(_, newValue) => {setFormData("office", newValue?.text)}}
                />
              </StackItem>
              <StackItem grow={1}>
                <ResponsiveTextField
                  readOnly={formSetting.mode === "readOnly" ? true : undefined}
                  prefix="Department"
                  value={formData.department}
                  onChange={(_, newValue) => {setFormData("department", newValue as string)}}
                />
              </StackItem>
              <StackItem grow={1}>
                <ResponsiveTextField
                  readOnly={formSetting.mode === "readOnly" ? true : undefined}
                  prefix="Dangote Email"
                  value={formData.dangoteEmail}
                  onChange={(_, newValue) => {setFormData("dangoteEmail", newValue as string)}}
                  onGetErrorMessage={(value) => {
                    return value.includes("@") ? "" : "Error, Not an email"
                  }}
                  validateOnLoad={false}
                  validateOnFocusOut
                  type="email"
                />
              </StackItem>
              <StackItem grow={1}>
                <ResponsiveTextField
                  readOnly={formSetting.mode === "readOnly" ? true : undefined}
                  prefix="Direct Reports"
                  value={formData.directReports}
                  onChange={(_, newValue) => {setFormData("directReports", newValue as string)}}
                  type="number"
                  min={0}
                  max={10}
                />
              </StackItem>
              <StackItem grow={1}>
                <PeoplePickerComp 
                  formData={formData}
                  setFormData={setFormData}
                />
              </StackItem>
            </Stack>
            <Stack horizontal={isWideScreen ? true : undefined} wrap tokens={{ childrenGap: 8 }}>
              <StackItem grow={1}>
                <Dropdown
                  disabled={formSetting.mode === "readOnly" ? true : undefined} 
                  label="Salary Grade"
                  selectedKey={formData.salaryLevel}
                  options={salaryGradeDropdownOpts}
                  onChange={(_, newValue) => {setFormData("salaryLevel", newValue?.text)}}
                />
              </StackItem>
              <StackItem grow={1}>
                <Dropdown
                  disabled={formSetting.mode === "readOnly" ? true : undefined} 
                  label="Salary Step"
                  selectedKey={formData.salaryStep}
                  options={salaryStepDropdownOpts}
                  onChange={(_, newValue) => {setFormData("salaryStep", newValue?.text)}}
                />
              </StackItem>
              <StackItem grow={1}>
                <CustomMultiCheckBox
                  disabled={formSetting.mode === "readOnly" ? true : undefined}
                  formData={formData}
                  setFormData={setFormData}
                />
              </StackItem>
            </Stack>
          </> 
        }
      </Stack>
    </Stack>
  );
}, arePropsEqual);