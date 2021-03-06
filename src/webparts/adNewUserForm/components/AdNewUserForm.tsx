import * as React from 'react';
// office fabric
import { Stack } from 'office-ui-fabric-react';
// types
import type { WebPartContext } from '@microsoft/sp-webpart-base';
import { mainPageView, IWebPartData, formSettings } from '../types/custom';
// custom component
import Navbar from "./nav/Navbar";
import NotificationContext from "./notification/NotificationBarContext";
import UserContext from "./userContext/UserContext";
import AboutPage from "./about/AboutPage";
import MainFormPage from "./forms/MainFormPage";
import ApprovalPage from './approval/ApprovalPage';
import SearchPage from './search/SearchPage';
import DialogContext from './dialog/DialogContext';
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

/**
* @description main component rendered on the webpart root dom
* @author Mubrik
*/
export default ({ context, webpartWidth}: IPageProps): JSX.Element => {
  // state for the component being viewed except nav
  const [viewPage, setViewPage] = React.useState<mainPageView>("new");
  // state for form mode
  const [formSetting, setFormSetting] = React.useState<formSettings>({mode: "new"});

  // webpart width
  React.useEffect(() => {
    try {
      const bench = document.getElementById("workbenchPageContent");
      const canvas = document.getElementsByClassName("CanvasZone--controlSelected")[0] as HTMLElement;
      if (bench) {
        bench.style.maxWidth = "1920px";
      }
      
      if (canvas) {
        canvas.style.maxWidth = "1920px";
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
    };
  }, [context, webpartWidth]);

  return(
    <ErrorBoundary>
    <NotificationContext>
    <DialogContext>
    <UserContext>
    <WebpartContext.Provider value={webpartData}>
      <Stack tokens={{childrenGap : 8}}>
        <Navbar 
          pageState={viewPage} 
          setPageState={setViewPage}
          formSetting={formSetting}
          setFormSetting={setFormSetting}
        />
        {
          viewPage === "new" &&
          <MainFormPage 
            formSetting={formSetting}
            setFormSetting={setFormSetting}
          />
        }
        {
          viewPage === "search" &&
          <SearchPage 
            setMainPageState={setViewPage}
            setFormSetting={setFormSetting}
          />
        }
        {
          viewPage === "Approver1" &&
          <ApprovalPage
            mainPageViewState={viewPage} 
            setMainPageState={setViewPage}
            setFormSetting={setFormSetting}
          />
        }
        {
          viewPage === "Approver2" &&
          <ApprovalPage
            mainPageViewState={viewPage} 
            setMainPageState={setViewPage}
            setFormSetting={setFormSetting}
          />
        }
        {
          viewPage === "Approver3" &&
          <ApprovalPage
            mainPageViewState={viewPage} 
            setMainPageState={setViewPage}
            setFormSetting={setFormSetting}
          />
        }
        {
          viewPage === "Approver4" &&
          <ApprovalPage
            mainPageViewState={viewPage} 
            setMainPageState={setViewPage}
            setFormSetting={setFormSetting}
          />
        }
        {
          viewPage === "about" &&
          <AboutPage/>
        }
      </Stack>
    </WebpartContext.Provider>
    </UserContext>
    </DialogContext>
    </NotificationContext>
    </ErrorBoundary>
  );
};
