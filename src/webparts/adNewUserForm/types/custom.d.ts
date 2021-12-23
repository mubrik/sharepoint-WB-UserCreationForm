import type { WebPartContext } from '@microsoft/sp-webpart-base';

export type mainPageView = "new" | "about";
export type NotificationType = "error" | "info" | "success" | "warning";

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

interface IFormUserData {
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
  
}

export type keysOfFullFormData = keyof IFullFormData;
export type businessJustification = "Job Replacement" | "New Work Scope";
// layout type
export type paneLayoutState = "double" | "single";
