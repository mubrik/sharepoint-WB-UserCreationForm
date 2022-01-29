import { IList, sp } from "@pnp/sp/presets/core";
import "@pnp/sp/webs";
import "@pnp/sp/fields";
import "@pnp/sp/site-users";
import "@pnp/sp/profiles";
import "@pnp/sp/site-groups";
import "@pnp/sp/site-groups/web";
import "@pnp/sp/sputilities";
import { IEmailProperties } from "@pnp/sp/sputilities";
// types
import { 
  IServer, IUserData,
  IFullFormData,
  ISharepointFullFormData,
  mainPageView, ISharepointApprovalData,
  approvalStatus, IUserApproverData,
  keysOfSharepointData, profileDetail,
  ISharepointOfficeApproverData,
  ISharepointApprovers
} from "../types/custom";

type approvalIndex = "Approver1" | "Approver2"  |"Approver3" | "Approver4";


/* handler for CRUD REST requests */
class Server implements IServer{

  public fetch = sp;
  private adCreateList: IList;

  public constructor () {
    this.adCreateList = this.fetch.web.lists.getByTitle("HR-AD-Creation");
  }

  public testing = async (): Promise<any> => {
    const arrList = await this.fetch.profiles.clientPeoplePickerSearchUser({
      AllowEmailAddresses: true,
      AllowMultipleEntities: false,
      MaximumEntitySuggestions: 1,
      QueryString: "mubarak.yahaya@dangote.com"
    });

    const _user = arrList[0];

    return new Promise((resolve, reject) => {
      this.fetch.profiles.getPropertiesFor(_user.Key)
      .then(result => {
        console.log(result);
        resolve(true);
      })
      .catch(error => reject(error));
    });
  }

  public getUser = async ():Promise<IUserData> => {

    try {
      const userDetails = 
        await Promise.allSettled([
          this.fetch.profiles.myProperties.get(),
          this.fetch.web.currentUser(),
        ]);
      // error check
      userDetails.forEach((promise) => {
          // if promisee not fulfiled throw error
          if (promise.status === "rejected") {
            throw new Error("Error getting user data, refresh or contact IT");
          }
        });
      // destructure
      // const [{value: profileData}, {value: userData}, {value: groupData}] = 
      //   userDetails;
      // somehow, typescript doesnt figure out the promise is fufilled after error check
      // typescript issue 42012 on github, i'll keep this here for now in case it gets updated, but imlement differently

      const [_profile, _user,] = userDetails;

      const profile = _profile.status === "fulfilled" ? _profile.value : null;
      const user = _user.status === "fulfilled" ? _user.value : null;
      
      // vars
      const managersArr: string[] = profile.ExtendedManagers;
      let manager = "";

      // for fse
      if (profile.Title === "Field Support Engineer") {
        // 2nd item to skip first
        const managerLogName = managersArr[managersArr.length - 2];
        // get managers profile
        const managerProfile = await this.fetch.profiles.getPropertiesFor(managerLogName);
        // store email
        manager = managerProfile.Email;
      } else {
        const managerLogName = managersArr[managersArr.length - 1];
        // get managers profile
        const managerProfile = await this.fetch.profiles.getPropertiesFor(managerLogName);
        // store email
        manager = managerProfile.Email;
      }

      // approver status
      // vars
      // const isUserApproverOne = await this.getApproverOne(profile.Email);
      // approver data
      const _userRoles = await this.getUserRoles(profile.Email as string);


      // return
      return {
        id: user ? user.Id : 0,
        email: profile.Email as string,
        displayName: profile.DisplayName,
        manager: manager,
        jobTitle: profile.Title,
        ..._userRoles
      };
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("error");
    }

  }

