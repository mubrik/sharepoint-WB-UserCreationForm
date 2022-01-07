// component for single item for approval, responsive view and highlighted colors
import * as React from "react";
// ui
import { 
  mergeStyleSets, Stack,
  StackItem, DefaultButton,
  IContextualMenuProps, ContextualMenu
} from "office-ui-fabric-react";
// types 
import { 
  ISharepointFullFormData, approvalStatus,
  mainPageView
} from "../../types/custom";
// responsive
import { useMediaQuery } from "react-responsive";

// styles
const classes = mergeStyleSets({
  itemUsername: {
    padding: "5px",
    margin: "2px 2px"
  },
  itemStatusApproved: {
    padding: "5px",
    margin: "2px 2px",
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
    color: "green",
    textAlign: "center"
  },
  itemStatusPending: {
    padding: "5px",
    margin: "2px 2px",
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
    color: "#117799",
    textAlign: "center"
  },
  itemStatusRejected: {
    padding: "5px",
    margin: "2px 2px",
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
    color: "red",
    textAlign: "center"
  },
  itemButtonContainer: {
    padding: "2px",
    gap: "4px"
  },
  itemShadow: {
    alignItems: "center",
    borderRadius: "4px",
    margin: "4px",
    cursor: "pointer",
    boxShadow: "0px 0px 4px 0px #433f7e7d",
    overflow: "hidden",
  }
});

interface IComponentProps {
  approvalItem: ISharepointFullFormData;
  index: number;
  handleApprovalAction(id: number, param: approvalStatus): void;
  handleViewClick(id: number): void;
}

export default ({approvalItem, handleApprovalAction, handleViewClick, index}: IComponentProps) => {

  // responsive
  const isNotWideScreen = useMediaQuery({ maxWidth: 940 });

  // classes
  const statusClass = {
    Approved: classes.itemStatusApproved,
    Pending: classes.itemStatusPending,
    Rejected: classes.itemStatusRejected,
  };

  const _getMenu = (menuProps: IContextualMenuProps): JSX.Element => {
    // Customize contextual menu with menuAs
    return <ContextualMenu {...menuProps} />;
  };

  return(
    <Stack horizontal={isNotWideScreen ? false : true} key={index} className={classes.itemShadow}>
      <Stack.Item shrink={4} grow className={classes.itemUsername}>User: {approvalItem.FirstName + approvalItem.LastName}</Stack.Item>
      <Stack.Item shrink={4} grow className={classes.itemUsername}>By: {approvalItem.creatorEmail}</Stack.Item>
      <Stack.Item shrink={4} grow className={statusClass[approvalItem.Approver1Status]}>Approver1 Status: {approvalItem.Approver1Status}</Stack.Item>
      <Stack.Item shrink={4} grow className={statusClass[approvalItem.Approver2Status]}>Approver2 Status: {approvalItem.Approver2Status}</Stack.Item>
      <Stack.Item shrink={4} grow className={statusClass[approvalItem.Approver3Status]}>Approver3 Status: {approvalItem.Approver3Status}</Stack.Item>
      <Stack.Item shrink={4} grow className={statusClass[approvalItem.Approver4Status]}>Approver4 Status: {approvalItem.Approver4Status}</Stack.Item>
      <Stack 
        horizontal
        className={classes.itemButtonContainer}
        horizontalAlign={"space-between"}
      >
        <DefaultButton
          split
          text={"View User"}
          onClick={() => handleViewClick(approvalItem.Id)}
          iconProps={{ iconName: 'View' }}
          menuAs={_getMenu}
          menuProps={{
            items: [
              {
                key: 'emailMessage',
                text: 'Approve',
                iconProps: { iconName: 'Accept' },
                onClick: () => handleApprovalAction(approvalItem.Id, "Approved")
              },
              {
                key: 'calendarEvent',
                text: 'Reject',
                iconProps: { iconName: 'Cancel' },
                onClick: () => handleApprovalAction(approvalItem.Id, "Rejected")
              }
            ],
            directionalHintFixed: true
          }}
        />
      </Stack>
    </Stack>
  );
};