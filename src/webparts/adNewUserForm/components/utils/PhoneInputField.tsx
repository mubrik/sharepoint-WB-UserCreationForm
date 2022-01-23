// for phone inputs
import * as React from "react";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/high-res.css'
// ui
import { Label } from "office-ui-fabric-react";
// types
import {IFullFormData} from "../../types/custom";

interface IComponentProps {
  label: string;
  value: string;
  onChange(value: string): void;
  required: boolean | undefined;
  disabled: boolean | undefined;
}

export default ({value, onChange, label, required, disabled}: IComponentProps): JSX.Element => {

  return(
    <>
      <Label> {label} </Label>
      <PhoneInput
        disabled={disabled ? disabled : false}
        country={'ng'}
        value={value}
        onChange={(newValue: string) => onChange(newValue)}
        inputProps={{
          name: label,
          required: required ? required : false,
        }}
        inputStyle={{
          width: "100%",
          border: "1px solid #000"
        }}
        buttonStyle={{
          border: "1px solid #000"
        }}
      />
    </>
  );
};
