// techniclly not a component, just a function
// basically takes the form data, runs a bunch of ifs check and returns and obj
import { IFullFormData } from "../../types/custom";

export default ( param: IFullFormData ): [boolean, boolean, string] => {
  // pure func
  const data = { ...param };
  // returned variables
  let isValid = false;
  let isError = false;
  let errorMsg = "";

  // data prop we dont really care much about
  const excludeProps = [
    "initials", "staffReplaced", "dangoteEmail",
    "comment", "hardware", "privateNumber", "approver1"
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