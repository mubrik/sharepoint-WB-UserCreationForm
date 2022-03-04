import * as React from "react";
import { IFullFormData } from "../../types/custom";
// notify
import { useNotification } from "../notification/NotificationBarContext";

// basically takes the form data, runs a bunch of ifs check and returns and obj
const validator =  ( param: IFullFormData ): [boolean, boolean, string] => {
  // pure func
  const data = { ...param };
  // returned variables
  let isValid = false;
  let isError = false;
  let errorMsg = "";

  // data prop we dont really care much about
  const excludeProps = [
    "initials", "staffReplaced", "dangoteEmail",
    "comment", "hardware", "privateNumber", "approver1",
    "approver1Query","approver1Status", "approver1Date", "approver2",
    "approver2Query","approver2Status", "approver2Date", "approver3",
    "approver3Query","approver3Status", "approver3Date", "approver4",
    "approver4Query","approver4Status", "approver4Date", "isDcp",
    "processor"
  ];

  // loop props to check empty
  // big if statement, checking obj using array prototype every method, 
  // returns true if no empty value
  if (
    // wrapped to use boolean
    !(Object.entries(data).every((keyVal) => {
      const [key, value] = keyVal;
      // if in excluded props return true so iteration continues
      if (excludeProps.includes(key)) {
        return true;
      }
      // value empty return false to stop loop, set variables
      if (value === "") {
        errorMsg = `The field: ${key} cannot be empty`;
        isError = true;
        return false;
      }

      // number fields
      if (key.toLowerCase().includes("number") && Number.isNaN(Number(value))) {
        errorMsg = `The number field: ${key} value is invalid`;
        isError = true;
        return false;
      }
      // email field
      if (key.toLowerCase().includes("email") && 
          !String(value).toLowerCase().match(/\S+@\S+\.\S+/)
        ) {
        errorMsg = `The email field: ${key} value is invalid`;
        isError = true;
        return false;
      }
      // name fields
      if (key.toLowerCase().includes("name") && 
          !String(value).toLowerCase().match(/^[A-Za-z]+$/)
        ) {
        errorMsg = `The name field: ${key} value is invalid`;
        isError = true;
        return false;
      }
      // check for smileys? unicode?
      
      // default
      return true;
    }))
  ) {
    return [isValid, isError, errorMsg];
  }

  // check for business justification
  if (data.businessJustification === "Job Replacement" &&
    data.staffReplaced === ""
  ) {
    errorMsg = `Staff replaced cannot be empty for Job Replacement`;
    isError = true;
    return [isValid, isError, errorMsg];
  }
  // no errors
  return [true, isError, errorMsg];
};

/**
 * basically runs validatation on formdata and returns a boolean
 * @param {IFullFormData, formMode, formIsTouched}
 */
export const useValidateForm = (
    formData:IFullFormData,
    formMode: "new" | "readOnly" | "approval" | "edit", 
    formIsTouched: boolean 
  ): boolean => {

  const [validState, setValidState] = React.useState(false);

  // hook for notification
  const notify = useNotification();

  // effect for validation notification
  React.useEffect(() => {
    // only validate if form is touched
    if (formIsTouched && (formMode === "new" || formMode === 'edit')) {
      // validate
      const [isValid, isError, msg] = validator(formData);
      
      if (isError) {
        notify({msg: msg, isError: true, show: true, errorObj: null});
      } else {
        notify({msg: "", isError: false, show: false, errorObj: null});
      }
      setValidState(isValid);
    }
  }, [formIsTouched, formData, formMode]);

  return validState;
};

// other validator functions
export const numberFieldValidator = (newValue: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (newValue !== "" && !Number.isNaN(Number(newValue))) {
      resolve("");
    } else {
      resolve("This is not a number");
    }
  });
};

export const emailFieldValidator = (newValue: string): Promise<string> => {

  return new Promise((resolve, reject) => {
    // if empty dont validate
    if (String(newValue).toLowerCase().match(/\S+@\S+\.\S+/) || String(newValue) === "") {
      resolve("");
    } else {
      resolve("Invalid Email");
    }
  });
};

export const textFieldValidator = (newValue: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (String(newValue).toLowerCase().match(/^[A-Za-z]+$/)) {
      resolve("");
    } else {
      resolve("No spaces, number or special characters allowed");
    }
  });
};

export default validator;