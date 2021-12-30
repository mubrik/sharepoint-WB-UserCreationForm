// Page for hosting form, holds data state
import * as React from "react";
import {
  Stack, PrimaryButton,
  StackItem, Label,
  IconButton
} from "office-ui-fabric-react";
// data
import { IFullFormData, keysOfFullFormData,
  formSettings
} from "../../types/custom";
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

interface IComponentProps {
  formSetting: formSettings;
  setFormSetting: React.Dispatch<React.SetStateAction<formSettings>>;
}

export default ({ formSetting, setFormSetting }: IComponentProps): JSX.Element => {

  // layout state
  const [layoutState, setLayoutState] = React.useState<paneLayoutState>("double");
  const [formIsValid, setFormIsValid] = React.useState(false);
  const [formIsLoading, setFormIsLoading] = React.useState(false);
  const [formIsTouched, setFormIsTouched] = React.useState(false);
  // controlled form data
  // state changes causing a lot of mainpage re render, move to seperate comp and use context?
  const [formData, setFormData] = React.useState(initialMainFormData);
  console.log("render mainpage");
  // responsive
  const isWideScreen = useMediaQuery({ maxWidth: 820 });
  // notify
  const notify = useNotification();
  // user
  const { displayName } = useUserData();

  // effect for validation notification
  React.useEffect(() => {
    // only validate if form is touched
    if (formIsTouched && formSetting.mode === "new") {
      // validate
      const [isValid, isError, msg] = validator(formData);
      
      if (isError) {
        notify({msg: msg, isError: true, show: true, errorObj: null});
      } else {
        notify({msg: "", isError: false, show: false, errorObj: null});
      }
      setFormIsValid(isValid);
    }
  }, [formIsTouched, formData, formSetting]);

  // effect for fetching
  React.useEffect(() => {
    if (formSetting.mode === "readOnly") {
      // fetch data
      if (formSetting.id) {
        fetchServer.getListItemById(formSetting.id)
        .then(result => {
          console.log(result);
          setFormData({
            id: result.Id,
            title: result.Title,
            firstName: result.FirstName,
            lastName: result.LastName,
            initials: result.Initials ? result.Initials : "",
            privateEmail: result.PrivateEmail,
            privateNumber: result.PrivateNumber,
            mobileNumber: result.MobileNumber,
            address: result.Address,
            city: result.City,
            country: result.Country,
            jobTitle: result.JobTitle,
            office: result.Office,
            department: result.Department,
            supervisorEmail: result.SupervisorEmail,
            dangoteEmail: result.DangoteEmail,
            directReports: result.DirectReports,
            salaryLevel: result.SalaryGrade,
            salaryStep: result.SalaryStep,
            businessJustification: result.BusinessJustification,
            staffReplaced: result.StaffReplaced ? result.StaffReplaced : "",
            hardware: result.Hardware,
          });
        })
        .catch(error => {
          if (error instanceof Error) {
            notify({show: true, msg: "Error Getting Item, Try Again", errorObj: error, isError: true, type: "error"});
          }
        })
      }
      // set data
    }
  }, [formSetting]);

  // effect to run on unmount
  React.useEffect(() => {
    if (formSetting.mode === "readOnly" && formData.id){
      return () => setFormSetting({
        mode: "new"
      });
    }
  }, [formSetting, formData]);

  

  // handler for all sub comp, TS hack? but i think i know what i'm doing lol
  // memoised cause will be passed down 
  const handleInputChange = React.useCallback(
    <T extends keysOfFullFormData, A>( key:T, value: A) => {
      // set touched
      setFormIsTouched(true);
      // set form data
      setFormData(prevValue => {
        return {
          ...prevValue,
          [key]: value
        }
      })
    }, []
  );

  // handle submit
  const handleSubmit = (): void => {
    // loading
    setFormIsLoading(true);
    // request
    fetchServer.createRequest(formData)
    .then(() => {
      notify({show: true, msg: "Request Created", errorObj: null});
      // reset form, un comment when not testing
      // setFormIsTouched(false);
      // setFormData(initialMainFormData);
    })
    .catch(error => {
      if (error instanceof Error) {
        notify({show: true, msg: "Error Creating Item", errorObj: error, isError: true, type: "error"});
      }
    })
    .finally(() => setFormIsLoading(false));
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
              formSetting={formSetting}
              setFormData={handleInputChange}
            />
          </StackItem>
          <StackItem grow>
            <BusinessInfoForm
              layout={layoutState}
              formData={formData}
              formSetting={formSetting}
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
              formSetting={formSetting}
              setFormData={handleInputChange}
            />
          }
          form2={
            <BusinessInfoForm
              layout={layoutState}
              formData={formData}
              formSetting={formSetting}
              setFormData={handleInputChange}
            />
          }
        />
      }
      { 
        formSetting.mode === "new" &&
        <LoadingButton
          disabled={!formIsValid || formIsLoading}
          loading={formIsLoading}
          loadingMsg={"Creating"}
          text={"Submit"}
          onClick={handleSubmit}
        />
      }
    </Stack>
  );
};