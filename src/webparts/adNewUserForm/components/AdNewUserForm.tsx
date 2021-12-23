import * as React from 'react';
// office fabric
import { Stack } from 'office-ui-fabric-react';
// types
import type { WebPartContext } from '@microsoft/sp-webpart-base';
import { mainPageView, IWebPartData } from '../types/custom';
// custom component
import Navbar from "./nav/Navbar";
import NotificationContext from "./notification/NotificationBarContext";
import UserContext from "./userContext/UserContext";
import AboutPage from "./about/AboutPage";
import MainFormPage from "./forms/MainFormPage";
import ErrorBoundary from "./error/ErrorBoundary";

// types
interface IPageProps {
  description: string;
  context: WebPartContext;
  webpartWidth: number;
}

// react context for exposng webpart context to sub component
export const WebpartContext = React.createContext<IWebPartData>({
  webpartWidth:720
});

export default ({ context, webpartWidth}: IPageProps): JSX.Element => {

  const [viewPage, setViewPage] = React.useState<mainPageView>("new");

  // webpart width
  React.useEffect(() => {
    try {
      const bench = document.getElementById("workbenchPageContent")
      if (bench) {
        bench.style.maxWidth = "1920px";
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  // memo for webpart data
  const webpartData: IWebPartData = React.useMemo(() => {
    return {
      context,
      webpartWidth
    }
  }, [context, webpartWidth])

  return(
    <ErrorBoundary>
    <NotificationContext>
    <UserContext>
    <WebpartContext.Provider value={webpartData}>
      <Stack tokens={{childrenGap : 8}}>
        <Navbar pageState={viewPage} setPageState={setViewPage}/>
        {
          viewPage === "new" &&
          <MainFormPage />
        }
        {
          viewPage === "about" &&
          <AboutPage/>
        }
      </Stack>
    </WebpartContext.Provider>
    </UserContext>
    </NotificationContext>
    </ErrorBoundary>
  );
};
