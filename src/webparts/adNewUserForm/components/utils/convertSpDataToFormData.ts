// types
import { IFullFormData, ISharepointFullFormData } from "../../types/custom";
/**
* utility func to convert item from SharePoint to form data
* main difference is the camelcasing, null items are converted to empty string/obj type
* 
*/
export default (spData: ISharepointFullFormData): IFullFormData => {

  const formData: IFullFormData = {
    id: spData.Id,
    creatorEmail: spData.creatorEmail,
    title: spData.Title,
    firstName: spData.FirstName,
    lastName: spData.LastName,
    initials: spData.Initials ? spData.Initials : "",
    comment: spData.Comment ? spData.Comment: "",
    privateEmail: spData.PrivateEmail,
    workNumber: spData.WorkNumber ? spData.WorkNumber : "",
    mobileNumber: spData.MobileNumber,
    address: spData.Address,
    city: spData.City,
    country: spData.Country,
    privateNumber: spData.PrivateNumber ? spData.PrivateNumber : "",
    jobTitle: spData.JobTitle,
    office: spData.Office,
    sbu: spData.Sbu,
    department: spData.Department,
    supervisorEmail: spData.SupervisorEmail,
    dangoteEmail: spData.DangoteEmail ? spData.DangoteEmail : "",
    directReports: spData.DirectReports,
    salaryLevel: spData.SalaryGrade,
    salaryStep: spData.SalaryStep,
    businessJustification: spData.BusinessJustification,
    staffReplaced: spData.StaffReplaced ? spData.StaffReplaced : "",
    hardware: spData.Hardware ? spData.Hardware : "",
    approver1: spData.Approver1 ? spData.Approver1 : "",
    approver1Status: spData.Approver1Status,
    approver1Query: spData.Approver1Query ? spData.Approver1Query : "",
    approver1Date: spData.Approver1Date? new Date(spData.Approver1Date) : new Date("01/01/1990"),
    approver2: spData.Approver2 ? spData.Approver2 : "",
    approver2Status: spData.Approver2Status,
    approver2Query: spData.Approver2Query ? spData.Approver2Query : "",
    approver2Date: spData.Approver2Date? new Date(spData.Approver2Date) : new Date("01/01/1990"),
    approver3: spData.Approver3 ? spData.Approver3 : "",
    approver3Status: spData.Approver3Status,
    approver3Query: spData.Approver3Query ? spData.Approver3Query : "",
    approver3Date: spData.Approver3Date ? new Date(spData.Approver3Date) : new Date("01/01/1990"),
    approver4: spData.Approver4 ? spData.Approver4 : "",
    approver4Status: spData.Approver4Status,
    approver4Query: spData.Approver4Query ? spData.Approver4Query : "",
    approver4Date: spData.Approver4Date ? new Date(spData.Approver4Date) : new Date("01/01/1990"),
    isDcp: spData.isDcp,
    processor: spData.processor
  };

  return formData;
};