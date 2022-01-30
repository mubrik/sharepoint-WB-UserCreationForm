import * as React from "react";
// ui
import { 
  TextField, Dropdown,
  IDropdownProps
} from "office-ui-fabric-react";


interface IComponentProps extends IDropdownProps {

}

/**
 * Dropdown when enabled
 * Returns a  readonly textfield when disabled
 * @returns JSX.Element
 */
const ReadOnlyDropdown = ({disabled, selectedKey, label, ...rest}: IComponentProps): JSX.Element => {

  if (disabled) {
    return (
      <TextField
        readOnly={true}
        value={selectedKey ? selectedKey.toString() : ""}
        label={label}
        style={{
          cursor: "not-allowed"
        }}
      />
    );
  }

  return(
    <Dropdown
      selectedKey={selectedKey}
      label={label}
      {...rest}
    />
  );
};

// memo?
const arePropsEqual = (prevProps: IComponentProps, nextProps: IComponentProps) => {

  // extract props to cause re render
  const {disabled: prevDisabled, selectedKey: prevValue, options: prevOptions} = prevProps;
  const {disabled: nextDisabled, selectedKey: nextValue, options: nextOptions} = nextProps;

  // compare
  if (prevDisabled !== nextDisabled) {
    return false;
  }

  if (prevValue !== nextValue) {
    return false;
  }

  if (prevOptions !== nextOptions) {
    return false;
  }

  // finally, not comparing function
  return true;
};

export default React.memo(ReadOnlyDropdown, arePropsEqual);