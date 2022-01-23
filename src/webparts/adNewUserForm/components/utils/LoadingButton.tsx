// custom loading button
import * as React from "react";
// button
import { 
  PrimaryButton, IButtonProps,
  Stack, ProgressIndicator,
  DefaultButton
} from "office-ui-fabric-react";


interface IComponentProps extends IButtonProps {
  loading?: boolean;
  loadingMsg?: string;
  variant: "primary" | "secondary";
}

export default ({loading, loadingMsg, variant, ...rest}: IComponentProps): JSX.Element => {

  return(
    <Stack grow tokens={{ childrenGap : 1 }}>
      {
        loading &&
        <ProgressIndicator label={loadingMsg}/>
      }
      {
        variant === "primary" ?
          <PrimaryButton 
            {...rest}
          /> :
          <DefaultButton 
            {...rest}
          />
      }
    </Stack>
  );
};