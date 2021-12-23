// layout pane splits form into 2 pages
import * as React from "react";
// ui fabric
import { 
  PrimaryButton,
  Stack, StackItem 
} from "office-ui-fabric-react";

interface IComponentProps {
  form1: React.ReactNode;
  form2: React.ReactNode;
}

type viewState = "form1" | "form2";

export default ({ form1, form2 }:IComponentProps): JSX.Element => {

  // pane view state
  const [viewState, setViewState] = React.useState<viewState>("form1");
  
  return(
    <Stack tokens={{childrenGap : 8}}>
      <Stack>
        {
          viewState === "form1" &&
          form1
        }
        {
          viewState === "form2" &&
          form2
        }
      </Stack>
      <Stack horizontal horizontalAlign="space-around">
        <PrimaryButton 
          text={"Prev"} 
          onClick={() => setViewState("form1")}
          disabled={viewState === "form1"}
        />
        <PrimaryButton 
          text={"Next"} 
          onClick={() => setViewState("form2")}
          disabled={viewState === "form2"}
        />
      </Stack>
    </Stack>
  );
};