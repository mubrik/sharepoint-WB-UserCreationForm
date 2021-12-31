// context provider that fetches user, exposes a hook for other comps to get userdata
import * as React from "react";
// server
import fetchServer from "../../controller/server";
// types
import { IUserData } from "../../types/custom";
// notification hook
import { useNotification } from "../notification/NotificationBarContext";
// custom context creator
import createContext from "../utils/createContext";

// context
const [useUserData, UserProvider] = createContext<IUserData>();

interface IComponentProps {
  children: React.ReactNode;
}

export default ({children}: IComponentProps): JSX.Element => {

  const [userData, setUserData] = React.useState<IUserData>({});

  // notify
  const notify = useNotification();

  // get user data
  React.useEffect(() => {
    // server fetch
    fetchServer.getUser()
    .then(result => {
      setUserData({
        ...result
      });
    })
    .catch(error => {
      if (error instanceof Error && "message" in error) {
        notify({show: true, isError: true, msg: error.message, errorObj: error});
      }
      notify({show: true, isError: true, msg:"Error getting user, Network?", errorObj: error});
    });
  }, []);

  return(
    <UserProvider value={userData}>
      {children}
    </UserProvider>
  );
};

export { useUserData };