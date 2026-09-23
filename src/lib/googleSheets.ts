import { google } from "googleapis";
import { RegistrationData } from "./types";
import { getLocalRegistrations, saveLocalRegistration, updateLocalPaymentStatus } from "./storageFallback";

function getCleanSpreadsheetId(): string {
  let id = process.env.GOOGLE_SHEET_ID || "1Gj3i5VIUf61yCwP67cCK7_6mFdsYMYGzQ5uqcj3A9zE";
  id = id.replace(/^["']|["']$/g, "").trim();
  const match = id.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : id;
}

// Format private key properly (handle quotes, \n, and \r\n in env var)
function getGoogleAuth() {
  let email = (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "visionova-registration@visionova-509514.iam.gserviceaccount.com").replace(/^["']|["']$/g, "").trim();
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!privateKey) {
    return null;
  }

  // Clean surrounding quotes
  privateKey = privateKey.replace(/^["']|["']$/g, "").trim();

  // If private key has literal '\n', replace with actual newlines
  if (privateKey.includes("\\n")) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }
  privateKey = privateKey.replace(/\r\n/g, "\n");

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

// Get first sheet title dynamically
async function getFirstSheetTitle(sheets: any, spreadsheetId: string): Promise<string> {
  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    if (meta.data.sheets && meta.data.sheets.length > 0) {
      return meta.data.sheets[0].properties?.title || "Sheet1";
    }
  } catch (err) {
    console.warn("Could not retrieve sheet metadata, defaulting to Sheet1:", err);
  }
  return "Sheet1";
}

// Ensure header row exists in Google Sheets
async function ensureSheetHeaders(sheets: any, spreadsheetId: string, sheetName?: string) {
  try {
    const targetSheet = sheetName || (await getFirstSheetTitle(sheets, spreadsheetId));
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${targetSheet}'!A1:P1`,
    });
    const rows = res.data.values;
    if (!rows || rows.length === 0 || rows[0].length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `'${targetSheet}'!A1:P1`,
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
  const spreadsheetId = getCleanSpreadsheetId();

  if (!auth || !spreadsheetId) {
    // Fallback to local storage
    return getLocalRegistrations();
  }

  try {
    const sheets = google.sheets({ version: "v4", auth });
    const targetSheet = await getFirstSheetTitle(sheets, spreadsheetId);
    await ensureSheetHeaders(sheets, spreadsheetId, targetSheet);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${targetSheet}'!A2:P`,
    });

    const rows = response.data.values || [];
    const sheetRegistrations = rows
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

    if (sheetRegistrations.length > 0) {
      return sheetRegistrations;
    }

    // If Google Sheet is empty, check fallback
    const local = getLocalRegistrations();
    return local;
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
    if (reg.teamLeadEmail && reg.teamLeadEmail.trim().toLowerCase() === normalizedEmail) {
      return { isDuplicate: true, field: "email" };
    }
    if (reg.teamLeadRollNumber && reg.teamLeadRollNumber.trim().toUpperCase() === normalizedRoll) {
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
  const spreadsheetId = getCleanSpreadsheetId();

  if (!auth || !spreadsheetId) {
    return true; // Already saved locally
  }

  try {
    const sheets = google.sheets({ version: "v4", auth });
    const targetSheet = await getFirstSheetTitle(sheets, spreadsheetId);
    await ensureSheetHeaders(sheets, spreadsheetId, targetSheet);

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
      range: `'${targetSheet}'!A:P`,
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
  // Always update local storage
  updateLocalPaymentStatus(id, status);

  const auth = getGoogleAuth();
  const spreadsheetId = getCleanSpreadsheetId();

  if (!auth || !spreadsheetId) {
    return true;
  }

  try {
    const sheets = google.sheets({ version: "v4", auth });
    const targetSheet = await getFirstSheetTitle(sheets, spreadsheetId);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${targetSheet}'!A2:P`,
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row) => row[0] === id);

    if (rowIndex !== -1) {
      // Google Sheets is 1-indexed, headers are in row 1, so row is rowIndex + 2
      const sheetRowNumber = rowIndex + 2;
      // Column P is the 16th column (Payment Status)
      const range = `'${targetSheet}'!P${sheetRowNumber}`;

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[status]],
        },
      });
    }

    return true;
  } catch (error) {
    console.error("Error updating status in Google Sheets:", error);
    // Even if Google Sheets update failed, local was updated
    return true;
  }
}

// Get single registration by ID
export async function getRegistrationById(id: string): Promise<RegistrationData | null> {
  const registrations = await getAllRegistrations();
  return registrations.find((r) => r.id === id) || null;
}

