// types
import { mainPageView, IFullFormData } from "../../types/custom";

export const hasNextUserApproved =  (item: IFullFormData, currentApprover: mainPageView ): boolean => {

  let isApproved = false;

  switch (currentApprover) {
    case "Approver1":
      isApproved =  item.approver2Status === "Approved";
      break;

    case "Approver2":
      if (item.office.includes("DCP")) {
        isApproved =  item.approver3Status === "Approved";
      } else {
        isApproved =  item.approver4Status === "Approved";
      }
      break;
      
    case "Approver3":
      isApproved =  item.approver4Status === "Approved";
      break;
      
    case "Approver4":
      isApproved =  false;
      break;
      
    default:
      break;
  }

  return isApproved;
};

export const hasPrevUserApproved = (item: IFullFormData, currentApprover: mainPageView ): boolean => {

  let isApproved = false;

  switch (currentApprover) {
    case "Approver1":
      isApproved = true;
      break;

    case "Approver2":
      isApproved = item.approver1Status === "Approved";
      break;
      
    case "Approver3":
      isApproved = item.approver2Status === "Approved";
      break;
      
    case "Approver4":
      if (item.office.includes("DCP")) {
        isApproved =  item.approver3Status === "Approved";
      } else {
        isApproved =  item.approver2Status === "NotAllowed";
      }
      break;
      
    default:
      break;
  }

  return isApproved;
};

export const hasItemBeenQueried = (item: IFullFormData): boolean => {
  // default incase error
  let queried = false;

  if (Object.values(item).includes("Queried")) {
    queried = true
  }

  return queried;
};