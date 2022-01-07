// Page for hosting form, holds data state
import * as React from "react";
import {
  Stack, Separator,
  StackItem, Label,
  Dialog, mergeStyles
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
// query
import { useMediaQuery } from "react-responsive";
// notification 
import { useNotification } from "../notification/NotificationBarContext";
// server
import fetchServer from "../../controller/server";
// hook
import useAddressQuery from "../utils/useAddressQuery";
import { useDialog } from "../dialog/DialogContext";

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
  comment: "",
  sbu: "",
  department: "",
  supervisorEmail: "",
  dangoteEmail: "",
  directReports: "0",
  salaryLevel: "Grade 1",
  salaryStep: "Step 1",
  businessJustification: "New Work Scope",
  staffReplaced: "",
  hardware: "",
};

// layout type
type paneLayoutState = "double" | "single";

interface IComponentProps {
  formSetting: formSettings;
  setFormSetting: React.Dispatch<React.SetStateAction<formSettings>>;
}

// class style
const verticalStyle = mergeStyles({
  height: '400px',
});

export default ({ formSetting, setFormSetting }: IComponentProps): JSX.Element => {

  // layout state
  const [layoutState, setLayoutState] = React.useState<paneLayoutState>("double");
  const [showQueryDialog, setShowQueryDialog] = React.useState(false);
  const [formIsValid, setFormIsValid] = React.useState(false);
  const [formIsLoading, setFormIsLoading] = React.useState(false);
  const [formIsTouched, setFormIsTouched] = React.useState(false);
  // controlled form data
  // state changes causing a lot of mainpage re render, move to seperate comp and use context?
  const [formData, setFormData] = React.useState(initialMainFormData);
  console.log("render mainpage");
  // responsive
  const isMediumScreen = useMediaQuery({ maxWidth: 820 });
  // notify
  const notify = useNotification();
  // user
  const { displayName, email } = useUserData();
  // url address query
  const addressQuery = useAddressQuery();
  // show dialog
  const setDialog = useDialog();

  // testing
  React.useEffect(() => {
    fetchServer.testing();
  }, []);

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
    if (formSetting.mode === "readOnly" || formSetting.mode === "approval") {
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
            comment: result.Comment ? result.Comment: "",
            privateEmail: result.PrivateEmail,
            privateNumber: result.PrivateNumber,
            mobileNumber: result.MobileNumber,
            address: result.Address,
            city: result.City,
            country: result.Country,
            jobTitle: result.JobTitle,
            sbu: result.Office,
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
        });
      }
      // set data
    }
  }, [formSetting]);

  // effect to run on unmount
  React.useEffect(() => {
    // set form mode back to new
    if (formSetting.mode !== "new" && formData.id){
      return () => setFormSetting({
        mode: "new"
      });
    }
  }, [formSetting, formData]);

  // handler for all sub comp, TS hack? but i think i know what i'm doing lol
  // memoised cause will be passed down 
  const handleInputChange = React.useCallback(
    <T extends keysOfFullFormData, A>( field:T, value: A) => {
      // set touched
      setFormIsTouched(true);
      // some light editing
      if (field.toLowerCase().includes("name")) {
        // mutate value to remove spaces
        if (typeof value === "string") {

          setFormData(prevValue => {
            return {
              ...prevValue,
              [field]: value.trim()
            };
          });

          console.log(value);
          return;
        }
      }

      // set form data
      setFormData(prevValue => {
        return {
          ...prevValue,
          [field]: value
        };
      });
    }, []
  );

  // handle submit
  const handleSubmit = (): void => {
    // loading
    setFormIsLoading(true);
    // request
    fetchServer.createRequest(formData, email)
    .then(() => {
      notify({show: true, msg: "Request Created", errorObj: null});
      // reset form, un comment when not testing
      // setFormIsTouched(false);
      // setFormData(initialMainFormData);
    })
    .catch(error => {
      if (error instanceof Error) {
        notify({show: true,
          msg: error.message ? error.message :  "Error Creating Item", 
          errorObj: error, 
          isError: true, 
          type: "error"
        });
      }
    })
    .finally(() => setFormIsLoading(false));
  };

  // handle load query
  const handleSetQuery = (): void => {

    if (addressQuery) {
      const [id, other] = addressQuery;
      setFormSetting({
        id: Number(id),
        mode: "approval"
      });
      // change url to remove query
      window.history.replaceState(null, "", window.location.href.split("?")[0]);
    }
  };

  if (addressQuery && formSetting.mode === "new") {
    setDialog({
      show: true,
      msg: "Load query data?",
      onAccept: handleSetQuery,
      onClose: () => {
        // change url to remove query
        window.history.replaceState(null, "", window.location.href.split("?")[0]);
      }
    });
  }
 

  return(
    <Stack tokens={{childrenGap : 8}}>
      <StackItem align="center">
        <Label>
          Hello {displayName ? displayName : ""}
        </Label>
      </StackItem>
      <StackItem grow>
        <Stack 
          tokens={{childrenGap : 12}}
          horizontal={ isMediumScreen ? undefined : true}
        > 
          <StackItem grow>
            <UserInfoForm
              layout={layoutState}
              formData={formData}
              formSetting={formSetting}
              setFormData={handleInputChange}
            />
          </StackItem>
          <StackItem className={ isMediumScreen ? undefined : verticalStyle}>
            <Separator vertical={ isMediumScreen ? undefined : true }/>
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
      </StackItem>
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