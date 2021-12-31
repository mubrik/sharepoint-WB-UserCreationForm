// custom loading button
import * as React from "react";
// button
import { 
  PrimaryButton, IButtonProps,
  Stack, ProgressIndicator
} from "office-ui-fabric-react";


interface IComponentProps extends IButtonProps {
  loading?: boolean;
  loadingMsg?: string;
}

export default ({loading, loadingMsg, ...rest}: IComponentProps): JSX.Element => {

  return(
    <Stack grow tokens={{ childrenGap : 1 }}>
      {
        loading &&
        <ProgressIndicator label={loadingMsg}/>
      }
      <PrimaryButton 
        {...rest}
      />
    </Stack>
  );
};