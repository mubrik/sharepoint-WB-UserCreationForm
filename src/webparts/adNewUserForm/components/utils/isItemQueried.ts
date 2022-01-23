// types
import { approvalStatus } from "../../types/custom";

export default (item: any, type: "sp"|"form" ): boolean => {

  const data = (type === "sp" && item) ? {
      status1: item.Approver1Status as approvalStatus,
      status2: item.Approver2Status as approvalStatus,
      status3: item.Approver3Status as approvalStatus,
      status4: item.Approver4Status as approvalStatus,
    } : 
    {
      status1: item.approver1Status as approvalStatus,
      status2: item.approver2Status as approvalStatus,
      status3: item.approver3Status as approvalStatus,
      status4: item.approver4Status as approvalStatus,
  }

  let isEditable = false;

  // item editable only if queried
  if (Object.values(data).includes("Queried")) {
    isEditable = true;
  }

  return isEditable;
};