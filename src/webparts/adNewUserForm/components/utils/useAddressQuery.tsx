// use hook to get web address query
import * as React from "react";
// escape
import {escape} from "@microsoft/sp-lodash-subset";
// type
interface IQueryObj {
  id: string;
  approver: string;
}

export default () => {

  const [query, setQuery] = React.useState<undefined|[string, string]>(undefined);

  React.useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params  = Object.fromEntries(urlSearchParams.entries());
    
    const _id = params["id"] ? params["id"] : undefined;
    const _approver = params["approver"] ? params["approver"] : undefined;

    if (_id) {
      setQuery(
        [escape(_id), escape(_approver)]
      );
    }

  }, []);

  return query;
};