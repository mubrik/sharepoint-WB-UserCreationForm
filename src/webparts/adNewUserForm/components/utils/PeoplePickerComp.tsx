// for selecting people with options
// fluent got the same component but 3x more stressful to set up
import * as React from "react";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
// context, needed for comp to work
import { WebpartContext } from "../AdNewUserForm";
// type
import { IFullFormData } from "../../types/custom";
import { IPersonaProps } from "office-ui-fabric-react";
// query
import { useMediaQuery } from "react-responsive";

interface IComponentProps {
  formData: IFullFormData;
  setFormData: <T extends keyof IFullFormData, A>(key: T, value: A) => void;
  disabled: boolean | undefined;
}

export default ({ formData, setFormData, disabled }:IComponentProps): JSX.Element => {

  const webpartData = React.useContext(WebpartContext);
  // responsive
  const medium = useMediaQuery({ maxWidth: 940 });

  const handleChange = (people: IPersonaProps[]) => {
    // if empty, none
    if (people.length === 0) {
      setFormData("supervisorEmail", "");
    } else {
      const person = people[0];
      setFormData("supervisorEmail", person.secondaryText);
    }
  };

  return(
    <PeoplePicker
      disabled={disabled ? disabled : false}
      required={true}
      context={webpartData?.context as any} // casting as any cause the types dont match but it works
      defaultSelectedUsers={formData.supervisorEmail === "" ? undefined : [formData.supervisorEmail]}
      titleText={"Supervisor"}
      personSelectionLimit={1}
      onChange={handleChange}
      showHiddenInUI={false}
      principalTypes={[PrincipalType.User]}
      resolveDelay={1000}
    />
  );
};