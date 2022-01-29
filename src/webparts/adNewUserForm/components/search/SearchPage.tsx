// comp for search options
import * as React from "react";
// ui
import { 
  Stack, Dropdown, 
  StackItem, IDropdownOption,
  Spinner, Text, SelectionMode
} from "office-ui-fabric-react";
import { ListView, 
  IViewField,
} from "@pnp/spfx-controls-react/lib/ListView";
// types
import { formSettings, mainPageView,
  ISharepointFullFormData, IFullFormData
} from "../../types/custom";
// data
import { 
  locationOpts, agrosackSbuOpts,
  dcpSbuOpts, dfmSbuOpts, dancomSbuOpts,
  contractorsSbuOpts, dsrSbuOpts,
  otherSbuOpts
} from "../utils/optionData";
// server
import fetchServer from "../../controller/server";
// custom
import ListContextualMenu from "../utils/ListContextualMenu";
// notify
import { useNotification } from "../notification/NotificationBarContext";
// utils
import convertSpDataToFormData from "../utils/convertSpDataToFormData";

interface IComponentProps {
  setFormSetting: React.Dispatch<React.SetStateAction<formSettings>>;
  setMainPageState: React.Dispatch<React.SetStateAction<mainPageView>>;
}

export default ({setFormSetting, setMainPageState}: IComponentProps): JSX.Element => {

  const [sbuOption, setSbuOption] = React.useState<IDropdownOption | undefined>(undefined);
  const [officeOption, setOfficeOption] = React.useState<IDropdownOption | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const [filterList, setFilterList] = React.useState<IFullFormData[]>([]);
  // notification
  const notify = useNotification();

  // fetch effect
  React.useEffect(() => {
    if (officeOption) {
      setIsLoading(true);
      fetchServer.getListFilterBySbu(officeOption.key as string)
      .then(result => {
        setFilterList(result.map(item => convertSpDataToFormData(item)));
      })
      .catch(error => {
        if (error instanceof Error) {
          notify({
            show: true,
            msg: error.message ? error.message : "Error Getting Item, Try Again",
            errorObj: error,
            isError: true,
            type: "error"
          });
        }
      })
      .finally(() => setIsLoading(false));
    }

  }, [officeOption]);


  // handler for contx menu
  const handleViewClick = (id: number): void => {
    // set form setting
    setFormSetting({
      mode: "readOnly",
      id: id
    });
    // switch views
    setMainPageState("new");
  };

  const handleEditClick = (id: number): void => {
    // set form setting
    setFormSetting({
      mode: "edit",
      id: id
    });
    // switch views
    setMainPageState("new");
  };

  const viewFields: IViewField[] = React.useMemo(() => {
    return [
      { name: "creatorEmail", displayName: "Creator", sorting: true, isResizable: true, maxWidth: 120,
        render: ((item: IFullFormData) => <Text variant={"small"}> {item.creatorEmail?.split("@")[0]} </Text>),
        minWidth: 60
      },
      { name: "processor", displayName: "Processor", isResizable: true, minWidth:60, maxWidth: 90 },
      { name: "", sorting: false, maxWidth: 20 , 
        render: (item: IFullFormData) => 
        <ListContextualMenu 
          data={item} 
          handleView={handleViewClick}
          handleEdit={handleEditClick}
          enableApproval={false}
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
  }, [officeOption, filterList]);

  return(
    <Stack tokens={{ childrenGap: 8 }}>
      <Stack tokens={{ childrenGap: 6 }} horizontal>
        <StackItem grow>
          <Dropdown 
            label="Select Your SBU"
            selectedKey={sbuOption ? sbuOption.key : sbuOption}
            options={locationOpts}
            onChange={(_, newValue) => setSbuOption(newValue as IDropdownOption)}
          />
        </StackItem>
        <StackItem grow>
          <Dropdown 
            disabled={sbuOption ? false : true}
            label="Select Office"
            selectedKey={officeOption ? officeOption.key : officeOption}
            options={
              sbuOption?.key === "Agrosacks" ? agrosackSbuOpts :
              sbuOption?.key === "Contractors" ? contractorsSbuOpts :
              sbuOption?.key === "Dancom" ? dancomSbuOpts :
              sbuOption?.key === "DCP" ? dcpSbuOpts :
              sbuOption?.key === "DSR" ? dsrSbuOpts :
              sbuOption?.key === "Flour" ? dfmSbuOpts : otherSbuOpts
            }
            onChange={(_, newValue) => setOfficeOption(newValue as IDropdownOption)}
          />
        </StackItem>

      </Stack>
      <StackItem>
      {
        officeOption === undefined ?
        <p> Please select Office </p> :
        isLoading ? 
        <>
          <Spinner label="I am definitely loading..." />
        </> :
        filterList.length === 0 ? 
        <p> No items for that Office </p> :
        <ListView 
          compact
          showFilter
          stickyHeader
          items={filterList}
          viewFields={viewFields}
          selectionMode={SelectionMode.single}
        />
      }
      </StackItem>
    </Stack>
  );
};