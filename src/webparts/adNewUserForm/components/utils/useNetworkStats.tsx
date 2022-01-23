import * as React from "react";

// interface CustomNetwork extends NetworkInformation {
//   rtt: number;
// }

// /**
//  * Playing around to create a network speed detector
//  */
// export default (): undefined| boolean => {
//   const [networkState, setNetworkState] = React.useState<boolean | undefined>();

//   React.useEffect(() => {
//     const _navigator = navigator.connection as CustomNetwork || undefined;

//     if (_navigator) {
//       setNetworkState(_navigator.rtt > 200); 
//     }
//   }, []);

//   return networkState;
// }