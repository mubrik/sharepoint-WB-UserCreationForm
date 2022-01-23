import * as React from "react";
// ui
import { IconButton,  } from "office-ui-fabric-react";
// types
import { ISharepointFullFormData, approvalStatus,
  mainPageView, IFullFormData
} from "../../types/custom";
// hooks
import { useUserData } from "../userContext/UserContext";
import { useNotification } from "../notification/NotificationBarContext";
import { useDialog } from "../dialog/DialogContext";
// server
import fetchServer from "../../controller/server";
import { hasNextUserApproved, hasPrevUserApproved } from "./approverCheck";

interface IComponentProps {
  data: IFullFormData;
  approverPage?: mainPageView;
  enableApproval: boolean;
  // callbacks
  handleView(id: number): void;
  handleEdit?(id: number): void;
  onApproval?(): void;
  onView?(): void;
}

export default ({data, handleView, onApproval, 
  enableApproval, approverPage, handleEdit }: IComponentProps): JSX.Element => {
  // notification
  const notify = useNotification();
  const setDialog = useDialog();
  const [itemIsRejected, setItemIsRejected] = React.useState(false);

  // user, doing this to make component independent of parent component for approval
  // can be used in search and approval component
  // actually no, works for approval as all items their can be approved/rejected by user
  // but search is different as not all item should be approved/rejected by user, might need to tweak below
  // use item to check if user is approver? before enabling approval opt
  // for now, using a boolean to enable or disable approval
  const { email, isUserApproverFour, isUserApproverThree, 
  isUserApproverTwo, isUserApproverOne } = useUserData();
  
  const isUserAnApprover =  isUserApproverFour || isUserApproverThree
  || isUserApproverTwo || isUserApproverOne;

  const approverType = approverPage ? approverPage :
  isUserApproverOne ? "Approver1" :
  isUserApproverTwo ? "Approver2" :
  isUserApproverThree ? "Approver3" :
  isUserApproverFour ? "Approver4" : undefined;

  // check if item rejected
  React.useEffect(() => {
    if (Object.values(data).includes("Rejected")) {
      setItemIsRejected(true);
    }
  }, [data]);

  // handler
  const handleApprovalAction = (id: number, param: approvalStatus, comment: string): void => {
    // call server
    console.log(id, param, comment);
    if (approverType) {
      // next Approver approved, trying to reject or pend
      if (param !== "Approved" && hasNextUserApproved(data, approverType)) {
        notify({show: true, isError: true, msg:"This item has been approved by next Approver"});
        return;
      }

      if (!hasPrevUserApproved(data, approverType)) {
        notify({show: true, isError: true, msg:"This item has not been approved by previous Approver"});
        return;
      }
      // if not approve
      fetchServer.approveRejectEntry(id, approverType, param, comment)
      .then(_ => {
        notify({show: true, isError: false, msg:"Item status updated"});
      })
      .catch(error => {
        if (error instanceof Error)
        notify({
          show: true, isError: true,
          msg: error.message ? error.message : "Error Approving Item", 
          errorObj: error
        });
      })
      .finally(() => {
        // if callback
        if (onApproval) {
          onApproval();
        }
      });
    }
  };

  const menuItems = React.useMemo(() => {
    // base menu item
    const baseMenu = [
      {
        key: 'view',
        name: 'View',
        onClick: () => handleView(data.id as number)
      }
    ];
    // add aproval options
    if (isUserAnApprover && enableApproval && email === data.creatorEmail) {
      baseMenu.push(...[
        {
          key: 'approved',
          name: 'Approved',
          onClick: () => {
            setDialog({
              show: true,
              type: "approve",
              msg: "Confirm Approval",
              buttonText: "Approve",
              onApprove: (param) => handleApprovalAction(data.id as number, "Approved", param),
            });
          }
        },
        {
          key: 'queried',
          name: 'Queried',
          onClick: () => {
            setDialog({
              show: true,
              type: "approve",
              msg: "Confirm Query and Comment",
              buttonText: "Queried",
              onApprove: (param) => handleApprovalAction(data.id as number, "Queried", param),
            });
          }
        },
        {
          key: 'rejected',
          name: 'Rejected',
          onClick: () => {
            setDialog({
              show: true,
              type: "approve",
              msg: "Confirm Rejection",
              buttonText: "Rejected",
              onApprove: (param) => handleApprovalAction(data.id as number, "Rejected", param),
            });
          }
        },
      ]);
    }

    // add edit opt
    if (itemIsRejected && handleEdit) {
      baseMenu.push(
        {
          key: 'edit',
          name: 'Edit',
          onClick: () => handleEdit(data.id as number)
        },
      );
    }

    return baseMenu;
  }, [isUserAnApprover, itemIsRejected, email]);


  return(
    <IconButton 
      iconProps={{ iconName: "MoreVertical"}}
      menuIconProps={{ iconName: "" }}
      menuProps={{
        shouldFocusOnMount: true,
        items: menuItems
      }}
    />
  );
};