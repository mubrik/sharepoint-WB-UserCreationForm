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
// query
import { useMediaQuery } from "react-responsive";
// utils
import { pick } from "lodash";

interface IComponentProps {
  formData: IFullFormData;
  formSetting: formSettings;
  setFormData: <T extends keysOfFullFormData, A>(key: T, value: A) => void;
  layout: "single" | "double";
}
// opttion list for title control
const titleDropdownOpts = [
  {key: "Mr", text: "Mr"},
  {key: "Mrs", text: "Mrs"},
  {key: "Miss", text: "Miss"},
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
    "privateEmail", "privateNumber",
    "initials", "address", "city", "country"
  ];
  // filter
  const prev = pick(prevProps.formData, userFormArr);
  // compare
  // layout first
  if (prevProps.layout !== nextProps.layout) {
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
  ({formData, setFormData, layout, formSetting}: IComponentProps): JSX.Element => {
    // for alignment
    const horizAlign = layout === "single" ? "center" : undefined;
    // responsive
    const isWideScreen = useMediaQuery({ minWidth: 688});

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
                <Dropdown
                  required={formSetting.mode === "readOnly" ? undefined : true}
                  disabled={formSetting.mode === "readOnly" ? true : undefined}
                  label={"Title"}
                  selectedKey={formData.title}
                  options={titleDropdownOpts}
                  onChange={(_, newValue) => setFormData("title", newValue?.text)}
                />
              </StackItem>
              <StackItem grow={2}>
                <ResponsiveTextField
                  readOnly={formSetting.mode === "readOnly" ? true : undefined}
                  required={formSetting.mode === "readOnly" ? undefined : true}
                  prefix="First Name"
                  value={formData.firstName}
                  onChange={(_, newValue) => setFormData("firstName", newValue as string)}
                />
              </StackItem>
              <StackItem grow={3}>
                  <ResponsiveTextField
                    readOnly={formSetting.mode === "readOnly" ? true : undefined}
                    required={formSetting.mode === "readOnly" ? undefined : true}
                    prefix="Last Name"
                    value={formData.lastName}
                    onChange={(_, newValue) => setFormData("lastName", newValue as string)}
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
                  readOnly={formSetting.mode === "readOnly" ? true : undefined}
                  required={formSetting.mode === "readOnly" ? undefined : true}
                  prefix="Mobile Number"
                  value={formData.mobileNumber}
                  onChange={(_, newValue) => setFormData("mobileNumber", newValue as string)}
                  type="tel"
                />
              </StackItem>
              <StackItem grow={1}>
                <ResponsiveTextField
                  readOnly={formSetting.mode === "readOnly" ? true : undefined}
                  prefix="Private Number"
                  value={formData.privateNumber}
                  onChange={(_, newValue) => setFormData("privateNumber", newValue as string)}
                  type="tel"
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
                  readOnly={formSetting.mode === "readOnly" ? true : undefined}
                  prefix="Initials"
                  value={formData.initials}
                  onChange={(_, newValue) => setFormData("initials", newValue as string)}
                />
              </StackItem>
              <StackItem grow={1}>
                <ResponsiveTextField
                  readOnly={formSetting.mode === "readOnly" ? true : undefined}
                  required={formSetting.mode === "readOnly" ? undefined : true}
                  prefix="Private Email"
                  value={formData.privateEmail}
                  onChange={(_, newValue) => setFormData("privateEmail", newValue as string)}
                  onGetErrorMessage={(value) => {
                    return value.includes("@") ? "" : "Error, Not an email"
                  }}
                  validateOnLoad={false}
                  validateOnFocusOut
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
                  readOnly={formSetting.mode === "readOnly" ? true : undefined}
                  required={formSetting.mode === "readOnly" ? undefined : true}
                  prefix="City"
                  value={formData.city}
                  onChange={(_, newValue) => setFormData("city", newValue as string)}
                />
              </StackItem>
              <StackItem grow={1}>
                <ResponsiveTextField
                  readOnly={formSetting.mode === "readOnly" ? true : undefined}
                  required={formSetting.mode === "readOnly" ? undefined : true}
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
              readOnly={formSetting.mode === "readOnly" ? true : undefined}
              required={formSetting.mode === "readOnly" ? undefined : true}
              prefix="Address"
              value={formData.address}
              onChange={(_, newValue) => setFormData("address", newValue as string)}
            />
          </StackItem>
        </Stack>
      </Stack>
    );
  }, arePropsEqual
);