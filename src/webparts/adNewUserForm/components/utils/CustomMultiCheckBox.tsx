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
  setFormData: <T extends keyof IFullFormData, A>(key: T, value: A) => void
}

export default ({ formData, setFormData }: IComponentProps): JSX.Element => {

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
        label={"Mobile Phone"}
        onChange={(_, checked) => handleItemChecked("phone", checked)}
        defaultChecked={formData.hardware.includes("phone")}
      />
      <Checkbox 
        label={"Laptop"} 
        onChange={(_, checked) => handleItemChecked("laptop", checked)}
        defaultChecked={formData.hardware.includes("laptop")}
      />
      <Checkbox 
        label={"Desktop"} 
        onChange={(_, checked) => handleItemChecked("desktop", checked)}
        defaultChecked={formData.hardware.includes("desktop")}
      />
    </Stack>
  );
};