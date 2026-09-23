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

const DEFAULT_SHEET_COLUMNS = [
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

// Helper to convert column index (0-based) to Sheet column letter (A, B, ..., P, etc.)
function columnIndexToLetter(index: number): string {
  let letter = "";
  let temp = index;
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

// Dynamically map column positions from actual sheet headers
function getHeaderIndices(headers: string[]) {
  const findCol = (predicate: (h: string) => boolean, fallback: number): number => {
    const idx = headers.findIndex((h) => predicate(String(h || "").trim().toLowerCase()));
    return idx !== -1 ? idx : fallback;
  };

  return {
    id: findCol((h) => h.includes("registration id") || h === "id" || h.includes("reg id"), 0),
    timestamp: findCol((h) => h.includes("timestamp") || h.includes("date") || h.includes("time"), 1),
    teamLeadEmail: findCol((h) => h.includes("lead email") || (h.includes("email") && !h.includes("member")), 2),
    teamLeadName: findCol((h) => h.includes("lead name") || (h.includes("name") && !h.includes("member")), 3),
    year: findCol((h) => h.includes("year"), 4),
    section: findCol((h) => h.includes("section") || h.includes("sec"), 5),
    teamLeadRollNumber: findCol((h) => h.includes("lead roll") || (h.includes("roll") && !h.includes("member")), 6),
    teamLeadPhone: findCol((h) => h.includes("phone") || h.includes("mobile") || h.includes("contact"), 7),
    member1Name: findCol((h) => h.includes("member 1") && h.includes("name"), 8),
    member1Roll: findCol((h) => h.includes("member 1") && h.includes("roll"), 9),
    member2Name: findCol((h) => h.includes("member 2") && h.includes("name"), 10),
    member2Roll: findCol((h) => h.includes("member 2") && h.includes("roll"), 11),
    member3Name: findCol((h) => h.includes("member 3") && h.includes("name"), 12),
    member3Roll: findCol((h) => h.includes("member 3") && h.includes("roll"), 13),
    paymentScreenshotUrl: findCol((h) => h.includes("screenshot") || h.includes("proof"), 14),
    paymentStatus: findCol((h) => h.includes("payment status") || h.includes("status"), 15),
  };
}

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
          values: [DEFAULT_SHEET_COLUMNS],
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
    return getLocalRegistrations();
  }

  try {
    const sheets = google.sheets({ version: "v4", auth });
    const targetSheet = await getFirstSheetTitle(sheets, spreadsheetId);
    await ensureSheetHeaders(sheets, spreadsheetId, targetSheet);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${targetSheet}'!A1:Z500`,
    });

    const rows = response.data.values || [];
    if (rows.length <= 1) {
      const local = getLocalRegistrations();
      return local;
    }

    const headers = rows[0] || [];
    const col = getHeaderIndices(headers);

    const sheetRegistrations = rows
      .slice(1) // Skip header row
      .filter((row) => row && row.length > 0 && String(row[col.id] || "").trim() !== "" && !String(row[col.id] || "").includes("Registration ID"))
      .map((row) => {
        const rawStatus = String(row[col.paymentStatus] || "Pending").trim();
        const validStatus: "Pending" | "Verified" | "Rejected" =
          rawStatus === "Verified" ? "Verified" : rawStatus === "Rejected" ? "Rejected" : "Pending";

        return {
          id: String(row[col.id] || "").trim(),
          timestamp: String(row[col.timestamp] || "").trim(),
          teamLeadEmail: String(row[col.teamLeadEmail] || "").trim(),
          teamLeadName: String(row[col.teamLeadName] || "").trim(),
          year: String(row[col.year] || "").trim(),
          section: String(row[col.section] || "").trim(),
          teamLeadRollNumber: String(row[col.teamLeadRollNumber] || "").trim(),
          teamLeadPhone: String(row[col.teamLeadPhone] || "").trim(),
          member1Name: String(row[col.member1Name] || "").trim(),
          member1Roll: String(row[col.member1Roll] || "").trim(),
          member2Name: String(row[col.member2Name] || "").trim(),
          member2Roll: String(row[col.member2Roll] || "").trim(),
          member3Name: String(row[col.member3Name] || "").trim(),
          member3Roll: String(row[col.member3Roll] || "").trim(),
          paymentScreenshotUrl: String(row[col.paymentScreenshotUrl] || "").trim(),
          paymentStatus: validStatus,
        };
      });

    if (sheetRegistrations.length > 0) {
      return sheetRegistrations;
    }

    return getLocalRegistrations();
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

// Append a new registration to Google Sheets (aligned with header order)
export async function appendRegistration(data: RegistrationData): Promise<boolean> {
  // Always save to local fallback as well for redundancy
  saveLocalRegistration(data);

  const auth = getGoogleAuth();
  const spreadsheetId = getCleanSpreadsheetId();

  if (!auth || !spreadsheetId) {
    return true;
  }

  try {
    const sheets = google.sheets({ version: "v4", auth });
    const targetSheet = await getFirstSheetTitle(sheets, spreadsheetId);
    await ensureSheetHeaders(sheets, spreadsheetId, targetSheet);

    // Read current headers to place values in the exact matching columns
    const headerRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${targetSheet}'!A1:Z1`,
    });

    const headers: string[] = (headerRes.data.values && headerRes.data.values[0]) || DEFAULT_SHEET_COLUMNS;
    const col = getHeaderIndices(headers);

    // Construct array of length equal to headers
    const rowValues = new Array(Math.max(headers.length, 16)).fill("");
    rowValues[col.id] = data.id;
    rowValues[col.timestamp] = data.timestamp;
    rowValues[col.teamLeadEmail] = data.teamLeadEmail;
    rowValues[col.teamLeadName] = data.teamLeadName;
    rowValues[col.year] = data.year;
    rowValues[col.section] = data.section;
    rowValues[col.teamLeadRollNumber] = data.teamLeadRollNumber;
    rowValues[col.teamLeadPhone] = data.teamLeadPhone;
    rowValues[col.member1Name] = data.member1Name;
    rowValues[col.member1Roll] = data.member1Roll;
    rowValues[col.member2Name] = data.member2Name;
    rowValues[col.member2Roll] = data.member2Roll;
    rowValues[col.member3Name] = data.member3Name;
    rowValues[col.member3Roll] = data.member3Roll;
    rowValues[col.paymentScreenshotUrl] = data.paymentScreenshotUrl;
    rowValues[col.paymentStatus] = data.paymentStatus || "Pending";

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `'${targetSheet}'!A:P`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [rowValues] },
    });

    return true;
  } catch (error) {
    console.error("Error appending to Google Sheets:", error);
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
      range: `'${targetSheet}'!A1:Z500`,
    });

    const rows = response.data.values || [];
    if (rows.length <= 1) return true;

    const headers = rows[0] || [];
    const col = getHeaderIndices(headers);

    // Find row index (0-based in rows array)
    const rowIndex = rows.findIndex((row, idx) => idx > 0 && row && String(row[col.id] || "").trim() === id);

    if (rowIndex !== -1) {
      // 1-indexed row number in Google Sheets
      const sheetRowNumber = rowIndex + 1;
      const colLetter = columnIndexToLetter(col.paymentStatus);
      const range = `'${targetSheet}'!${colLetter}${sheetRowNumber}`;

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
    return true;
  }
}

// Get single registration by ID
export async function getRegistrationById(id: string): Promise<RegistrationData | null> {
  const registrations = await getAllRegistrations();
  return registrations.find((r) => r.id === id) || null;
}

