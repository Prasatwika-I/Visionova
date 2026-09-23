import { google } from "googleapis";
import { Readable } from "stream";
import { saveLocalUpload } from "./storageFallback";

function getGoogleDriveAuth() {
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
      scopes: ["https://www.googleapis.com/auth/drive"],
    });
    return auth;
  } catch (err) {
    console.error("Error initializing Google Drive JWT:", err);
    return null;
  }
}

// Convert Buffer to readable stream
function bufferToStream(buffer: Buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export async function uploadPaymentScreenshotToDrive(
  buffer: Buffer,
  registrationId: string,
  originalFilename: string = "screenshot.png",
  mimeType: string = "image/png"
): Promise<{ fileUrl: string; fileId?: string }> {
  // Extract extension
  const extMatch = originalFilename.match(/\.([a-zA-Z0-9]+)$/);
  const ext = extMatch ? extMatch[1].toLowerCase() : "png";
  const filename = `${registrationId}-payment.${ext}`;

  // Always save locally as fallback
  const localUrl = saveLocalUpload(filename, buffer);

  const auth = getGoogleDriveAuth();
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!auth || !folderId) {
    console.log("Google Drive credentials not set, using local storage fallback.");
    return { fileUrl: localUrl };
  }

  try {
    const drive = google.drive({ version: "v3", auth });

    const media = {
      mimeType: mimeType || (ext === "jpg" || ext === "jpeg" || ext === "pjp" || ext === "pjpeg" ? "image/jpeg" : ext === "webp" ? "image/webp" : "image/png"),
      body: bufferToStream(buffer),
    };

    const fileMetadata: any = {
      name: filename,
      parents: [folderId],
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, name, webViewLink, webContentLink",
      supportsAllDrives: true,
    });

    const fileId = response.data.id;
    const webViewLink = response.data.webViewLink || `https://drive.google.com/file/d/${fileId}/view`;

    return {
      fileUrl: webViewLink,
      fileId: fileId || undefined,
    };
  } catch (error) {
    console.error("Error uploading to Google Drive, returning local fallback:", error);
    return { fileUrl: localUrl };
  }
}
