/**
* wip, functions to be used to log server instance activities
* store each activity as json? or store as a list item?
*/
import { sp } from "@pnp/sp/presets/core";
import "@pnp/sp/webs";

// json implementation
/**
* @description data shape after being parsed from SP
*/
interface IUserLogData {
  [index: number]: INewLogData;
}

/**
* @description object shape for new logs to be added
*/
interface INewLogData {
  listName: string;
  userId: number;
  message: string;
  actionType: "create" | "read" | "update" | "delete";
}

/**
* @description object shape for logs when fetched from SP and formatted to include list item id
*/
interface ILogDataWithId {
  id: number;
  listName: string;
  userId: number;
  message: string;
  actionType: "create" | "read" | "update" | "delete";
}

/**
* @description checks if a log has been created for a specific user
* @author Mubrik
* @returns boolean
*/
export const userLogExists = async (email: string): Promise<boolean> => {

  try {
    // get list
    const spLoggingList = sp.web.lists.getByTitle("logging-test");
  
    // check list for user
    const result = await spLoggingList.items.select("email").top(1).filter(`email eq '` + email + "'").get();

    console.log(result);

    // if list len above 0, user exist
    if (result.length > 0) {
      return true;
    }

    return false;

  } catch (err) {
    console.log(err);
    return false
  }

};


/**
* @description reads the user log data from SP, should alwayts run after a check to avaoid error throw
* @author Mubrik
* @returns [IUserLogData, id: number] | throw an error
*/
export const getUserLogData = async (email: string): Promise<[IUserLogData, number]> => {

  try {
    // get list
    const spLoggingList = sp.web.lists.getByTitle("logging-test");
  
    // check list for user
    const result = await spLoggingList.items.select("data", "ID").filter(`email eq '` + email + "'").get();

    // if list len above 0, user exist
    if (result.length > 0) {
      const spData = result[0];
      console.log(spData);

      const logData: IUserLogData = JSON.parse(spData["data"] as string);

      console.log(logData, spData["ID"]);
      return [logData, spData["ID"] as number];
    }

    throw new Error("Error, no log data for that user created");

  } catch (err) {
    console.log(err);
    throw new Error("Error fetching user log data");
  }

};

/**
* @description creates a log entry for a new user
* @author Mubrik
* @returns boolean
*/
export const createUserLog = async (email: string, log: INewLogData): Promise<boolean> => {

  try {
    // get list
    const spLoggingList = sp.web.lists.getByTitle("logging-test");

    const currTime = Date.now();
  
    // check list for user
    const result = await spLoggingList.items.add({
      user: email,
      email: email,
      data: JSON.stringify({
        [currTime]: log
      })
    });

    console.log(result);

    return true;

  } catch (err) {
    console.log(err);
    return false
  }

};


/**
* @description updates a log entry for an existing user
* @author Mubrik
* @returns boolean
*/
export const updateUserLog = async (email: string, log: INewLogData): Promise<boolean> => {

  try {
    // get log
    const [currentLog, _id] = await getUserLogData(email);

    const currTime = Date.now();

    const updatedLog = {
      ...currentLog,
      [currTime]: log
    }

    // update item
    // get list
    const spLoggingList = sp.web.lists.getByTitle("logging-test");

    const result = await spLoggingList.items.getById(_id).update({
      data: JSON.stringify(updatedLog)
    });

    console.log(result);

    return true  

  } catch (err) {
    console.log(err);
    return false
  }

};