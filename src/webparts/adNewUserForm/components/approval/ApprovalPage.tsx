import * as React from "react";
// ui
import {Stack, DefaultButton,
  ContextualMenu, IContextualMenuProps,
  mergeStyleSets, Nav, INavLinkGroup, StackItem,
  INavLink,
  TextField
} from "office-ui-fabric-react";
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
  approvalStatus, formSettings
} from "../../types/custom";
// query
import { useMediaQuery } from "react-responsive";
// custom comp
import ApprovalItem from "./ApprovalItem";


interface IComponentProps {
  mainPageView: mainPageView;
  setMainPageState: React.Dispatch<React.SetStateAction<mainPageView>>;
  setFormSetting: React.Dispatch<React.SetStateAction<formSettings>>;
}

interface ICompMainStateData {
  data: ISPData | null;
  status: "idle" | "loaded";
}

interface ISPData {
  full: ISharepointFullFormData[];
  pending: ISharepointFullFormData[];
  approved: ISharepointFullFormData[];
  rejected: ISharepointFullFormData[];
}

type viewPage = "pending" | "approved" | "rejected" | "full";

// initial data
const initialData: ICompMainStateData = {
  data: null,
  status: "idle"
};

// nav item
const navItems: INavLinkGroup[] = [
  {
    links: [
      {
        name: "All",
        key: "full",
        target: "_blank",
        url: ""
      },
      {
        name: "Pending",
        key: "pending",
        target: "_blank",
        url: ""
      }, 
      {
        name: "Approved",
        key: "approved",
        target: "_blank",
        url: ""
      }, {
        name: "Rejected",
        key: "rejected",
        target: "_blank",
        url: ""
      }, 
    ]
  }
];

// styles
const classes = mergeStyleSets({
  navButton : {
    width: "100%",
  }
});

export default ({ mainPageView, setMainPageState, setFormSetting}:IComponentProps): JSX.Element => {
  
  // state
  const [stateData, setStateData] = React.useState(initialData); 
  const [filteredData, setFilteredData] = React.useState<ISharepointFullFormData[] | null>(null); // the actual data to be shown
  const [viewPage, setViewPage] = React.useState<viewPage>("pending"); // page view filter
  const [filterText, setFilterText] = React.useState("");
  // context data
  const { email, isUserApproverOne }: IUserData = useUserData();
  // notify
  const notify = useNotification();
  // responsive
  const isWideScreen = useMediaQuery({ minWidth: 688});

  // effect to fecth data
  React.useEffect(() => {
    if (stateData.status === "idle") {
      // var
      let query:Promise<ISharepointFullFormData[]>;
      // switch
      switch (mainPageView) {
        case "approval1": 
          // do something
          query = fetchServer.getApproverOneList(email as string);
          break;
         
        default:
          query = new Promise(() => []);
          break;
      }
      // work on result
      query
        .then(result => {
          // approver string
          const approver = mainPageView === "approval1" ? "Approver1" : "Approver2"; // approver2 etc.. empty for now
          // arrays
          const _pending: ISharepointFullFormData[] = [];
          const _approved: ISharepointFullFormData[] = [];
          const _rejected: ISharepointFullFormData[] = [];
          // loop
          result.forEach(item => {
            if (item[`${approver}Status` as keysOfSharepointData] === "Pending") {
              _pending.push(item);
            } else if (item[`${approver}Status` as keysOfSharepointData] === "Approved") {
              _approved.push(item);
            } else if (item[`${approver}Status` as keysOfSharepointData] === "Rejected") {
              _rejected.push(item);
            }
          });
          // set
          setStateData({
            data: {
              full: result,
              approved: _approved,
              pending: _pending,
              rejected: _rejected,
            },
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
      const arrToFilter = stateData.data[viewPage].slice();

      // filter only if text
      const filteredArr = filterText === "" ?  arrToFilter : arrToFilter.filter((item) => {
        return `${item.FirstName} ${item.LastName}`.toLowerCase().includes(filterText.toLowerCase());
      });

      setFilteredData(filteredArr);
    }
  }, [filterText, stateData, viewPage]);

  // handlers
  const handleApprovalAction = (id: number, param: approvalStatus): void => {
    // call server
    fetchServer.approveRejectEntry(id, mainPageView, param)
    .then(_ => {
      notify({show: true, isError: false, msg:"Item status updated"});
      // update state to reload
      setStateData(prevValue => ({
        ...prevValue,
        status: "idle"
      }));
    })
    .catch(error => {
      if (error instanceof Error)
      notify({show: true, isError: true, msg:"Error Approving Item", errorObj: error});
    });
  };

  const handleViewClick = (id: number): void => {
    // set form setting
    setFormSetting({
      mode: "readOnly",
      id: id
    });
    // switch views
    setMainPageState("new");
  };

  const handleFilterValue = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) => {
    // add clean later for sanitized input
    // checking undefined cause i need empty string to pass
    if (typeof newValue !== "undefined") {
      setFilterText(newValue);
    }
  };

  // for nav
  const _onLinkClick = (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) =>  {
    ev?.preventDefault();
    if(item) {
      setViewPage(item.key as viewPage);
    }
  };

  const menuProps: IContextualMenuProps = {
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
        onClick: () => setViewPage("pending")
      },
      {
        key: 'approved',
        text: 'Approved',
        iconProps: { iconName: 'View' },
        onClick: () => setViewPage("approved")
      },
      {
        key: 'rejected',
        text: 'Rejected',
        iconProps: { iconName: 'View' },
        onClick: () => setViewPage("rejected")
      }
    ],
  };

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
        <Stack tokens={{ childrenGap: 6}}>
          <StackItem>
            <TextField 
              label="Filter Name:"
              value={filterText}
              onChange={handleFilterValue}
            />
          </StackItem>
        {
          filteredData === null &&
          <div> Loading.. </div>
        }
        {
          filteredData?.length === 0 &&
          <div> Empty </div>
        }
        {
          filteredData?.map((item, index) => 
            <ApprovalItem 
              approvalItem={item}
              index={index}
              handleViewClick={handleViewClick}
              handleApprovalAction={handleApprovalAction}
            />
          )
        }
        </Stack>
      </StackItem>
    </Stack>
  );
};