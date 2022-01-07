import type { WebPartContext } from '@microsoft/sp-webpart-base';

export type mainPageView = "new" | "about" | "approval1"| "approval2"| "approval3"| "approval4" | "search";
export type NotificationType = "error" | "info" | "success" | "warning";
export type approvalIndex = "Approver1" | "Approver2"  |"Approver3" | "Approver4";
export type approvalStatus = "Approved" | "Pending" | "Rejected";
export type businessJustification = "Job Replacement" | "New Work Scope";
// keys of data
export type keysOfSharepointData = keyof ISharepointFullFormData;
export type keysOfFullFormData = keyof IFullFormData;
// layout type
export type paneLayoutState = "double" | "single";
export type formSettings = {
  mode: "new" | "readOnly" | "approval";
  id?: number;
}

export interface IUserApproverData {
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
  privateNumber: string;
  mobileNumber: string;
  address: string;
  city: string;
  country: string;
  comment: string;
}

interface IFormBusinessData {
  jobTitle: string;
  sbu: string;
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
  Comment: string;
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
  Approver3: string;
  Approver3Status: approvalStatus;
  Approver4: string;
  Approver4Status: approvalStatus;
}

interface ISharepointApprovalData {
  Approver1?: string;
  Approver1Status?: approvalStatus;
  Approver2?: string;
  Approver2Status?: approvalStatus;
  Approver3?: string;
  Approver3Status?: approvalStatus;
  Approver4?: string;
  Approver4Status?: approvalStatus;
}


