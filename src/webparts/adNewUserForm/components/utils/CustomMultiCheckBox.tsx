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
  dataString: string;
  setFormData: <T extends keyof IFullFormData, A>(key: T, value: A) => void;
  disabled?: boolean;
}

// memo compare func
const arePropsEqual = (prevProps: IComponentProps, nextProps: IComponentProps) => {

  const { dataString: prevString } = prevProps;
  const { dataString: nextString } = nextProps;

  if (prevString !== nextString) {
    return false;
  }

  return true;
};

export default React.memo(
  ({ dataString, setFormData, disabled }: IComponentProps): JSX.Element => {
  
    const handleItemChecked = (item: string, isChecked?: boolean) => {
      // get form data
      const str = dataString;
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
    };
  
    return(
      <Stack tokens={{childrenGap : 8 }}>
        <Label> Hardware Required: </Label>
        <Checkbox
          disabled={disabled} 
          label={"Mobile Phone"}
          onChange={(_, checked) => handleItemChecked("phone", checked)}
          checked={dataString.includes("phone")}
        />
        <Checkbox
          disabled={disabled}  
          label={"Laptop"} 
          onChange={(_, checked) => handleItemChecked("laptop", checked)}
          checked={dataString.includes("laptop")}
        />
        <Checkbox
          disabled={disabled}  
          label={"Desktop"} 
          onChange={(_, checked) => handleItemChecked("desktop", checked)}
          checked={dataString.includes("desktop")}
        />
      </Stack>
    );
  }, arePropsEqual
);