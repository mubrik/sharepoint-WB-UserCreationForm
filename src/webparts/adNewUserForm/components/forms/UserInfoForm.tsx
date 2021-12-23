// form for base user information
import * as React from "react";
// ui fabric
import { 
  Stack, Dropdown, Label, StackItem
} from "office-ui-fabric-react";
// types
import type { 
  IFullFormData, keysOfFullFormData } from "../../types/custom";
// custom comp
import ResponsiveTextField from "../utils/ResponsiveTextField";
// query
import { useMediaQuery } from "react-responsive";
import { WebpartContext } from "../AdNewUserForm";

interface IComponentProps {
  formData: IFullFormData;
  setFormData: <T extends keysOfFullFormData, A>(key: T, value: A) => void;
  layout: "single" | "double";
}
// opttion list for title control
const titleDropdownOpts = [
  {key: "Mr", text: "Mr"},
  {key: "Mrs", text: "Mrs"},
  {key: "Miss", text: "Miss"},
]

export default ({formData, setFormData, layout}: IComponentProps): JSX.Element => {
  // for alignment
  const horizAlign = layout === "single" ? "center" : undefined;
  // responsive
  const isWideScreen = useMediaQuery({ minWidth: 768});
  const { webpartWidth } = React.useContext(WebpartContext); // use this instead of screen width.. Nope!

  React.useEffect(() => {
    console.log(webpartWidth)
  }, [webpartWidth])

  return(
    <Stack tokens={{childrenGap:8}}>
      <StackItem align="center">
        <Label>
          User Information
        </Label>
      </StackItem>
      <Stack tokens={{ childrenGap : 8}} >
        {
          layout === "double" &&
          <>
            <Stack horizontal horizontalAlign={horizAlign} tokens={{childrenGap:8}} verticalAlign="end">
              <StackItem grow={1}>
                <Dropdown
                  required
                  label={"Title"}
                  selectedKey={formData.title}
                  options={titleDropdownOpts}
                  onChange={(_, newValue) => {setFormData("title", newValue?.text)}}
                />
              </StackItem>
              <StackItem grow={3}>
                <ResponsiveTextField
                  required
                  prefix="First Name"
                  defaultValue={formData.firstName}
                  onChange={(_, newValue) => {setFormData("firstName", newValue as string)}}
                />
              </StackItem>
              <StackItem grow={3}>
                <ResponsiveTextField
                  required
                  prefix="Last Name"
                  defaultValue={formData.lastName}
                  onChange={(_, newValue) => {setFormData("lastName", newValue as string)}}
                />
              </StackItem>
            </Stack>
            <Stack horizontal horizontalAlign={horizAlign} tokens={{childrenGap:8}}>
              <StackItem grow={1}>
                <ResponsiveTextField
                  required
                  prefix="Mobile Number"
                  defaultValue={formData.mobileNumber}
                  onChange={(_, newValue) => {setFormData("mobileNumber", newValue as string)}}
                  type="tel"
                />
              </StackItem>
              <StackItem grow={1}>
                <ResponsiveTextField 
                  prefix="Private Number"
                  defaultValue={formData.privateNumber}
                  onChange={(_, newValue) => {setFormData("privateNumber", newValue as string)}}
                  type="tel"
                />
              </StackItem>
            </Stack>
            <Stack horizontal horizontalAlign={horizAlign} tokens={{childrenGap:8}}>
              <StackItem grow={1}>
                <ResponsiveTextField 
                  prefix="Initials"
                  defaultValue={formData.initials}
                  onChange={(_, newValue) => {setFormData("initials", newValue as string)}}
                />
              </StackItem>
              <StackItem grow={1}>
                <ResponsiveTextField
                  required
                  prefix="Private Email"
                  defaultValue={formData.privateEmail}
                  onChange={(_, newValue) => {setFormData("privateEmail", newValue as string)}}
                  onGetErrorMessage={(value) => {
                    return value.includes("@") ? "" : "Error, Not an email"
                  }}
                  validateOnLoad={false}
                  validateOnFocusOut
                  type="email"
                />
              </StackItem>
            </Stack>
            <Stack horizontal horizontalAlign={horizAlign} tokens={{childrenGap:8}}>
              <StackItem grow={1}>
                <ResponsiveTextField
                  required
                  prefix="City"
                  defaultValue={formData.city}
                  onChange={(_, newValue) => {setFormData("city", newValue as string)}}
                />
              </StackItem>
              <StackItem grow={1}>
                <ResponsiveTextField
                  required
                  prefix="Country"
                  defaultValue={formData.country}
                  onChange={(_, newValue) => {setFormData("country", newValue as string)}}
                />
              </StackItem>
            </Stack>
          </>
        }
        {
          layout === "single" &&
          <>
            <Stack horizontal={ isWideScreen ? true : undefined } tokens={{ childrenGap: 10 }} wrap>
              <StackItem grow={1}>
                <Dropdown
                  required
                  label={"Title"}
                  selectedKey={formData.title}
                  options={titleDropdownOpts}
                  onChange={(_, newValue) => {setFormData("title", newValue?.text)}}
                />
              </StackItem>
              <StackItem grow={2}>
                <ResponsiveTextField
                  required
                  prefix="First Name"
                  defaultValue={formData.firstName}
                  onChange={(_, newValue) => {setFormData("firstName", newValue as string)}}
                />
              </StackItem>
              <StackItem grow={2}>
                <ResponsiveTextField
                  required
                  prefix="Last Name"
                  defaultValue={formData.lastName}
                  onChange={(_, newValue) => {setFormData("lastName", newValue as string)}}
                />
              </StackItem>
              <StackItem grow={1}>
                <ResponsiveTextField
                  required
                  prefix="Mobile Number"
                  defaultValue={formData.mobileNumber}
                  onChange={(_, newValue) => {setFormData("mobileNumber", newValue as string)}}
                  type="tel"
                />
              </StackItem>
              <StackItem grow={1}>
                <ResponsiveTextField 
                  prefix="Private Number"
                  defaultValue={formData.privateNumber}
                  onChange={(_, newValue) => {setFormData("privateNumber", newValue as string)}}
                  type="tel"
                />
              </StackItem>              
            </Stack>
            <Stack horizontal={ isWideScreen ? true : undefined } tokens={{ childrenGap: 10 }} wrap>
              <StackItem grow={1}>
                <ResponsiveTextField 
                  prefix="Initials"
                  defaultValue={formData.initials}
                  onChange={(_, newValue) => {setFormData("initials", newValue as string)}}
                />
              </StackItem>   
              <StackItem grow={1}>
                <ResponsiveTextField
                  required
                  prefix="Private Email"
                  defaultValue={formData.privateEmail}
                  onChange={(_, newValue) => {setFormData("privateEmail", newValue as string)}}
                  onGetErrorMessage={(value) => {
                    return value.includes("@") ? "" : "Error, Not an email"
                  }}
                  validateOnLoad={false}
                  validateOnFocusOut
                  type="email"
                />
              </StackItem>   
              <StackItem grow={2}>
                <ResponsiveTextField
                  required
                  prefix="City"
                  defaultValue={formData.city}
                  onChange={(_, newValue) => {setFormData("city", newValue as string)}}
                />
              </StackItem>
              <StackItem grow={2}>
                <ResponsiveTextField
                  required
                  prefix="Country"
                  defaultValue={formData.country}
                  onChange={(_, newValue) => {setFormData("country", newValue as string)}}
                />
              </StackItem>
            </Stack>
          </>
        }
        <ResponsiveTextField
          multiline
          required
          autoAdjustHeight
          prefix="Address"
          defaultValue={formData.address}
          onChange={(_, newValue) => {setFormData("address", newValue as string)}}
        />
      </Stack>
    </Stack>
  );
};