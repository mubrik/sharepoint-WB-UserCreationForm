// basic textfield component that renders a prefix at smaller width and label at larger 
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

  // testing
  console.log("render" + prefix + "text field");

  return (
    <TextField
      prefix={undefined} // leave like this for now
      label={prefix}
      {...rest}
    />
  );
};

// memo?
const arePropsEqual = (prevProps: ITextFieldProps, nextProps: ITextFieldProps) => {

  // extract props to cause re render
  const {readOnly: prevReadOnly, value: prevValue} = prevProps;
  const {readOnly: nextReadOnly, value: nextValue} = nextProps;

  // compare
  if (prevReadOnly !== nextReadOnly) {
    return false;
  }

  if (prevValue !== nextValue) {
    return false;
  }

  // finally, not comparing function
  return true;
};

export default React.memo(ResponsiveTextField, arePropsEqual);