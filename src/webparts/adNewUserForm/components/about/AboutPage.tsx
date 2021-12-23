// jobless i know, urgh
import * as React from "react";
// ui
import {
  Stack, Rating,
  RatingSize, TextField,
  PrimaryButton, Label
} from "office-ui-fabric-react";
// server
import fetchServer from "../../controller/server";
// hooks
import { useUserData } from "../userContext/UserContext";
import { useNotification } from "../notification/NotificationBarContext";

const AboutPage = ():JSX.Element => {
  // states
  const [currentRating, setCurrentRating] = React.useState(1);
  const [textValue, setTextValue] = React.useState("");
  // context data
  const { email } = useUserData();
  // notify
  const notify = useNotification();

  // handlers
  const handleSubmitClick = (): void => {
    if (email) {
      fetchServer.sendFeedback(email, currentRating, textValue)
        .then(_ => {
          notify({show: true, isError: false, msg: "Thanks for the feedback!"});
        })
        .catch(error => {
          notify({show: true, isError: true, msg: "Error!", errorObj: error});
        });
    }
  };

  return (
    <Stack tokens={{childrenGap: 8}} horizontalAlign={"center"}>
      <Label>
        Webpart by IT applications, Rate and leave feedback!
      </Label>
      <Rating
        max={5}
        rating={currentRating}
        onChange={(_, rating) => setCurrentRating(rating as number)}
        size={RatingSize.Large}
        ariaLabel="Large stars"
        ariaLabelFormat="{0} of {1} stars"
      />
      <TextField
        multiline
        value={textValue}
        onChange={(_, value) => setTextValue(value as string)}
      />
      <PrimaryButton text={"Submit"} onClick={handleSubmitClick}/>
    </Stack>
  );
};

export default AboutPage;
