// Page for hosting form, holds data state
import * as React from "react";
import {
  Stack, Separator, Text,
  StackItem, Label, FontIcon, 
  Dialog, mergeStyleSets, PrimaryButton, DefaultButton
} from "office-ui-fabric-react";
// data
import { IFullFormData, keysOfFullFormData,
  formSettings, IApproverObj,
} from "../../types/custom";
// validator
import validator from "../validator/validator";
// custom comp
import UserInfoForm from "./UserInfoForm";
import BusinessInfoForm from "./BusinessInfoForm";
import LoadingButton from "../utils/LoadingButton";
import ApproversDisplay from "../approval/ApproversDisplay";
import ItemQueryActivity from "../activity/ItemQueryActivity";
// hooks
import useAddressQuery from "../utils/useAddressQuery";
import { useDialog } from "../dialog/DialogContext";
import { useUserData } from "../userContext/UserContext";
import { hasNextUserApproved, hasPrevUserApproved } from "../utils/approverCheck";
// query
import { useMediaQuery } from "react-responsive";
// notification 
import { useNotification } from "../notification/NotificationBarContext";
// server
import fetchServer from "../../controller/server";
// utils
import convertSpDataToFormData from "../utils/convertSpDataToFormData";

// initial form data
const initialMainFormData: IFullFormData  = {
  title: "Mr",
  firstName: "",
  lastName: "",
  initials: "",
  privateEmail: "",
  workNumber: "",
  mobileNumber: "",
  privateNumber: "",
  address: "",
  city: "",
  country: "",
  jobTitle: "",
  comment: "",
  sbu: "",
  office: "",
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
const classes = mergeStyleSets({
  seperatorHeight: {
    height: "400px"
  },
  body: {
    padding: "6px",
    border: "1px solid #edebe9",
    borderRadius: "8px"
  },
  header: {
    marginBottom: "4px"
  },
  iconColor: {
    color: "#004e8c"
  }
});

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
  const isMediumScreen = useMediaQuery({ maxWidth: 820 });
  // notify
  const notify = useNotification();
  // user
  const { email } = useUserData();
  // url address query
  const addressQuery = useAddressQuery();
  // show dialog
  const setDialog = useDialog();

  // testing
  React.useEffect(() => {
    // fetchServer.getSharepointApprovers("others")
    // .then(res => console.log(res));
  }, []);

  // effect for validation notification
  React.useEffect(() => {
    // only validate if form is touched
    if (formIsTouched && (formSetting.mode === "new" || formSetting.mode === 'edit')) {
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
    if (formSetting.mode === "readOnly" || formSetting.mode == "edit") {
      // fetch data
      if (formSetting.id) {
        fetchServer.getListItemById(formSetting.id)
        .then(result => {
          console.log(result);
          const _formData = convertSpDataToFormData(result);
          setFormData(_formData);
          // can check for item status if rehjected and viewer === creatoremail, for a potential "edit mode"
        })
        .catch(error => {
          if (error instanceof Error) {
            notify({show: true, msg: "Error Getting Item, Try Again", errorObj: error, isError: true, type: "error"});
          }
        });
      }
    }
  }, [formSetting, email]);

  // // effect for getting approver 1
  // React.useEffect(() => {

  //   if (formData.office && (formSetting.mode === "new" || formSetting.mode === 'edit')) {
  //     fetchServer.getApproverByOffice(formData.office)
  //       .then(result => {
  //         setFormData(prevValue => ({
  //           ...prevValue,
  //           approver1: result.email
  //         }));
  //       })
  //       .catch(error => {
  //         if (error instanceof Error) {
  //           notify({
  //             show: true, 
  //             msg: error.message ? error.message : "Error Getting Approver, Try Again", 
  //             errorObj: error, 
  //             isError: true, 
  //             type: "error"
  //           });
  //         }
  //       });
  //   }

  // }, [formData.office]);

  // handler for all sub comp, strict TS but i think i know what i'm doing lol
  // memoised cause will be passed down 
  const handleInputChange = React.useCallback(
    <T extends keysOfFullFormData, A>( field:T, value: A) => {
      // set touched
      setFormIsTouched(true);
      // some light editing
      if (field.toLowerCase().includes("name")) {
        if (typeof value === "string") {
          setFormData(prevValue => {
            return {
              ...prevValue,
              // mutate value to remove spaces
              [field]: value.trim()
            };
          });
          return;
        }
      }

      if (field.toLowerCase().includes("sbu")) {
        // mutate office value if changing sbu, this way validation triggers
        if (typeof value === "string") {
          setFormData(prevValue => {
            return {
              ...prevValue,
              [field]: value,
              office: ""
            };
          });
          return;
        }
      }

      // testing, fetch approver and update at same time, save on re render?
      if (field.toLowerCase().includes("office") && typeof value === "string" && value !== "") {
        // var
        let _approver = "";

        fetchServer.getApproverByOffice(value)
          .then(result => {
            _approver = result.email;
          })
          .catch(error => {
            if (error instanceof Error) {
              notify({
                show: true, 
                msg: error.message ? error.message : "Error Getting Approver, Try Again", 
                errorObj: error, 
                isError: true, 
                type: "error"
              });
            }
          })
          .finally(() => {
            setFormData(prevValue => {
              return {
                ...prevValue,
                office: value,
                approver1: _approver
              };
            });
          });

        return;
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
  
  // handle submit
  const handleUpdate = (): void => {
    // loading
    setFormIsLoading(true);
    // request
    fetchServer.updateRequest(formData, email)
    .then(() => {
      notify({show: true, msg: "Request Updated", errorObj: null});
      // reset form, un comment when not testing
      // set mode to new?
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

  // handle Approval
  // const handleApproval = (param: "Approved"| "Rejected"): void => {

  //   if (approval) {
  //     // next Approver approved, trying to reject or pend
  //     if (param !== "Approved" && hasNextUserApproved(formData, approval)) {
  //       notify({show: true, isError: true, msg:"This item has been approved by next Approver"});
  //       return;
  //     }
  //     // prev approver hasnt approved, current shouldnt be able to do anything
  //     if (!hasPrevUserApproved(formData, approval)) {
  //       notify({show: true, isError: true, msg:"This item has not been approved by previous Approver"});
  //       return;
  //     }

  //     setFormIsLoading(true);
  //     // update
  //     fetchServer.approveRejectEntry(formSetting.id as number, approval, param)
  //       .then(() => {
  //         notify({show: true, msg: `Request ${param}`, errorObj: null});
  //         // set to readonly to force rerender and get new data from sp
  //         setFormSetting(prevValue => ({...prevValue, mode:"readOnly"}));
  //       })
  //       .catch(err => {console.log(err);})
  //       .finally(() => {
  //         setFormIsLoading(false);
  //       });
  //   }
  // };

  // handle load query
  const handleSetQuery = (): void => {

    if (addressQuery) {
      const [id, other] = addressQuery;
      setFormSetting({
        id: Number(id),
        mode: "readOnly"
      });
      // change url to remove query
      window.history.replaceState(null, "", window.location.href.split("?")[0]);
    }
  };

  if (addressQuery && formSetting.mode === "new") {
    console.log("address quer");

    handleSetQuery();
    
    // setDialog({
    //   show: true,
    //   msg: "Load query data?",
    //   onAccept: handleSetQuery,
    //   onClose: () => {
    //     // change url to remove query
    //     window.history.replaceState(null, "", window.location.href.split("?")[0]);
    //   }
    // });
  }
 

  return(
    <Stack tokens={{childrenGap : 8}}>
      <StackItem grow>
        <Stack tokens={{childrenGap : 8}} className={classes.body}>
          <StackItem grow>
            <Stack horizontal={isMediumScreen ? undefined : true} horizontalAlign={isMediumScreen ? undefined : "space-between"}>
              <StackItem align="start">
                <FontIcon iconName={"TextDocument"} className={classes.iconColor}/>
                <Text variant={"mediumPlus"}> Form </Text>
              </StackItem>  
              <StackItem align={"end"}>
                <Text variant={"medium"}> First Approver: { formData.approver1 ? formData.approver1 : "" } </Text>
              </StackItem>
            </Stack>
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
              <StackItem className={ isMediumScreen ? undefined : classes.seperatorHeight}>
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
              variant={"primary"}
              disabled={!formIsValid || formIsLoading}
              loading={formIsLoading}
              loadingMsg={"Creating"}
              text={"Submit"}
              onClick={() => {
                setDialog({
                  msg: "Confirm Creation",
                  buttonText: "Create",
                  onAccept: handleSubmit,
                  show: true
                });
              }}
            />
          }
          { 
            formSetting.mode === "edit" &&
            <LoadingButton
              variant={"primary"}
              disabled={!formIsValid || formIsLoading}
              loading={formIsLoading}
              loadingMsg={"Updating"}
              text={"Update"}
              onClick={() => {
                setDialog({
                  msg: "Confirm Update",
                  buttonText: "Update",
                  onAccept: handleUpdate,
                  show: true
                });
              }}
            />
          }
          {/* {
            formSetting.mode === "approval" &&
            <>
              <Label>
                Current status : {approval === "approval1" && formData.approver1Status}
                {approval === "approval2" && formData.approver2Status}
                {approval === "approval3" && formData.approver3Status}
                {approval === "approval4" && formData.approver4Status}
              </Label>
              <LoadingButton 
                variant={"primary"}
                loading={formIsLoading}
                loadingMsg={"Updating"}
                text="Approve" 
                onClick={() => {
                  setDialog({
                    msg: "Confirm Status Update",
                    buttonText: "Approve",
                    onAccept: () => handleApproval("Approved"),
                    show: true
                  });
                }}
              />
              <LoadingButton 
                variant={"secondary"}
                loading={formIsLoading}
                loadingMsg={"Updating"}
                text="Reject" 
                onClick={() => {
                  setDialog({
                    msg: "Confirm Status Update",
                    buttonText: "Approve",
                    onAccept: () => handleApproval("Rejected"),
                    show: true
                  });
                }}
              />
            </>
          } */}
        </Stack>
      </StackItem>
      {
        (formSetting.mode == "edit" || formSetting.mode == "readOnly" && formData.id) &&
        <StackItem grow align="stretch">
          <ApproversDisplay data={formData}/>
        </StackItem>
      }
      {
        (formSetting.mode == "edit" || formSetting.mode == "readOnly" && formData.id) &&
        <StackItem grow align="stretch">
          <ItemQueryActivity data={formData}/>
        </StackItem>
      }
    </Stack>
  );
};