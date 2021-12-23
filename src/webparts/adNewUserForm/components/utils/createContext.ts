import * as React from "react";
/**
 * A helper to create a Context and Provider with no upfront default value, and
 * without having to check for undefined all the time.
 */
 function createContext<T extends unknown | null>(): readonly [() => T, React.Provider<T|undefined>] {
  // create a context of type given or undefined
  const ctx = React.createContext<T | undefined>(undefined);
  // basicaly a use hook with error checking so TS infers type or throws error if no value
  function useCtx(): T {
    const c = React.useContext(ctx);
    if (c === undefined)
      throw new Error("useCtx must be inside a Provider with a value");
    return c;
  }
  return [useCtx, ctx.Provider] as const; // 'as const' makes TypeScript infer a tuple
}

export default createContext;