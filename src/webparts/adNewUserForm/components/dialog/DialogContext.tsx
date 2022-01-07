import * as React from "react";
// ui fabric
import {
  PrimaryButton,
  DefaultButton, DialogType,
  Dialog,
  DialogFooter
} from "office-ui-fabric-react";
// custom util
import createContext from "../utils/createContext";


interface IDialogProps {
  children: React.ReactNode;
}

export interface IDialogState {
  show: boolean;
  msg: string;
  onAccept?(): void;
  onClose?(): void;
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
          <DialogFooter>
            <PrimaryButton onClick={handleAccept} text="Load" />
            <DefaultButton onClick={handleDismiss} text="Close" />
          </DialogFooter>
        </Dialog>
      }
      {children}
    </DialogProvider>
  );
};

export { useDialog }
