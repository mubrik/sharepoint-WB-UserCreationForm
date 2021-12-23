// Page for hosting form, holds data state
import * as React from "react";
import {
  Stack, PrimaryButton,
  StackItem, Label,
  IconButton
} from "office-ui-fabric-react";
// data
import { IFullFormData, keysOfFullFormData } from "../../types/custom";
// validator
import validator from "../validator/validator";
// custom comp
import UserInfoForm from "./UserInfoForm";
import BusinessInfoForm from "./BusinessInfoForm";
import LoadingButton from "../utils/LoadingButton";
// hooks
import { useUserData } from "../userContext/UserContext";
// layout
import SplitPaneLayout from "../layout/SplitPaneLayout";
// query
import { useMediaQuery } from "react-responsive";
// notification 
import { useNotification } from "../notification/NotificationBarContext";
// server
import fetchServer from "../../controller/server";

// initial form data
const initialMainFormData: IFullFormData  = {
  title: "Mr",
  firstName: "",
  lastName: "",
  initials: "",
  privateEmail: "",
  privateNumber: "",
  mobileNumber: "",
  address: "",
  city: "",
  country: "",
  jobTitle: "",
  office: "DCP-Ibese",
  department: "",
  supervisorEmail: "",
  dangoteEmail: "",
  directReports: "0",
  salaryLevel: "Grade 1",
  salaryStep: "Step 1",
  businessJustification: "New Work Scope",
  staffReplaced: "",
  hardware: "",
}

// layout type
type paneLayoutState = "double" | "single";

export default (): JSX.Element => {

  // layout state
  const [layoutState, setLayoutState] = React.useState<paneLayoutState>("double");
  const [formIsValid, setFormIsValid] = React.useState(false);
  const [formIsLoading, setFormIsLoading] = React.useState(false);
  // responsive
  const isWideScreen = useMediaQuery({ maxWidth: 820 });
  // notify
  const notify = useNotification();
  // user
  const { displayName } = useUserData();
  // controlled form data
  const [formData, setFormData] = React.useState(initialMainFormData);

  // effect for validation notification
  React.useEffect(() => {
    const [isValid, isError, msg] = validator(formData);

    if (isError) {
      setFormIsValid(false);
      notify({msg: msg, isError: true, show: true, errorObj: null});
    } else {
      setFormIsValid(true);
      notify({msg: "", isError: false, show: false, errorObj: null});
    }

    console.log(isValid, isError, msg);
  }, [formData])

  // handler for all sub comp, TS hack? but i think i know what i'm doing lol
  const handleInputChange = <T extends keysOfFullFormData, A>( key:T, value: A) => {
    // set form data
    setFormData(prevValue => {
      return {
        ...prevValue,
        [key]: value
      }
    })
  };

  // handle submit
  const handleSubmit = (): void => {
    setFormIsLoading(true);
    fetchServer.createRequest(formData)
    .then(() => {
      setFormIsLoading(false);
      notify({show: true, msg: "Request Created", errorObj: null});
    })
  };
  // memo just for flex
  const iconProps = React.useMemo(() => {
    return {
      iconName: layoutState === "double" ? "OpenPane" : "ClosePane",
      title: layoutState === "double" ? "OpenPane" : "ClosePane",
    }
  }, [layoutState])
 

  return(
    <Stack tokens={{childrenGap : 8}}>
      <StackItem align="center">
        <Label>
          Hello {displayName ? displayName : ""}
        </Label>
      </StackItem>
      <StackItem align="end">
        <IconButton 
          iconProps={iconProps}
          onClick={() => {
            layoutState === "double" ? setLayoutState("single") : setLayoutState("double")
          }}
        />
      </StackItem>
      { 
        // if layout in double page
        layoutState === "double" &&
        <Stack 
          tokens={{childrenGap : 12}}
          horizontal={isWideScreen ? undefined : true}
        > 
          <StackItem grow>
            <UserInfoForm
              layout={layoutState}
              formData={formData}
              setFormData={handleInputChange}
            />
          </StackItem>
          <StackItem grow>
            <BusinessInfoForm
              layout={layoutState}
              formData={formData}
              setFormData={handleInputChange}
            />
          </StackItem>
        </Stack>
      }
      {
        layoutState === "single" &&
        <SplitPaneLayout 
          form1={
            <UserInfoForm
              layout={layoutState}
              formData={formData}
              setFormData={handleInputChange}
            />
          }
          form2={
            <BusinessInfoForm
              layout={layoutState}
              formData={formData}
              setFormData={handleInputChange}
            />
          }
        />
      }
      <LoadingButton
        disabled={!formIsValid || formIsLoading}
        loading={formIsLoading}
        loadingMsg={"Creating"}
        text={"Submit"}
        onClick={handleSubmit}
      />
    </Stack>
  );
};