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
import ReadonlyDropdown from "../utils/ReadonlyDropdown";
// query
import { useMediaQuery } from "react-responsive";
// init data
import { 
  locationOpts, dcpSbuOpts, agrosackSbuOpts,
  contractorsSbuOpts, dancomSbuOpts, dsrSbuOpts,
  dfmSbuOpts, otherSbuOpts
} from "../utils/optionData";
// utils
import { pick } from "lodash";
// validators 
import { emailFieldValidator } from "../validator/validator";



// list options for dropdowns
const salaryGradeDropdownOpts: IDropdownOption[] = [];
const salaryStepDropdownOpts: IDropdownOption[] = [];
const businessJustificationOpts: IDropdownOption[] = [
  {key: "New Work Scope", text: "New Work Scope"},
  {key: "Job Replacement", text: "Job Replacement"}
];

// loop for steps and grade options
for (let i = 0; i < 20; i++) {
  // push to grade
  const grade = {
    key: `Grade ${i+1}`,
    text: `Grade ${i+1}`
  };
  salaryGradeDropdownOpts.push((grade));
  // push to step
  const step = {
    key: `Step ${i+1}`,
    text: `Step ${i+1}`
  };
  salaryStepDropdownOpts.push((step));
}

// for react memo
const arePropsEqual = (prevProps: IComponentProps, nextProps: IComponentProps) => {
  // user form only cares for 
  const userFormArr: keysOfFullFormData[] = [
    "jobTitle", "sbu",
    "department", "supervisorEmail",
    "dangoteEmail", "directReports",
    "salaryLevel", "salaryStep", "businessJustification",
    "hardware", "staffReplaced", "office"
  ];
  
  // compare
  // form mode
  if (prevProps.formSetting.mode !== nextProps.formSetting.mode) {
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
};

interface IComponentProps {
  formData: IFullFormData;
  formSetting: formSettings;
  setFormData: <T extends keysOfFullFormData, A>(key: T, value: A) => void;
}

// main component
export default React.memo(({formData, setFormData, formSetting}: IComponentProps): JSX.Element => {

  // responsive
  const isWideScreen = useMediaQuery({ minWidth: 688});
  // readonly
  const isFormReadOrApproval = (formSetting.mode === "readOnly" || formSetting.mode == "approval");
  const _readOnly = isFormReadOrApproval ? true : undefined;
  const _disabled = isFormReadOrApproval ? true : undefined;
  const _required = isFormReadOrApproval ? undefined : true;

  console.log("render bisinfo");

  return(
    <Stack tokens={{childrenGap:8}}>
      <StackItem align="center">
        <Label>
          Business Information
        </Label>
      </StackItem>
      <Stack tokens={{ childrenGap: 8 }}>
        <StackItem grow>
          <ReadonlyDropdown
            label="Business Justification"
            disabled={_disabled}
            selectedKey={formData.businessJustification}
            options={businessJustificationOpts}
            onChange={(_, newValue) => setFormData("businessJustification", newValue?.text)}
          />
        </StackItem>
        <StackItem grow>
          <PeoplePickerComp 
            formData={formData}
            setFormData={setFormData}
            disabled={_disabled}
          />
        </StackItem>
        <StackItem grow>
          <Stack
            tokens={{ childrenGap : 8}}
            horizontal={isWideScreen ? true : undefined}
          >
            {
              formData.businessJustification === "Job Replacement" &&
              <StackItem grow={1}>
                <ResponsiveTextField
                  readOnly={_readOnly}
                  required={_required}
                  prefix="Staff Being Replaced"
                  value={formData.staffReplaced}
                  onChange={ formSetting.mode === "readOnly" ? 
                    undefined
                    : (_, newValue) => setFormData("staffReplaced", newValue as string)
                  }
                />
              </StackItem>
            }
            <StackItem grow>
              <ResponsiveTextField
                readOnly={_readOnly}
                required={_required}
                prefix="Job Title"
                value={formData.jobTitle}
                onChange={(_, newValue) => setFormData("jobTitle", newValue as string)}
              />
            </StackItem>
          </Stack>
        </StackItem>
        <StackItem grow>
          <Stack
            tokens={{ childrenGap : 8}}
            horizontal={isWideScreen ? true : undefined}
          >
            <StackItem grow>
              <ResponsiveTextField
                readOnly={_readOnly}
                required={_required}
                prefix="Department"
                value={formData.department}
                onChange={(_, newValue) => setFormData("department", newValue as string)}
              />
            </StackItem>
            <StackItem grow>
              <ResponsiveTextField
                readOnly={_readOnly}
                prefix="Dangote Email"
                value={formData.dangoteEmail}
                onChange={(_, newValue) => setFormData("dangoteEmail", newValue as string)}
                onGetErrorMessage={emailFieldValidator}
                validateOnLoad={false}
                type="email"
              />
            </StackItem>
          </Stack>
        </StackItem>
        <StackItem grow>
          <Stack
            tokens={{ childrenGap : 8}}
            horizontal={isWideScreen ? true : undefined}
          >
            <StackItem grow={2}>
              <ReadonlyDropdown
                label="SBU"
                // specifically making sbu && office disabled for edit
                disabled={formSetting.mode === "edit" || _disabled}
                required={_required}
                selectedKey={formData.sbu ? formData.sbu : undefined}
                options={locationOpts}
                onChange={(_, newValue) => setFormData("sbu", newValue?.text)}
              />
            </StackItem>
            <StackItem grow={2}>
              <ReadonlyDropdown
                label="Office"
                disabled={formSetting.mode === "edit" || _disabled}
                required={_required}
                selectedKey={formData.office ? formData.office : undefined}
                options={
                  formData.sbu === "Agrosacks" ? agrosackSbuOpts :
                  formData.sbu === "Contractors" ? contractorsSbuOpts :
                  formData.sbu === "Dancom" ? dancomSbuOpts :
                  formData.sbu === "DCP" ? dcpSbuOpts :
                  formData.sbu === "DSR" ? dsrSbuOpts :
                  formData.sbu === "Flour" ? dfmSbuOpts :
                  formData.sbu === "Others" ? otherSbuOpts : []
                }
                onChange={(_, newValue) => setFormData("office", newValue?.text)}
              />
            </StackItem>
          </Stack>
        </StackItem>
        <StackItem grow>
          <Stack
            tokens={{ childrenGap : 8}}
            horizontal={isWideScreen ? true : undefined}
          >
            <StackItem grow>
              <ReadonlyDropdown
                disabled={_disabled}
                label="Salary Grade"
                selectedKey={formData.salaryLevel}
                options={salaryGradeDropdownOpts}
                onChange={(_, newValue) => setFormData("salaryLevel", newValue?.text)}
              />
            </StackItem>
            <StackItem grow>
              <ReadonlyDropdown
                disabled={_disabled}
                label="Salary Step"
                selectedKey={formData.salaryStep}
                options={salaryStepDropdownOpts}
                onChange={(_, newValue) => setFormData("salaryStep", newValue?.text)}
              />
            </StackItem>
          </Stack>
        </StackItem>
        <StackItem grow>
          <Stack
            wrap
            tokens={{ childrenGap : 8}}
            horizontal={isWideScreen ? true : undefined}
          >
            <Stack
              grow
              tokens={{ childrenGap : 8}}
            >
              <StackItem grow>
                <ResponsiveTextField
                  readOnly={_readOnly}
                  prefix="Direct Reports"
                  value={formData.directReports}
                  onChange={(_, newValue) => setFormData("directReports", newValue as string)}
                  type="number"
                  min={0}
                  max={10}
                />
              </StackItem>
            </Stack>
            <StackItem grow>
              <CustomMultiCheckBox
                dataString={formData.hardware}
                setFormData={setFormData}
                disabled={_disabled}
              />
            </StackItem>
          </Stack>
        </StackItem>
      </Stack>
    </Stack>
  );
}, arePropsEqual);