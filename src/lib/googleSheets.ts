import { google } from "googleapis";
import { RegistrationData } from "./types";
import { getLocalRegistrations, saveLocalRegistration, updateLocalPaymentStatus } from "./storageFallback";

// Format private key properly (handle \n in env var)
function getGoogleAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !privateKey) {
    return null;
  }

  // If private key has escaped newlines like '\n', replace with actual newlines
  if (privateKey.includes("\\n")) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  try {
    const auth = new google.auth.JWT({
      email,
      key: privateKey,
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
      ],
    });
    return auth;
  } catch (err) {
    console.error("Error creating Google JWT auth:", err);
    return null;
  }
}

const SHEET_COLUMNS = [
  "Registration ID",
  "Timestamp",
  "Team Lead Email",
  "Team Lead Name",
  "Year",
  "Section",
  "Team Lead Roll Number",
  "Team Lead Phone Number",
  "Team Member 1 Name",
  "Team Member 1 Roll Number",
  "Team Member 2 Name",
  "Team Member 2 Roll Number",
  "Team Member 3 Name",
  "Team Member 3 Roll Number",
  "Payment Screenshot",
  "Payment Status",
];

// Ensure header row exists in Google Sheets
async function ensureSheetHeaders(sheets: any, spreadsheetId: string, sheetName: string = "Sheet1") {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A1:P1`,
    });
    const rows = res.data.values;
    if (!rows || rows.length === 0 || rows[0].length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1:P1`,
        valueInputOption: "RAW",
        requestBody: {
          values: [SHEET_COLUMNS],
        },
      });
    }
  } catch (e) {
    console.warn("Could not check/initialize sheet headers:", e);
  }
}

// Fetch all registrations (from Google Sheets or local fallback)
export async function getAllRegistrations(): Promise<RegistrationData[]> {
  const auth = getGoogleAuth();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!auth || !spreadsheetId) {
    // Fallback to local storage
    return getLocalRegistrations();
  }

  try {
    const sheets = google.sheets({ version: "v4", auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A2:P",
    });

    const rows = response.data.values || [];
    return rows
      .filter((row) => row && row.length > 0 && String(row[0] || "").trim() !== "" && row[0] !== "Registration ID")
      .map((row) => ({
        id: String(row[0] || ""),
        timestamp: String(row[1] || ""),
        teamLeadEmail: String(row[2] || ""),
        teamLeadName: String(row[3] || ""),
        year: String(row[4] || ""),
        section: String(row[5] || ""),
        teamLeadRollNumber: String(row[6] || ""),
        teamLeadPhone: String(row[7] || ""),
        member1Name: String(row[8] || ""),
        member1Roll: String(row[9] || ""),
        member2Name: String(row[10] || ""),
        member2Roll: String(row[11] || ""),
        member3Name: String(row[12] || ""),
        member3Roll: String(row[13] || ""),
        paymentScreenshotUrl: String(row[14] || ""),
        paymentStatus: (["Pending", "Verified", "Rejected"].includes(String(row[15] || "").trim())
          ? String(row[15] || "").trim()
          : "Pending") as "Pending" | "Verified" | "Rejected",
      }));
  } catch (error) {
    console.error("Error fetching from Google Sheets, using fallback:", error);
    return getLocalRegistrations();
  }
}

// Generate the next sequential registration ID (e.g. AIVM-001)
export async function getNextRegistrationId(): Promise<string> {
  const registrations = await getAllRegistrations();
  let maxNum = 0;

  for (const reg of registrations) {
    if (reg.id && reg.id.startsWith("AIVM-")) {
      const numPart = parseInt(reg.id.replace("AIVM-", ""), 10);
      if (!isNaN(numPart) && numPart > maxNum) {
        maxNum = numPart;
      }
    }
  }

  const nextNum = maxNum + 1;
  return `AIVM-${String(nextNum).padStart(3, "0")}`;
}

// Check if registration already exists by email or roll number
export async function checkDuplicateRegistration(
  email: string,
  rollNumber: string
): Promise<{ isDuplicate: boolean; field?: string }> {
  const registrations = await getAllRegistrations();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedRoll = rollNumber.trim().toUpperCase();

  for (const reg of registrations) {
    if (reg.teamLeadEmail.trim().toLowerCase() === normalizedEmail) {
      return { isDuplicate: true, field: "email" };
    }
    if (reg.teamLeadRollNumber.trim().toUpperCase() === normalizedRoll) {
      return { isDuplicate: true, field: "rollNumber" };
    }
  }

  return { isDuplicate: false };
}

// Append a new registration to Google Sheets (or fallback)
export async function appendRegistration(data: RegistrationData): Promise<boolean> {
  // Always save to local fallback as well for redundancy
  saveLocalRegistration(data);

  const auth = getGoogleAuth();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!auth || !spreadsheetId) {
    return true; // Already saved locally
  }

  try {
    const sheets = google.sheets({ version: "v4", auth });
    await ensureSheetHeaders(sheets, spreadsheetId);

    const values = [
      [
        data.id,
        data.timestamp,
        data.teamLeadEmail,
        data.teamLeadName,
        data.year,
        data.section,
        data.teamLeadRollNumber,
        data.teamLeadPhone,
        data.member1Name,
        data.member1Roll,
        data.member2Name,
        data.member2Roll,
        data.member3Name,
        data.member3Roll,
        data.paymentScreenshotUrl,
        data.paymentStatus || "Pending",
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:P",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values },
    });

    return true;
  } catch (error) {
    console.error("Error appending to Google Sheets:", error);
    // Already saved to fallback
    return true;
  }
}

// Update payment status for a registration
export async function updateRegistrationStatus(
  id: string,
  status: "Pending" | "Verified" | "Rejected"
): Promise<boolean> {
  // Update local fallback
  updateLocalPaymentStatus(id, status);

  const auth = getGoogleAuth();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!auth || !spreadsheetId) {
    return true;
  }

  try {
    const sheets = google.sheets({ version: "v4", auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A2:P",
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row) => row[0] === id);

    if (rowIndex === -1) {
      console.warn(`Registration ID ${id} not found in Google Sheets`);
      return false;
    }

    // Google Sheets is 1-indexed, headers are in row 1, so row is rowIndex + 2
    const sheetRowNumber = rowIndex + 2;
    // Column P is the 16th column (Payment Status)
    const range = `Sheet1!P${sheetRowNumber}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[status]],
      },
    });

    return true;
  } catch (error) {
    console.error("Error updating status in Google Sheets:", error);
    return false;
  }
}

// Get single registration by ID
export async function getRegistrationById(id: string): Promise<RegistrationData | null> {
  const registrations = await getAllRegistrations();
  return registrations.find((r) => r.id === id) || null;
}

