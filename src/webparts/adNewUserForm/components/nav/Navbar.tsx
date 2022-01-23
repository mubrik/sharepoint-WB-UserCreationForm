import * as React from "react";
import { 
  Stack, Pivot,
  PivotItem, DefaultButton,
  IContextualMenuProps, mergeStyleSets
} from "office-ui-fabric-react";
// types
import { 
  mainPageView, formSettings
} from "../../types/custom";
// user
import { useUserData } from "../userContext/UserContext";
// query
import { useMediaQuery } from "react-responsive";

// styles
const classes = mergeStyleSets({
  navButton : {
    width: "100%",
  }
});

export interface IComponentProps {
  pageState: string;
  setPageState: React.Dispatch<React.SetStateAction<mainPageView>>;
  formSetting: formSettings;
  setFormSetting: React.Dispatch<React.SetStateAction<formSettings>>;
}

export default ({ pageState, setPageState, formSetting, setFormSetting }: IComponentProps): JSX.Element => {
  
  // user
  const { isUserApproverOne, isUserApproverTwo,
  isUserApproverThree, isUserApproverFour } = useUserData();
  // responsive
  const isMediumScreen = useMediaQuery({ maxWidth: 600 });
  // nav button menu props
  const menuProps: IContextualMenuProps = {
    items: [
      {
        key: 'new',
        text: 'New User',
        iconProps: { iconName: 'NewTeamProject' },
        onClick: () => setPageState("new")
      },
      {
        key: 'search',
        text: 'Search',
        iconProps: { iconName: 'Search' },
        onClick: () => setPageState("search")
      },
      {
        key: 'about',
        text: 'About',
        iconProps: { iconName: 'View' },
        onClick: () => setPageState("about")
      }
    ],
  };

  if (isUserApproverOne) {
    menuProps.items.push(
      {
        key: 'approval1',
        text: 'SBU HR Approval',
        iconProps: { iconName: 'View' },
        onClick: () => setPageState("Approver1")
      }
    );
  }
  if (isUserApproverTwo) {
    menuProps.items.push(
      {
        key: 'approval2',
        text: 'Head HR Approval',
        iconProps: { iconName: 'View' },
        onClick: () => setPageState("Approver2")
      }
    );
  }
  if (isUserApproverThree) {
    menuProps.items.push(
      {
        key: 'approval3',
        text: 'IT Approval',
        iconProps: { iconName: 'View' },
        onClick: () => setPageState("Approver3")
      }
    );
  }
  if (isUserApproverFour) {
    menuProps.items.push(
      {
        key: 'approval4',
        text: 'GHIT Approval',
        iconProps: { iconName: 'View' },
        onClick: () => setPageState("Approver4")
      }
    );
  }

  return (
    <Stack>
      {
        isMediumScreen ?
        <Stack.Item>
          <DefaultButton
            text="MENU"
            iconProps={{iconName: "CollapseMenu"}}
            menuProps={menuProps}
            className={classes.navButton}
          /> 
        </Stack.Item> :
        <Pivot
          aria-label={"pivot"}
          onLinkClick={(item) => {
            if (item) {
              // checking if clicking away from new and if formmode is not new
              if (item.props.itemKey !== "new" && formSetting.mode !== "new") {
                // set to new to unmount items from page
                setFormSetting({mode: "new"});
              }
              setPageState(item.props.itemKey as mainPageView);
            }
          }}
          selectedKey={pageState}
        >
          <PivotItem headerText="New User" itemKey="new" />
          <PivotItem headerText="Search" itemKey="search" />
          {isUserApproverOne && <PivotItem headerText="SBU HR Approval" itemKey="Approver1" />}
          {isUserApproverTwo && <PivotItem headerText="Head HR Approval" itemKey="Approver2" />}
          {isUserApproverThree && <PivotItem headerText="IT Approval" itemKey="Approver3" />}
          {isUserApproverFour && <PivotItem headerText="GHIT Approval" itemKey="Approver4" />}
          <PivotItem headerText="About" itemKey="about" />
        </Pivot>
      }
    </Stack>
  );
};
