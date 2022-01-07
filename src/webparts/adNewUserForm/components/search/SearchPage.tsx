// comp for search options
import * as React from "react";
// ui
import { 
  Stack, Dropdown, 
  StackItem, IDropdownOption 
} from "office-ui-fabric-react";
import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from "@pnp/spfx-controls-react/lib/ListView";
// server
import fetchServer from "../../controller/server";

const sbuOpts: IDropdownOption[] = [
  {key: "DCP-Ibese", text: "DCP-Ibese"},
  {key: "DCP-Transport Ibese", text: "DCP-Transport Ibese"},
  {key: "DCP-Transport Gboko", text: "DCP-Transport Gboko"},
  {key: "DCP-Transport Obajana", text: "DCP-Transport Obajana"},
  {key: "DCP-Obajana", text: "DCP-Obajana"},
  {key: "DCP-Gboko", text: "DCP-Gboko"},
  {key: "DCP-Cameroun", text: "DCP-Cameroun"},
  {key: "DCP-Congo", text: "DCP-Congo"},
  {key: "DCP-Ethopia", text: "DCP-Ethopia"},
  {key: "DCP-Ghana", text: "DCP-Ghana"},
  {key: "DCP-HQ", text: "DCP-HQ"},
  {key: "DCP-Okpella", text: "DCP-Okpella"},
  {key: "DCP-Senegal", text: "DCP-Senegal"},
  {key: "DCP-Sierra Leone", text: "DCP-Sierra Leone"},
  {key: "DCP-Tanzania", text: "DCP-Tanzania"},
  {key: "DCP-Zambia", text: "DCP-Zambia"},
];

const viewFields: IViewField[] = [
  { name: "creatorEmail", displayName: "Creator", sorting: true, isResizable: true, maxWidth: 150 },
  { name: "FirstName", sorting: true, isResizable: true, maxWidth: 100 },
  { name: "LastName", sorting: true, isResizable: true },
  { name: "Office", sorting: true, isResizable: true  },
  { name: "Department", isResizable: true  },
  { name: "DangoteEmail", isResizable: true  },
  { name: "BusinessJustification", isResizable: true  },
  { name: "Approver1Status", isResizable: true  },
  { name: "Approver2Status", isResizable: true  },
  { name: "Approver3Status", isResizable: true  },
  { name: "Approver4Status", isResizable: true  },
];

export default (): JSX.Element => {

  const [dropDownOption, setDropDownOption] = React.useState<IDropdownOption>({key: "blank", text: ""});
  const [filterList, setFilterList] = React.useState<any[]>([]);

  // fetch effect
  React.useEffect(() => {

    if (dropDownOption.key !== "blank") {
      fetchServer.getListFilterBySbu(dropDownOption.key as string)
      .then(result => {
        setFilterList(result);
      })
      .catch(error => {
        console.log(error);
      })
    }

  }, [dropDownOption]);

  return(
    <Stack tokens={{ childrenGap: 8}}>
      <StackItem>
        <Dropdown 
          label="Select Your SBU"
          selectedKey={dropDownOption.key}
          options={sbuOpts}
          onChange={(_, newValue) => setDropDownOption(newValue as IDropdownOption)}
        />
      </StackItem>
      <StackItem>
      {
        dropDownOption.key === "blank" ?
        <p> Please select your SBU </p> :
        filterList.length === 0 ? 
        <p> No items for that SBU </p> :
        <ListView 
          compact
          showFilter
          stickyHeader
          items={filterList}
          viewFields={viewFields}
        />
      }
      </StackItem>
    </Stack>
  );
};