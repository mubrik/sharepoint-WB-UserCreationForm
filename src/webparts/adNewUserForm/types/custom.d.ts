import type { WebPartContext } from '@microsoft/sp-webpart-base';

export type mainPageView = "new" | "about" | "approval1";
export type NotificationType = "error" | "info" | "success" | "warning";
export type approvalStatus = "Approved" | "Pending" | "Rejected";
export type businessJustification = "Job Replacement" | "New Work Scope";
// keys of data
export type keysOfSharepointData = keyof ISharepointFullFormData;
export type keysOfFullFormData = keyof IFullFormData;
// layout type
export type paneLayoutState = "double" | "single";
export type formSettings = {
  mode: "new" | "readOnly";
  id?: number;
}


export interface IUserData {
  ok?: boolean;
  id?: number;
  email?: string;
  displayName?: string;
  manager?: string;
  jobTitle?: string;
  isUserHr? : boolean;
  isUserManager? : boolean;
  isUserGroupHead? : boolean;
  isUserApproverOne? : boolean;
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
  privateNumber: string;
  mobileNumber: string;
  address: string;
  city: string;
  country: string;
}

interface IFormBusinessData {
  jobTitle: string;
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
  MobileNumber: string;
  Address: string;
  City: string;
  Country: string;
  JobTitle: string;
  Office: string;
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
  Approver2: string;
  Approver2Status: approvalStatus;
}

interface ISharepointApprovalData {
  Approver1?: string;
  Approver1Status?: approvalStatus;
  Approver2?: string;
  Approver2Status?: approvalStatus;
}


