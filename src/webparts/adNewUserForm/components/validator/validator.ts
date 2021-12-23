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
  const excludeProps = ["initials", "staffReplaced", "dangoteEmail"];

  // loop props to check empty
  // big if statement, checking obj using every method, 
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
        errorMsg = `The field: ${key.toUpperCase()} cannot be empty`;
        isError = true;
        return false;
      }
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