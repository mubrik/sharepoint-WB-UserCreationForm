import * as React from "react";
// ui
import {Stack, DefaultButton,
  ContextualMenu, IContextualMenuProps,
  mergeStyleSets, Nav, INavLinkGroup, StackItem,
  INavLink, SelectionMode,
  Text
} from "office-ui-fabric-react";
import { ListView, 
  IViewField,
} from "@pnp/spfx-controls-react/lib/ListView";
// hooks
import { useNotification } from "../notification/NotificationBarContext";
import { useUserData } from "../userContext/UserContext";
// server
import fetchServer from "../../controller/server";
// types
import { 
  IUserData, mainPageView,
  ISharepointFullFormData,
  keysOfSharepointData,
  keysOfFullFormData,
  approvalStatus, formSettings,
  approvalIndex, IFullFormData
} from "../../types/custom";
// query
import { useMediaQuery } from "react-responsive";
// custom comp
import ListContextualMenu from "../utils/ListContextualMenu";
// utils
import convertSpDataToFormData from "../utils/convertSpDataToFormData";



interface ICompMainStateData {
  data: IFullFormData[] | undefined;
  status: "idle" | "loaded";
}

type viewPage = "Pending" | "Approved" | "Rejected" | "Queried" | "full";

// initial data
const initialData: ICompMainStateData = {
  data: undefined,
  status: "idle"
};

// styles
const classes = mergeStyleSets({
  navButton : {
    width: "100%",
  },
  heightLimit: {
    maxHeight: "75vh",
    overflowY: "auto"
  }
});


interface IComponentProps {
  mainPageView: mainPageView;
  setMainPageState: React.Dispatch<React.SetStateAction<mainPageView>>;
  setFormSetting: React.Dispatch<React.SetStateAction<formSettings>>;
}

