import * as React from "react";
// ui fabric.. not sure why this treeshaking is 183kb?? * 4 of react, sheesh
import {
  MessageBar,
  MessageBarType, Stack
} from "office-ui-fabric-react";
// custom util
import createContext from "../utils/createContext";

type NotificationType = "error" | "info" | "success" | "warning";

interface INotificationBarProps {
  children?: React.ReactNode;
}

export interface INotificationBarState {
  /** @description - show or hide notifiation*/ show: boolean;
  msg: string;
  isError?: boolean;
  errorObj?: Error|null;
  type?: NotificationType;
  logError?: boolean;
}

const initialState = {
  show: false,
  msg: "",
  isError: false,
  errorObj: null,
  logError: false
};

const [useNotification, NotificationProvider] =
  createContext<React.Dispatch<React.SetStateAction<INotificationBarState>>>("NotificationBarContext");

/**
* @description Notification Context, default exports a context to be mounted and a hook to dispatch an object of type {INotificationBarState} to display a notification
* @author Mubrik
* @returns JSX.Element - The Notification Context Component
* @param React.ReactNode - children?
*/
export default ({children}:INotificationBarProps) :JSX.Element => {
  // state
  const [notifyState, setNotifyState] = React.useState<INotificationBarState>(initialState);

  // effect to log error to a server or db or something
  React.useEffect(() => {
    if (notifyState.logError) {
      console.log("error logged", notifyState.errorObj);
    }
  }, [notifyState.isError]);

  return(
    <NotificationProvider value={setNotifyState}>
      {
        notifyState.show &&
        <Stack>
          <MessageBar
            messageBarType={
              notifyState.isError ? MessageBarType.error 
              : notifyState.type === "info" ? MessageBarType.info 
              : notifyState.type === "warning" ? MessageBarType.warning 
              : MessageBarType.success
            }
            isMultiline={false}
            onDismiss={() => setNotifyState(initialState)}
            dismissButtonAriaLabel="Close"
          >
            {notifyState.msg}
          </MessageBar>
        </Stack>
      }
      {children}
    </NotificationProvider>
  );
};

export { useNotification };
