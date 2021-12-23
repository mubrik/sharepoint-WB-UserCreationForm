import * as React from "react";
// office
import { TextField } from "office-ui-fabric-react";
import type { ITextFieldProps
} from "office-ui-fabric-react";
// query
import { useMediaQuery } from "react-responsive";

const ResponsiveTextField = ({prefix, ...rest }: ITextFieldProps): JSX.Element  => {

  // responsive
  const medium = useMediaQuery({ maxWidth: 940 });

  return (
    <TextField
      prefix={undefined} // leave like this for now
      label={prefix}
      {...rest}
    />
  );
};

export default ResponsiveTextField;