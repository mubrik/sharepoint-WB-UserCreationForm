// renders multicheckbox and set data to string
import * as React from "react";
// ui fabric
import { 
  Checkbox, Stack,
  Label
} from "office-ui-fabric-react";
// type
import { IFullFormData } from "../../types/custom";

interface IComponentProps {
  formData: IFullFormData;
  setFormData: <T extends keyof IFullFormData, A>(key: T, value: A) => void;
  disabled?: boolean;
}

export default ({ formData, setFormData, disabled }: IComponentProps): JSX.Element => {

  const handleItemChecked = (item: string, isChecked?: boolean) => {
    // get form data
    const str = formData.hardware;
    // string to set
    let newString;

    if (isChecked) {
      // remove string
      newString = str.includes(item) ?  str : str.concat(item);
    } else {
      newString = str.includes(item) ?  str.replace(item, "") : str;
    }
    console.log(newString);
    // set
    setFormData("hardware", newString);
  }

  return(
    <Stack tokens={{childrenGap : 8 }}>
      <Label> Hardware Required: </Label>
      <Checkbox
        disabled={disabled} 
        label={"Mobile Phone"}
        onChange={(_, checked) => handleItemChecked("phone", checked)}
        checked={formData.hardware.includes("phone")}
      />
      <Checkbox
        disabled={disabled}  
        label={"Laptop"} 
        onChange={(_, checked) => handleItemChecked("laptop", checked)}
        checked={formData.hardware.includes("laptop")}
      />
      <Checkbox
        disabled={disabled}  
        label={"Desktop"} 
        onChange={(_, checked) => handleItemChecked("desktop", checked)}
        checked={formData.hardware.includes("desktop")}
      />
    </Stack>
  );
};