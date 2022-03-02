// form for base user information
import * as React from "react";
// ui fabric
import { 
  Stack, Dropdown, Label, StackItem
} from "office-ui-fabric-react";
// types
import type { 
  IFullFormData, keysOfFullFormData,
  formSettings
} from "../../types/custom";
// custom comp
import ResponsiveTextField from "../utils/ResponsiveTextField";
import PhoneInputField from "../utils/PhoneInputField";
import ReadonlyDropdown from "../utils/ReadonlyDropdown";
// query
import { useMediaQuery } from "react-responsive";
// utils
import { pick } from "lodash";
// validators 
import {
  numberFieldValidator, emailFieldValidator,
  textFieldValidator
} from "../validator/validator";

interface IComponentProps {
  formData: IFullFormData;
  formSetting: formSettings;
  setFormData: <T extends keysOfFullFormData, A>(key: T, value: A) => void;
}

// opttion list for title control
const titleDropdownOpts = [
  {key: "Mr", text: "Mr"},
  {key: "Mrs", text: "Mrs"},
  {key: "Miss", text: "Miss"},
  {key: "Dr", text: "Dr"},
  {key: "Engr", text: "Engr"},
];

// trying out memoised components to save on re rendering, not super useful cause
// react is fast enough w/o but just testing
// comparison func
const arePropsEqual = (prevProps: IComponentProps, nextProps: IComponentProps) => {
  // user form only cares for 
  // on second thought, why am i rerendering whole form when a text field changes?
  // why not just the text field component? and only re render main component when layout changes?
  // props drilling, might need context for that to work
  const userFormArr: keysOfFullFormData[] = [
    "title", "firstName",
    "lastName", "mobileNumber",
    "privateEmail", "workNumber",
    "initials", "address", "city", "country",
    "comment"
  ];
  // filter
  const prev = pick(prevProps.formData, userFormArr);
  // compare
  // form mode
  if (prevProps.formSetting.mode !== nextProps.formSetting.mode) {
    return false;
  }
  // form props
  for ( const [key, value] of Object.entries(prev)) {
    if (value !== nextProps.formData[key as keysOfFullFormData]) {
      return false;
    }
  }
  // equal, fucntion doesnt change? not checking, memory reference value might change but doesnt matter?
  return true;
};

export default React.memo(
  ({formData, setFormData, formSetting}: IComponentProps): JSX.Element => {
    // responsive
    const isWideScreen = useMediaQuery({ minWidth: 688});
    // readonly
    const _readOnly = (formSetting.mode === "readOnly" || formSetting.mode == "approval") ? true : undefined;
    const _required = (formSetting.mode === "readOnly" || formSetting.mode == "approval") ? undefined : true;
    const _disabled = (formSetting.mode === "readOnly" || formSetting.mode == "approval") ? true : undefined;

    console.log("render userinfo");
  
    return(
      <Stack tokens={{childrenGap:8}}>
        <StackItem align="center">
          <Label>
            User Information
          </Label>
        </StackItem>
        <Stack tokens={{ childrenGap : 8}} >
          <StackItem grow>
            <Stack
              tokens={{ childrenGap : 8}}
              horizontal={isWideScreen ? true : undefined}
            >
              <StackItem shrink align="start">
                <ReadonlyDropdown
                  label={"Title"}
                  required={_required}
                  disabled={_disabled}
                  selectedKey={formData.title}
                  options={titleDropdownOpts}
                  onChange={(_, newValue) => setFormData("title", newValue?.text)}
                />
              </StackItem>
              <StackItem grow={2}>
                <ResponsiveTextField
                  readOnly={_readOnly}
                  required={_required}
                  prefix="First Name"
                  value={formData.firstName}
                  onChange={(_, newValue) => setFormData("firstName", newValue as string)}
                  onGetErrorMessage={textFieldValidator}
                  validateOnLoad={false}
                  validateOnFocusOut
                />
              </StackItem>
              <StackItem grow={3}>
                  <ResponsiveTextField
                    readOnly={_readOnly}
                    required={_required}
                    prefix="Last Name"
                    value={formData.lastName}
                    onChange={(_, newValue) => setFormData("lastName", newValue as string)}
                    onGetErrorMessage={textFieldValidator}
                    validateOnLoad={false}
                    validateOnFocusOut
                  />
              </StackItem>
            </Stack>
          </StackItem>
          <StackItem grow>
            <Stack 
              tokens={{ childrenGap : 8}}
              horizontal={isWideScreen ? true : undefined}
            >
              <StackItem grow={1} align={isWideScreen ? "end" : undefined}>
                <PhoneInputField
                  label="Mobile Number"
                  value={formData.mobileNumber}
                  required={_required}
                  disabled={_disabled}
                  onChange={(newValue) => setFormData("mobileNumber", newValue as string)}
                />
              </StackItem>
              <StackItem grow={1} align={isWideScreen ? "end" : undefined}>
                <PhoneInputField
                  label="Work Number"
                  value={formData.workNumber}
                  required={_required}
                  disabled={_disabled}
                  onChange={(newValue) => setFormData("workNumber", newValue as string)}
                />
              </StackItem>
            </Stack>
          </StackItem>
          <StackItem grow>
            <Stack 
              tokens={{ childrenGap : 8}}
              horizontal={isWideScreen ? true : undefined}
            >
              <StackItem grow={1}>
                <ResponsiveTextField 
                  readOnly={_readOnly}
                  prefix="Initials"
                  value={formData.initials}
                  onChange={(_, newValue) => setFormData("initials", newValue as string)}
                />
              </StackItem>
              <StackItem grow={1}>
                <ResponsiveTextField
                  readOnly={_readOnly}
                  required={_required}
                  prefix="Private Email"
                  value={formData.privateEmail}
                  onChange={(_, newValue) => setFormData("privateEmail", newValue as string)}
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
              <StackItem grow={1}>
                <ResponsiveTextField
                  readOnly={_readOnly}
                  required={_required}
                  prefix="City"
                  value={formData.city}
                  onChange={(_, newValue) => setFormData("city", newValue as string)}
                />
              </StackItem>
              <StackItem grow={1}>
                <ResponsiveTextField
                  readOnly={_readOnly}
                  required={_required}
                  prefix="Country"
                  value={formData.country}
                  onChange={(_, newValue) => setFormData("country", newValue as string)}
                />
              </StackItem>
            </Stack>
          </StackItem>
          <StackItem grow>
            <ResponsiveTextField
              multiline
              autoAdjustHeight
              readOnly={_readOnly}
              required={_required}
              prefix="Address"
              value={formData.address}
              onChange={(_, newValue) => setFormData("address", newValue as string)}
            />
          </StackItem>
          <StackItem grow>
            <ResponsiveTextField
              multiline
              autoAdjustHeight
              readOnly={_readOnly}
              prefix="Comment"
              value={formData.comment}
              onChange={(_, newValue) => setFormData("comment", newValue as string)}
            />
          </StackItem>
        </Stack>
      </Stack>
    );
  }, arePropsEqual
);