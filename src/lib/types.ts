export interface RegistrationData {
  id: string; // e.g. "AIVM-001"
  timestamp: string; // formatted timestamp
  teamLeadEmail: string;
  teamLeadName: string;
  year: string;
  section: string;
  teamLeadRollNumber: string;
  teamLeadPhone: string;
  member1Name: string;
  member1Roll: string;
  member2Name: string;
  member2Roll: string;
  member3Name: string;
  member3Roll: string;
  paymentScreenshotUrl: string; // Google Drive or local view URL
  paymentScreenshotDriveId?: string;
  paymentStatus: "Pending" | "Verified" | "Rejected";
}

export interface RegistrationFormInput {
  teamLeadEmail: string;
  teamLeadName: string;
  year: string;
  section: string;
  teamLeadRollNumber: string;
  teamLeadPhone: string;
  member1Name: string;
  member1Roll: string;
  member2Name: string;
  member2Roll: string;
  member3Name: string;
  member3Roll: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
