import * as React from "react";
import { 
  Stack, Pivot,
  PivotItem, DefaultButton,
  IContextualMenuProps, mergeStyleSets
} from "office-ui-fabric-react";
// types
import { mainPageView } from "../../types/custom";
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
}

export default ({ pageState, setPageState }: IComponentProps): JSX.Element => {
  
  // user
  const { isUserApproverOne } = useUserData();
  // responsive
  const medium = useMediaQuery({ maxWidth: 600 });
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
        key: 'approval',
        text: 'Approval',
        iconProps: { iconName: 'View' },
        onClick: () => setPageState("approval1")
      }
    )
  }

  return (
    <Stack>
      {
        medium ?
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
            if (item)
            setPageState(item.props.itemKey as mainPageView);
          }}
          selectedKey={pageState}
        >
          <PivotItem headerText="New User" itemKey="new" />
          {isUserApproverOne && <PivotItem headerText="Approvals" itemKey="approval1" />}
          <PivotItem headerText="About" itemKey="about" />
        </Pivot>
      }
    </Stack>
  );
};