  public getUserDetailsByEmail = async (email: string): Promise<[boolean, profileDetail| undefined, Error|undefined]> => {

    const arrList = await this.fetch.profiles.clientPeoplePickerSearchUser({
      AllowEmailAddresses: true,
      AllowMultipleEntities: false,
      MaximumEntitySuggestions: 1,
      QueryString: email
    });

    const _user = arrList[0];

    return new Promise((resolve, reject) => {
      // vars
      let error: Error | undefined;
      if(_user) {
        this.fetch.profiles.getPropertiesFor(_user.Key)
        .then(result => {
          // remove query? from picture url
          const _url = result.PictureUrl as string;
          const newUrl = _url.split("?")[0];
          resolve([
            true,
            {
              name: result.DisplayName as string,
              imageUrl: newUrl
            },
            error
          ]);
        })
        .catch(err => resolve([false, undefined, err]));
      } else {
        resolve([false, undefined, new Error("Error getting user")]);
      }
    });
  }

  public getListItemById = async (id: number): Promise<ISharepointFullFormData> => {
    
    return new Promise((resolve, reject) => {
      this.adCreateList.items.getById(id).get()
      .then(result => resolve(result))
      .catch(error => reject(error));
    });
  }

  public getListFilterBySbu = async (sbu: string): Promise<ISharepointFullFormData[]> => {
    
    return new Promise((resolve, reject) => {

      this.adCreateList.items.select()
      .filter(`Office eq '` + sbu + "'")
      .get()
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        // just resolve false for now
        reject(new Error("Error getting items for that sbu, try again"));
      });
    });
  }

  public getApproverList = async (username:string, approverIndex: approvalIndex): Promise<ISharepointFullFormData[]> => {
    // filter by username
    return new Promise((resolve, reject) => {
      this.adCreateList.items
      .select() // filter only necessary field later
      .filter(`${approverIndex} eq '` + username + "'")
      .get()
      .then(result => {
        console.log(result);
        resolve(result);
      })
      .catch(error => {
        // just resolve false for now
        reject(error);
      });
    });
  }
  
  public getApprover = async (username:string, approverIndex: approvalIndex): Promise<boolean> => {
    // filter if user email is in approver column
    return new Promise((resolve, reject) => {
      this.adCreateList.items.select()
      .top(1) // only need 1 to verify if user an approver
      .filter(`${approverIndex} eq '` + username + "'").get()
      .then(result => {
        // if item not present, user is not an approver
        if (result.length === 0) {
          resolve(false);
        }
        resolve(true);
      })
      .catch(error => {
        // just resolve false for now
        resolve(false);
      });
    });
  }

  public getUserApprovers = async (username: string): Promise<IUserApproverData> => {
    // default
    const approveObj = {
      isUserApproverOne: false,
      isUserApproverTwo: false,
      isUserApproverThree: false,
      isUserApproverFour: false,
    };
    // check approval, mutate obj
    approveObj.isUserApproverOne =  await this.getApprover(username, "Approver1");
    approveObj.isUserApproverTwo =  await this.getApprover(username, "Approver2");
    approveObj.isUserApproverThree =  await this.getApprover(username, "Approver3");
    approveObj.isUserApproverFour =  await this.getApprover(username, "Approver4");

    return approveObj;
  }

  public getApproverByOffice = async (office: string): Promise<ISharepointOfficeApproverData> => {

    return new Promise((resolve, reject) => {
      this.fetch.web.lists.getByTitle("HR-Locals")
        .items.select().filter(`office eq '` + office + "'")
        .get()
        .then((result: ISharepointOfficeApproverData[]) => {
          // one item mostlikely
          if (result.length > 0) {
            resolve(result[0]);
          } else {
            reject( new Error("No Approver for location set"));
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  
  public getApproverByEmail = async (email: string): Promise<ISharepointOfficeApproverData | boolean> => {

    return new Promise((resolve, reject) => {
      this.fetch.web.lists.getByTitle("HR-Locals")
        .items.select().filter(`email eq '` + email + "'")
        .get()
        .then((result: ISharepointOfficeApproverData[]) => {
          // one item mostlikely
          if (result.length > 0) {
            resolve(result[0]);
          } else {
            resolve(false);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  } 

  public getSharepointApprovers = async (office: "dcp" | "others"): Promise<ISharepointApprovers> => {

    const fetchString = office === "dcp" ? "DCP-Approvers" : "Other-Approvers";

    return new Promise((resolve, reject) => {
      this.fetch.web.lists.getByTitle("HR-Locals")
        .items.select().filter(`office eq '` + fetchString + "'")
        .get()
        .then(result => {
          const _str: string = result[0]["data"];
          resolve(JSON.parse(_str));
        })
        .catch(error => {console.log(error);});
    });
  }

  public doesUserExist = async (username: string): Promise<boolean> => {

    return new Promise((resolve, reject) => {
      this.fetch.profiles.clientPeoplePickerSearchUser({
        AllowEmailAddresses: true,
        AllowMultipleEntities: false,
        MaximumEntitySuggestions: 1,
        QueryString: username
      })
      .then(res => {
        if (res.length === 1) {
          resolve(true);
        }
        resolve(false);
      })
      .catch(err => reject(false));
    });
  }

  public approveRejectEntry =
    async (id: number, page: mainPageView, status: approvalStatus, comment: string): Promise<boolean> => {
      
      // obj to update
      const updateObj:ISharepointApprovalData = {};

      // get date
      const _date = new Date();
      // mutate obj
      switch(page) {
        case "Approver1":
          updateObj["Approver1Status"] = status;
          updateObj["Approver1Query"] = comment;
          updateObj["Approver1Date"] = _date;
          break;
        case "Approver2":
          updateObj["Approver2Status"] = status;
          updateObj["Approver2Query"] = comment;
          updateObj["Approver2Date"] = _date;
          break;
        case "Approver3":
          updateObj["Approver3Status"] = status;
          updateObj["Approver3Query"] = comment;
          updateObj["Approver3Date"] = _date;
          break;
        case "Approver4":
          updateObj["Approver4Status"] = status;
          updateObj["Approver4Query"] = comment;
          updateObj["Approver4Date"] = _date;
          break;
        default:
          break;
      }
    return new Promise((resolve, reject) => {
      // switch if dcp?
      this.adCreateList.items.getById(id).update(updateObj)
        .then(_ => {
          resolve(true);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  public approverStatusCheck = (id: number, status: approvalStatus, approver: approvalIndex): Promise<boolean> => {

    return new Promise((resolve, reject) => {
      this.adCreateList.items.getById(id).get()
      .then((result:ISharepointFullFormData) => {
        resolve(result[`${approver}Status` as keysOfSharepointData]  === status)
      })
      .catch(error => {
        reject(false);
      });
    });
  }

  public createRequest = async (data: IFullFormData, email: string|undefined): Promise<boolean> => {

    const userExist = await this.doesUserExist(`${data.firstName}.${data.lastName}`);
    // get location approvers
    let approvers = {};

    if (data.sbu.toLowerCase().includes("dcp")) {
      approvers = await this.getSharepointApprovers("dcp");
    } else {
      approvers = await this.getSharepointApprovers("others");
    }

    return new Promise((resolve, reject) => {
      // undef check
      if (email === undefined) {
        reject(new Error("Email not available"));
      }
      // approver is missing
      if (data.approver1 === "" || data.approver1 === undefined) {
        reject(new Error("Approver for the selected office is missing, kindly refresh or contact IT"));
      }
      // does user exist
      if (userExist) {
        reject(new Error(`User ${data.firstName}.${data.lastName} already exists`));
      }

      
      // create
      this.adCreateList.items.add({
        Title: data.title,
        FirstName: data.firstName,
        LastName: data.lastName,
        Initials: data.initials,
        PrivateEmail: data.privateEmail,
        WorkNumber: data.workNumber,
        MobileNumber: data.mobileNumber,
        Address: data.address,
        City: data.city,
        Country: data.country,
        JobTitle: data.jobTitle,
        Office: data.office,
        Sbu: data.sbu,
        Department: data.department,
        SupervisorEmail: data.supervisorEmail,
        DangoteEmail: data.dangoteEmail,
        DirectReports: data.directReports,
        SalaryGrade: data.salaryLevel,
        SalaryStep: data.salaryStep,
        BusinessJustification: data.businessJustification,
        StaffReplaced: data.staffReplaced,
        Hardware: data.hardware,
        creatorEmail: email,
        Approver1: data.approver1,
        ...approvers,
        isDcp: data.sbu.toLowerCase().includes("dcp") ? "Yes" : "No"
      })
      .then(_ => resolve(true))
      .catch(error => {
        if (error instanceof Error) {
          reject(error);
        }
      });
    });
  }

  public updateRequest = async (data: IFullFormData, email: string|undefined): Promise<boolean> => {

    return new Promise((resolve, reject) => {
      // email check
      if (email === undefined) {
        reject(new Error("Email not available"));
      }

      if (email !== data.creatorEmail) {
        reject(new Error("User isn't creator"));
      }
      if (data.id) {
        this.adCreateList.items.getById(data.id).update({
          Title: data.title,
          FirstName: data.firstName,
          LastName: data.lastName,
          Initials: data.initials,
          PrivateEmail: data.privateEmail,
          WorkNumber: data.workNumber,
          MobileNumber: data.mobileNumber,
          City: data.city,
          Country: data.country,
          Address: data.address,
          Comment: data.comment,
          BusinessJustification: data.businessJustification,
          SupervisorEmail: data.supervisorEmail,
          JobTitle: data.jobTitle,
          StaffReplaced: data.staffReplaced,
          Department: data.department,
          DangoteEmail: data.dangoteEmail,
          Sbu: data.sbu,
          Office: data.office,
          DirectReports: data.directReports,
          SalaryGrade: data.salaryLevel,
          SalaryStep: data.salaryStep,
          Hardware: data.hardware,
        })
        .then(result => {resolve(true);})
        .catch(error => reject(error));
      } else {
        reject(new Error("ID is missing, try again or contact IT"));
      }
    });
  }

  public sendFeedback = (email: string, rating: number, feedback: string): Promise<boolean> => {

    return new Promise((resolve, reject) => {
      // split string
      const domain = email.split("@")[1];
      // construct mail
      const To = [`webpartfeedback@${domain}`];
      const Subject = `Feedback from ${email}`;
      const Body = `Rated: ${rating} stars, Feedback: ${feedback}`;
      // body
      const emailProps: IEmailProperties = {
        To,
        Subject,
        Body
      };
      console.log(emailProps);
      // send
      this.fetch.utility.sendEmail(emailProps)
        .then(_ => resolve(true))
        .catch(error => reject(error));
    });
  }

  private getUserRoles = async (email: string): Promise<IUserApproverData> => {

    let _userRole: "user" | "approver" = "user"; 
    // get approvers
    const isUserApproverOne = await this.getApproverByEmail(email);
    const dcpApprovers = await this.getSharepointApprovers("dcp");
    const otherApprovers = await this.getSharepointApprovers("others");

    if (Object.values(dcpApprovers).includes(email) || Object.values(otherApprovers).includes(email)) {
      _userRole = "approver";
    }

    const _userApproveObj = {
      role: _userRole,
      isUserApproverOne: isUserApproverOne ? true : false,
      isUserApproverTwo: dcpApprovers.Approver2 === email || otherApprovers.Approver2 === email,
      isUserApproverThree: dcpApprovers.Approver3 === email || otherApprovers.Approver3 === email,
      isUserApproverFour: dcpApprovers.Approver4 === email || otherApprovers.Approver4 === email,
    };

    // check if user approvers
    // return results
    return _userApproveObj;
  }
}

const fetchServer = new Server();

export default fetchServer;
