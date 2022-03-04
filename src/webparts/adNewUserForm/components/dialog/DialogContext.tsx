import * as React from "react";
// ui fabric
import {
  PrimaryButton,
  DefaultButton, DialogType,
  Dialog,
  DialogFooter, TextField
} from "office-ui-fabric-react";
// custom util
import createContext from "../utils/createContext";


interface IDialogProps {
  children: React.ReactNode;
}

export interface IDialogState {
  show: boolean;
  msg: string;
  buttonText?: string;
  type?: "approve" | "normal";
  onAccept?(): void;
  onClose?(): void;
  onApprove?(param: string): void;
}

const initialState = {
  show: false,
  msg: "",
};

const [useDialog, DialogProvider] =
createContext<React.Dispatch<React.SetStateAction<IDialogState>>>();

export default ({ children }:IDialogProps) :JSX.Element => {
  // state
  const [dialogState, setDialogState] = React.useState<IDialogState>(initialState);
  const [comment, setComment] = React.useState("");

  // handler
  const handleDismiss = (): void => {
    // run callback if available
    const { onClose } = dialogState;

    setDialogState({
      show: false,
      msg: ""
    });

    if (onClose) {
      onClose();
    }
  };

  const handleAccept = (): void => {
    // run callback if available
    const { onAccept } = dialogState;
    // dismiss
    setDialogState({
      show: false,
      msg: ""
    });

    if (onAccept) {
      onAccept();
    }
  };

  const handleApproval = (): void => {
    const { onApprove } = dialogState;

    if (onApprove) {
      onApprove(comment);
    }

    // dismiss
    setDialogState({
      show: false,
      msg: "",
      type: "normal"
    });

    // clear comment
    setComment("");
  };
 
  return(
    <DialogProvider value={setDialogState}>
      {
        dialogState.show &&
        <Dialog
          hidden={!dialogState.show}
          onDismiss={handleDismiss}
          dialogContentProps={{
            type: DialogType.normal,
            title: dialogState.msg
          }}
        >
          {
            dialogState.type === "approve" &&
            <>
              <TextField 
                multiline
                label={"Comments?"}
                value={comment}
                onChange={(_, newValue) => setComment(newValue as string)}
              />
            </>
          }
          <DialogFooter>
            <PrimaryButton 
              onClick={ dialogState.type === "approve" ? handleApproval : handleAccept} 
              text={dialogState.buttonText ? dialogState.buttonText : "Load"}
            />
            <DefaultButton onClick={handleDismiss} text="Cancel" />
          </DialogFooter>
        </Dialog>
      }
      {children}
    </DialogProvider>
  );
};

export { useDialog };