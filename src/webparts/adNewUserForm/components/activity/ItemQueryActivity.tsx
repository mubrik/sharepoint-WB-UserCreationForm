import * as React from "react";
// ui
import { 
  Stack, ActivityItem, StackItem,
  Shimmer, Label, PersonaSize, mergeStyleSets,
  Text, FontIcon, ShimmerElementType
} from "office-ui-fabric-react";
// types
import { 
  IFullFormData, profileDetail
} from "../../types/custom";
// server
import fetchServer from "../../controller/server";

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
    boxShadow: "rgb(0 0 0 / 15%) -1px 0px 4px 0px",
    padding: "6px",
    border: "1px solid #6cc1eb47",
    borderRadius: "8px"
  },
  iconColor: {
    color: "#004e8c"
  }
});

interface IComponentProps {
  data: IFullFormData;
}
/**
 *  Renders the queries of a specific item
 *  @param IComponentProps
 * @returns JSX.Element
 */
export default ({ data }: IComponentProps): JSX.Element => {

  return(
    <Stack tokens={{ childrenGap: 8 }} className={classes.body}>
      <StackItem grow align={"start"} className={classes.header}>
        <FontIcon iconName={"SkypeMessage"} className={classes.iconColor}/>
        <Text variant={"mediumPlus"}> Queries </Text>
      </StackItem>
      {
        data.approver1Query !== "" &&
        <ItemActivity
          email={data.approver1 as string}
          comments={data.approver1Query}
          time={data.approver1Date}
        />
      }
      {
        data.approver2Query !== "" &&
        <ItemActivity
          email={data.approver2 as string}
          comments={data.approver2Query}
          time={data.approver2Date}
        />
      }
      {
        data.approver3Query !== "" &&
        <ItemActivity
          email={data.approver3 as string}
          comments={data.approver3Query}
          time={data.approver3Date}
        />
      }
      {
        data.approver4Query !== "" &&
        <ItemActivity
          email={data.approver4 as string}
          comments={data.approver4Query}
          time={data.approver4Date}
        />
      }
    </Stack>
  );
};

interface IProps {
  email: string;
  comments?: string;
  time?: Date;
}

interface IState extends profileDetail {
  size: PersonaSize;
}

const ItemActivity = ({ email, comments, time }:IProps): JSX.Element => {

  const [approver, setApprover] = React.useState<IState|undefined>(undefined);

  React.useEffect(() => {
    // get data, if invalid, fall back to mail
    fetchServer.getUserDetailsByEmail(email)
      .then(result => {
        const [ok, data, error] = result;
        console.log(data);

        if (ok && data) {
          setApprover({
            ...data,
            size: PersonaSize.size24
          });
        } else {
          setApprover({
            name: email,
            imageUrl: "",
            size: PersonaSize.size24
          });
        }
      })
      .catch(() => {
        setApprover({
          name: email,
          imageUrl: "",
          size: PersonaSize.size24
        });
      });

  }, [email]);

  return(
    <StackItem grow align={"start"} className={classes.itemContainer}>
      <Shimmer 
        // width="120" 
        // height="100" 
        isDataLoaded={Boolean(approver)} 
        shimmerElements={[{
          type: ShimmerElementType.gap,
          width: "150px",
          height: 40
        }]}
      >
       <ActivityItem
          activityDescription={<Text variant={"smallPlus"}> {approver?.name} commented </Text>}
          activityPersonas={approver ? [approver] : undefined}
          comments={comments?.split("^^").map(split => <div style={{margin: "2px"}}> {split} </div>)}
          timeStamp={<Text variant={"small"}> {time?.toLocaleString()} </Text>}
          styles={{
            commentText: {
              marginTop: "4px",
              marginBottom: "4px",
            }
          }}
       />
      </Shimmer>
    </StackItem>
  );

};