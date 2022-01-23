import * as React from "react";
// ui
import { Stack, Persona,
  Shimmer, PersonaSize, StackItem,
  Text, mergeStyleSets, FontIcon
} from "office-ui-fabric-react";
// types
import { 
  profileDetail, IFormUserData, IFullFormData,
  approvalStatus
} from "../../types/custom";
// server
import fetchServer from "../../controller/server";
// responsive
import { useMediaQuery } from "react-responsive";

const classes = mergeStyleSets({
  body: {
    padding: "6px",
    border: "1px solid #edebe9",
    borderRadius: "8px"
  },
  header: {
    marginBottom: "4px"
  },
  itemContainer: {
    boxShadow: "rgb(183 183 183 / 75%) -1px 0px 3px 1px",
    padding: "6px",
    borderRadius: "8px",
    position: "relative"
  },
  iconColor: {
    color: "#004e8c"
  },
  Approved: {
    color: "green",
    position: "absolute",
    right: "4px",
    top: "4px",
  },
  Pending: {
    color: "blue",
    position: "absolute",
    right: "4px",
    top: "4px",
  },
  Queried: {
    color: "#673ab7",
    position: "absolute",
    right: "4px",
    top: "4px",
  },
  Rejected: {
    color: "red",
    position: "absolute",
    right: "4px",
    top: "4px",
  }
});

interface IComponentProps {
  data: IFullFormData;
}

export default ({ data }: IComponentProps): JSX.Element => {

  return(
    <Stack tokens={{ childrenGap: 6 }} className={classes.body}>
      <StackItem grow align={"start"} className={classes.header}>
        <FontIcon iconName={"Info"} className={classes.iconColor}/>
        <Text variant={"mediumPlus"}> Status </Text>
      </StackItem>
      <StackItem grow align={"start"}>
        <ItemStatus data={data}/>
      </StackItem>
      <Stack horizontal tokens={{ childrenGap : 8 }} wrap>
        <StackItem grow={2} align={"center"} className={classes.itemContainer}>
          <Stack tokens={{ childrenGap : 2 }} horizontalAlign={"center"}>
            <Text variant={"small"}> SBU Approver </Text>
            <SingleApprover email={data.approver1 ? data.approver1 : ""} status={data.approver1Status} date={data.approver1Date}/>
          </Stack>
        </StackItem>
        <StackItem grow={2} align={"center"} className={classes.itemContainer}>
          <Stack tokens={{ childrenGap : 2}} horizontalAlign={"center"}>
            <Text variant={"small"}> Head HR Approver </Text>
            <SingleApprover email={data.approver2 ? data.approver2 : ""} status={data.approver2Status} date={data.approver2Date}/>
          </Stack>
        </StackItem>
        {
          data.isDcp === "Yes" &&
          <StackItem grow={2} align={"center"} className={classes.itemContainer}>
            <Stack tokens={{ childrenGap : 2 }} horizontalAlign={"center"}>
              <Text variant={"small"}> DCP IT Approver </Text>
              <SingleApprover email={data.approver3 ? data.approver3 : ""} status={data.approver3Status} date={data.approver3Date}/>
            </Stack>
          </StackItem>
        }
        <StackItem grow={2} align={"center"} className={classes.itemContainer}>
          <Stack tokens={{ childrenGap : 2 }} horizontalAlign={"center"}>
            <Text> GHIT Approver </Text>
            <SingleApprover email={data.approver4 ? data.approver4 : ""} status={data.approver4Status} date={data.approver4Date}/>
          </Stack>
        </StackItem>
      </Stack>

    </Stack>
  );
};

interface ISingleApproverProps {
  email: string;
  status: approvalStatus | undefined;
  date?: Date;
}

/**
 *  Renders an approver name and status, shimmer included for loading
 * @param ICComponentProps 
 * @returns JSX.Element 
 */
const SingleApprover = ({ email, status, date }: ISingleApproverProps): JSX.Element => {

  const [approver, setApprover] = React.useState<profileDetail|undefined>(undefined);

  // responsive
  const isSmallScreen = useMediaQuery({ maxWidth: 620 });
 
  React.useEffect(() => {
    fetchServer.getUserDetailsByEmail(email)
    .then(result => {
      const [ok, data, error] = result;

      if (ok && data) {
        setApprover(data);
      } else {
        // notify error later
        // if error use fall back
        setApprover({
          name: email,
          imageUrl: "",
        });
      }
    })
  }, []);

  return(
    <>
      <ItemStatusIcon status={status}/>
      <StackItem grow>
        <Shimmer width="50" height="100" isDataLoaded={Boolean(approver)}>
          <Persona 
            imageUrl={approver ? approver.imageUrl : undefined}
            text={approver ? approver.name : undefined}
            size={isSmallScreen ? PersonaSize.size8 : PersonaSize.size24}
          />
        </Shimmer>
      </StackItem>
      <StackItem grow>
        {
          status === "Pending" ? 
          <Text variant={"small"}> Status: {status} </Text> :
          <Text variant={"small"}> Status: {status} on {date?.toLocaleDateString()} </Text> 
        }
      </StackItem>
    </>
  );
};

/**
 *  Renders an item current status text
 * @param IComponentProps
 * @returns JSX.Element  
 */
const ItemStatus = ({ data }: IComponentProps): JSX.Element => {
  // just a couple of if checks 

  // check if item has been rejected
  // confirm later if other field wont trigger 'rejected'
  if (Object.values(data).includes("Rejected")) {
    return(
      <Text
        styles={{
        root: {
          color: "red"
        }}}
      > This item has been Rejected by an Approver </Text>
    );
  }

  // queried
  if (Object.values(data).includes("Queried")) {
    return(
      <Text
        styles={{
        root: {
          color: "#673ab7"
        }}}
      > This item has been Queried by an Approver  </Text>
    );
  }

  // pending
  if (Object.values(data).includes("Pending")) {
    return(
      <Text
        styles={{
        root: {
          color: "blue"
        }}}
      > This item is awaiting Approval </Text>
    );
  }

  // if none of that
  return(
    <Text
      styles={{
      root: {
        color: "green"
      }}}
    > This item has been approved </Text>
  );
};


interface IIconStatus {
  status?: approvalStatus;
}

/**
 * Renders an icon depending on status
 * @param status string
 */
const ItemStatusIcon = ({ status }: IIconStatus): JSX.Element => {

  const iconName = status === "Approved" ? "SkypeCheck" :
    status === "Pending" ? "Sync" :
    status === "Rejected" ? "Cancel" :
    status === "Queried" ? "Info" : undefined;

  const iconClassName = classes[`${status}` as keyof typeof classes];

  return(
    <FontIcon 
      iconName={iconName}
      className={iconClassName as string}
    />
  );
};