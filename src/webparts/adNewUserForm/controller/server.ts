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
  approvalStatus, IUserApproverData
} from "../types/custom";

type approvalIndex = "Approver1" | "Approver2"  |"Approver3" | "Approver4";


/* handler for CRUD REST requests */
class Server implements IServer{

  public fetch = sp;
  private adCreateList: IList;

  public constructor () {
    this.adCreateList = this.fetch.web.lists.getByTitle("HR-AD-Creation");
  }

  public testing = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.fetch.profiles.clientPeoplePickerSearchUser({
        AllowEmailAddresses: true,
        AllowMultipleEntities: false,
        MaximumEntitySuggestions: 1,
        QueryString: "musa.millapo"
      })
      .then(res => {
        console.log(res);
        resolve(res)
      })
      .catch(err => reject(err));
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


      // return
      return {
        id: user ? user.Id : 0,
        email: profile.Email,
        displayName: profile.DisplayName,
        manager: manager,
        jobTitle: profile.Title,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("error");
    }

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
        console.log(result);
        resolve(result);
      })
      .catch(error => {
        // just resolve false for now
        reject(error);
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
    }
    // check approval, mutate obj
    approveObj.isUserApproverOne =  await this.getApprover(username, "Approver1");
    approveObj.isUserApproverTwo =  await this.getApprover(username, "Approver2");
    approveObj.isUserApproverThree =  await this.getApprover(username, "Approver3");
    approveObj.isUserApproverFour =  await this.getApprover(username, "Approver4");

    return approveObj;
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
    async (id: number, page: mainPageView, status: approvalStatus): Promise<boolean> => {

    return new Promise((resolve, reject) => {
      // get date
      // const _date = new Date();
      // obj to update
      const updateObj:ISharepointApprovalData = {};
      // mutate obj
      switch(page) {
        case "approval1":
          updateObj["Approver1Status"] = status;
          break;
        case "approval2":
          updateObj["Approver2Status"] = status;
          break;
        case "approval3":
          updateObj["Approver3Status"] = status;
          break;
        case "approval4":
          updateObj["Approver4Status"] = status;
          break;
        default:
          break;
      }

      this.adCreateList.items.getById(id).update(updateObj)
        .then(_ => {
          resolve(true);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  public createRequest = async ( data: IFullFormData, email: string|undefined): Promise<boolean> => {

    const userExist = await this.doesUserExist(`${data.firstName}.${data.lastName}`);

    return new Promise((resolve, reject) => {
      // undef check
      if (email === undefined) {
        reject(new Error("Email not available"));
      }

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
        PrivateNumber: data.privateNumber,
        MobileNumber: data.mobileNumber,
        Address: data.address,
        City: data.city,
        Country: data.country,
        JobTitle: data.jobTitle,
        Office: data.sbu,
        Department: data.department,
        SupervisorEmail: data.supervisorEmail,
        DangoteEmail: data.dangoteEmail,
        DirectReports: data.directReports,
        SalaryGrade: data.salaryLevel,
        SalaryStep: data.salaryStep,
        BusinessJustification: data.businessJustification,
        StaffReplaced: data.staffReplaced,
        Hardware: data.hardware,
        creatorEmail: email
      })
      .then(_ => resolve(true))
      .catch(error => {
        if (error instanceof Error) {
          reject(error);
        }
      });
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
}

const fetchServer = new Server();

export default fetchServer;
