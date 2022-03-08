// context provider that fetches user, exposes a hook for other comps to get userdata
import * as React from "react";
// server
import fetchServer from "../../controller/server";
// types
// import { IUserData } from "../../types/custom";
import { IUserApproverData } from "../../types/custom";
// notification hook
import { useNotification } from "../notification/NotificationBarContext";
// custom context creator
import createContext from "../utils/createContext";

/**
* @description Base user data. Must have id, email, displayname, manager and jobtitle
*/
export interface IUserData {
  id?: number;
  email?: string;
  displayName?: string;
  manager?: string;
  jobTitle?: string;
}

// custom user data extended for specific webpart use, can be removed or retooled for different webpart
interface IUserDataWithIsApproverData extends IUserData, IUserApproverData {

}

interface IComponentProps {
  children?: React.ReactNode;
}

// context
const [useUserData, UserProvider] = createContext<IUserDataWithIsApproverData>("UserDataContext");

/**
* @description UserData Context, default exports a context to be mounted and a hook to fetch user data of type { IUserData/CustomType }
* @author Mubrik
* @returns JSX.Element - The UserData Context Component
* @requires useNotification - Notification dispatch object to notify for errors
* @param React.ReactNode - children?
*/
export default ({children}: IComponentProps): JSX.Element => {

  const [userData, setUserData] = React.useState<IUserDataWithIsApproverData>({} as IUserDataWithIsApproverData);

  // notify
  const notify = useNotification();

  // get user data
  React.useEffect(() => {
    // server fetch
    if (userData.id === undefined) {
      fetchServer.getUser()
      .then(result => {
        setUserData({
          ...result
        });
        return result.email;
      })
      .catch(error => {
        if (error instanceof Error && "message" in error) {
          notify({show: true, isError: true, msg: error.message, errorObj: error});
        }
        notify({show: true, isError: true, msg:"Error getting user, Try refreshing", errorObj: error});
      });
    }
  }, []);

  return(
    <UserProvider value={userData}>
      {children}
    </UserProvider>
  );
};

export { useUserData };