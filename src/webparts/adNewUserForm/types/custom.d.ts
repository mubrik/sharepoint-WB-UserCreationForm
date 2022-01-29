import type { WebPartContext } from '@microsoft/sp-webpart-base';

export type mainPageView = "new" | "about" | "Approver1" | "Approver2"  |"Approver3" | "Approver4" | "search";
export type NotificationType = "error" | "info" | "success" | "warning";
// export type approvalPages = "approval1"| "approval2"| "approval3"| "approval4";
export type approvalIndex = "Approver1" | "Approver2"  |"Approver3" | "Approver4";
export type approvalStatus = "Approved" | "Pending" | "Rejected" | "Queried" | "NotAllowed";
export type businessJustification = "Job Replacement" | "New Work Scope";
// keys of data
export type keysOfSharepointData = keyof ISharepointFullFormData;
export type keysOfFullFormData = keyof IFullFormData;
// layout type
export type paneLayoutState = "double" | "single";
export type formSettings = {
  mode: "new" | "readOnly" | "approval" | "edit";
  id?: number;
}

export interface IUserApproverData {
  role?: "user" | "approver" | "admin";
  isUserApproverOne?: boolean;
  isUserApproverTwo?: boolean;
  isUserApproverThree?: boolean;
  isUserApproverFour?: boolean;
}

export interface IUserData extends IUserApproverData {
  ok?: boolean;
  id?: number;
  email?: string;
  displayName?: string;
  manager?: string;
  jobTitle?: string;
}

export interface IServer {
  fetch: typeof sp;
  testing(): Promise<void>;
  getUser(): Promise<IUserData>;
  sendFeedback(
    email: string,
    rating: number,
    feedback: string): Promise<boolean>;
}

export interface IWebPartData {
  context?: WebPartContext;
  webpartWidth: number;
}

export interface IFormUserData {
  title: string;
  firstName: string;
  lastName: string;
  initials: string
  privateEmail: string;
  workNumber: string;
  mobileNumber: string;
  privateNumber: string;
  address: string;
  city: string;
  country: string;
  comment: string;
}

interface IFormBusinessData {
  jobTitle: string;
  sbu: "Agrosacks" | "Flour" | "DCP" | "DSR" | "Others" | "Dancom"| "Contractors" | "";
  office: string;
  department: string;
  supervisorEmail: string;
  dangoteEmail: string;
  directReports: string;
  salaryLevel: string;
  salaryStep: string;
}

interface IFormJustificationData {
  businessJustification: businessJustification;
  staffReplaced?: string;
}

interface IFormHardwareData {
  hardware: string;
}

export interface IFullFormData extends IFormUserData,IFormBusinessData,IFormJustificationData,IFormHardwareData {
  id? : number;
  creatorEmail?: string;
  isDcp?: "Yes" | "No";
  processor?: "flow" | "application";
  approver1? : string;
  approver1Status?: approvalStatus;
  approver1Query?: string;
  approver1Date?: Date;
  approver2?: string;
  approver2Status?: approvalStatus;
  approver2Query?: string;
  approver2Date?: Date;
  approver3?: string;
  approver3Status?: approvalStatus;
  approver3Query?: string;
  approver3Date?: Date;
  approver4?: string;
  approver4Status?: approvalStatus;
  approver4Query?: string;
  approver4Date?: Date;
}

export interface ISharepointFullFormData {
  Id: number;
  creatorEmail: string;
  Title: string;
  FirstName: string;
  LastName: string;
  Initials: string
  PrivateEmail: string;
  PrivateNumber: string;
  WorkNumber: string;
  MobileNumber: string;
  PrivateNumber: string;
  Address: string;
  City: string;
  Country: string;
  Comment: string;
  JobTitle: string;
  Office: string;
  Sbu: "Agrosacks" | "Flour" | "DCP" | "DSR" | "Others" | "Dancom"| "Contractors" | "";
  Department: string;
  SupervisorEmail: string;
  DangoteEmail: string;
  DirectReports: string;
  SalaryGrade: string;
  SalaryStep: string;
  BusinessJustification: businessJustification;
  StaffReplaced?: string;
  Hardware: string;
  Approver1: string;
  Approver1Status: approvalStatus;
  Approver1Query: string;
  Approver1Date: Date;
  Approver2: string;
  Approver2Status: approvalStatus;
  Approver2Query: string;
  Approver2Date: Date;
  Approver3: string;
  Approver3Status: approvalStatus;
  Approver3Query: string;
  Approver3Date: Date;
  Approver4: string;
  Approver4Status: approvalStatus;
  Approver4Query: string;
  Approver4Date: Date;
  isDcp: "Yes" | "No";
  processor: "flow" | "application";
}

interface ISharepointApprovalData {
  Approver1?: string;
  Approver1Status?: approvalStatus;
  Approver1Query?: string;
  Approver1Date?: Date;
  Approver2?: string;
  Approver2Status?: approvalStatus;
  Approver2Query?: string;
  Approver2Date?: Date;
  Approver3?: string;
  Approver3Status?: approvalStatus;
  Approver3Query?: string;
  Approver3Date?: Date;
  Approver4?: string;
  Approver4Status?: approvalStatus;
  Approver4Query?: string;
  Approver4Date?: Date;
}

interface ISharepointOfficeApproverData {
  name: string;
  office: string;
  email: string;
}

interface ISharepointApprovers {
  Approver2: string;
  Approver3?: string;
  Approver4: string;
}

export interface IApproverObj {
  name: string;
  status: string;
}

export interface profileDetail {
  name: string;
  imageUrl: string;
}