export default ({ mainPageView, setMainPageState, setFormSetting}:IComponentProps): JSX.Element => {
  
  // state
  const [stateData, setStateData] = React.useState(initialData); 
  const [filteredData, setFilteredData] = React.useState<IFullFormData[] | undefined>(undefined); // the actual data to be shown
  const [viewPage, setViewPage] = React.useState<viewPage>("Pending"); // page view filter
  // context data
  const { email }: IUserData = useUserData();
  // notify
  const notify = useNotification();
  // responsive
  const isWideScreen = useMediaQuery({ minWidth: 688});

  // effect to fecth data
  React.useEffect(() => {
    if (stateData.status === "idle") {
      // var
      // approval page span multiple approvers
      // each page knows the approver they are fetching/updating from userdata > nav
      // get approver
      fetchServer.getApproverList(email as string, mainPageView as approvalIndex)
        .then(result => {
          // map
          const _data: IFullFormData[] = result.map(item => convertSpDataToFormData(item));
          // set
          setStateData({
            data: _data,
            status: "loaded"
          });
        })
        .catch(error => {
          notify({show: true, isError: true, msg:"Error loading list", errorObj: error});
        });
    }
  }, [stateData.status]);

  // effect for filter 
  React.useEffect(() => {
    if (stateData.status === "loaded" && stateData.data) {
      let approverTag = 
        mainPageView === "Approver1" ? "approver1" : 
        mainPageView === "Approver2" ? "approver2" :
        mainPageView === "Approver3" ? "approver3" : "approver4";

      if (viewPage === "full") {
        setFilteredData(stateData.data);
      } else {
        // filter
        const arrToFilter = stateData.data.filter(item => item[`${approverTag}Status` as keysOfFullFormData] === viewPage);

        setFilteredData(arrToFilter);
      }
    }
  }, [stateData, viewPage]);

  // handlers, using usecallback cause passdown rerenders
  // const handleApprovalAction = React.useCallback(
  //   (id: number, param: approvalStatus): void => {
  //    // call server
  //    fetchServer.approveRejectEntry(id, mainPageView, param)
  //    .then(_ => {
  //      notify({show: true, isError: false, msg:"Item status updated"});
  //      // update state to reload
  //      setStateData(prevValue => ({
  //        ...prevValue,
  //        status: "idle"
  //      }));
  //    })
  //    .catch(error => {
  //      if (error instanceof Error)
  //      notify({show: true, isError: true, msg:"Error Approving Item", errorObj: error});
  //    });
  //  }, [viewPage]
  // );

  const handleViewClick = (id: number): void => {
    // set form setting
    setFormSetting({
      mode: "readOnly",
      id: id
    });
    // switch views
    setMainPageState("new");
  };

  // for nav
  const _onLinkClick = (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) =>  {
    ev?.preventDefault();
    if(item) {
      setViewPage(item.key as viewPage);
    }
  };

  // wide screen nav item, only need render once, instant return
  const navItems: INavLinkGroup[] = React.useMemo(() => ([{
    links: [
      {
        name: "All",
        key: "full",
        target: "_blank",
        url: ""
      },
      {
        name: "Pending",
        key: "Pending",
        target: "_blank",
        url: ""
      }, 
      {
        name: "Approved",
        key: "Approved",
        target: "_blank",
        url: ""
      },
      {
        name: "Queried",
        key: "Queried",
        target: "_blank",
        url: ""
      }, 
      {
        name: "Rejected",
        key: "Rejected",
        target: "_blank",
        url: ""
      }, 
    ]
  }]
  ), []);

  // mobile screen nav item, only need render once, instant return
  const menuProps: IContextualMenuProps = React.useMemo(() => (
    {
      items: [
        {
          key: 'all',
          text: 'All',
          iconProps: { iconName: 'NewTeamProject' },
          onClick: () => setViewPage("full")
        },
        {
          key: 'pending',
          text: 'Pending',
          iconProps: { iconName: 'View' },
          onClick: () => setViewPage("Pending")
        },
        {
          key: 'approved',
          text: 'Approved',
          iconProps: { iconName: 'View' },
          onClick: () => setViewPage("Approved")
        },
        {
          key: 'queried',
          text: 'Queried',
          iconProps: { iconName: 'View' },
          onClick: () => setViewPage("Queried")
        },
        {
          key: 'rejected',
          text: 'Rejected',
          iconProps: { iconName: 'View' },
          onClick: () => setViewPage("Rejected")
        }
      ],
    }
  ), []);

  // view field options for listview
  const viewFields: IViewField[] =  React.useMemo(() => {
    return [
      { name: "creatorEmail", displayName: "Creator", sorting: true, isResizable: true, maxWidth: 120,
        render: ((item: IFullFormData) => <Text variant={"small"}> {item.creatorEmail?.split("@")[0]} </Text>),
        minWidth: 60
      },
      { name: "processor", displayName: "Processor", sorting: true, isResizable: true, minWidth:60, maxWidth: 90 },
      { name: "", sorting: false, maxWidth: 15, minWidth: 10, 
        render: (item: IFullFormData) => 
        <ListContextualMenu 
          data={item}
          approverPage={mainPageView}
          handleView={handleViewClick}
          enableApproval={true}
          onApproval={() => setStateData(prevValue => ({
              ...prevValue,
              status: "idle"
            }))
          }
        />
      },
      { name: "profile", displayName: "Profile", sorting: true, isResizable: true, maxWidth: 100,
        render: (item: IFullFormData) => <Text variant={"small"}> {`${item.firstName}.${item.lastName}`} </Text>
      },
      { name: "office",  displayName: "Sbu", sorting: true, isResizable: true, maxWidth: 80 },
      { name: "department",  displayName: "Dept", isResizable: true, maxWidth: 80},
      { name: "approver1Status", displayName: "SBU HR", isResizable: true, minWidth: 70, maxWidth: 120 },
      { name: "approver2Status", displayName: "HEAD HR", isResizable: true, minWidth: 70, maxWidth: 120 },
      { name: "approver3Status", displayName: "IT", isResizable: true, minWidth: 70, maxWidth: 120,
        render: (item: IFullFormData) => {
          if (item.isDcp === "Yes") {
            return <Text variant={"small"}> {item.approver3Status} </Text>;
          }
          return <Text variant={"small"}> </Text>;
        }
      },
      { name: "approver4Status", displayName: "GHIT", isResizable: true, minWidth: 70, maxWidth: 120 },
    ];
  }, [filteredData, viewPage]);

  return(
    <Stack 
      horizontal={ isWideScreen ? true : undefined}
      tokens={{ childrenGap : 8}}
    >
      <StackItem>
        {
          isWideScreen ?
          <Nav 
            groups={navItems}
            selectedKey={viewPage}
            onLinkClick={(ev, item) => _onLinkClick(ev, item)}
          /> :
          <DefaultButton
            text={viewPage}
            iconProps={{iconName: "CollapseMenu"}}
            menuProps={menuProps}
            className={classes.navButton}
          />
        }
      </StackItem>
      <StackItem grow>
        <Stack tokens={{ childrenGap: 6 }}>
          {
            filteredData === undefined &&
            <div> Loading.. </div>
          }
          {
            filteredData?.length === 0 &&
            <div> Empty </div>
          }
          {
            <ListView 
              compact
              showFilter
              stickyHeader
              items={filteredData}
              viewFields={viewFields}
              selectionMode={SelectionMode.single}
            />
          }
        </Stack>
      </StackItem>
    </Stack>
  );
};