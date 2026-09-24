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

/**
 * Upload to permanent high-speed cloud CDN as a bulletproof zero-quota fallback
 */
async function uploadToCloudCDN(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<string | null> {
  try {
    const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
    const formData = new FormData();
    formData.append("reqtype", "fileupload");
    formData.append("fileToUpload", blob, filename);

    const response = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const url = (await response.text()).trim();
      if (url.startsWith("http")) {
        console.log("Successfully stored payment screenshot on Cloud CDN:", url);
        return url;
      }
    }
  } catch (e) {
    console.error("Cloud CDN upload attempt error:", e);
  }
  return null;
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
  const cleanMime = mimeType || (ext === "jpg" || ext === "jpeg" || ext === "pjp" || ext === "pjpeg" ? "image/jpeg" : ext === "webp" ? "image/webp" : "image/png");

  // Always save locally for local inspection
  const localUrl = saveLocalUpload(filename, buffer);

  const auth = getGoogleDriveAuth();
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  // 1. Try Google Drive if configured
  if (auth && folderId) {
    try {
      const drive = google.drive({ version: "v3", auth });

      const media = {
        mimeType: cleanMime,
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
      if (fileId) {
        try {
          // Make public so admin can view anywhere
          await drive.permissions.create({
            fileId: fileId,
            requestBody: { role: "reader", type: "anyone" },
          });
        } catch (permErr) {
          console.warn("Could not set public permission on drive file:", permErr);
        }

        const webViewLink = response.data.webViewLink || `https://drive.google.com/file/d/${fileId}/view`;
        return { fileUrl: webViewLink, fileId };
      }
    } catch (error: any) {
      console.warn("Google Drive upload skipped/failed (e.g. quota limit):", error?.message || error);
    }
  }

  // 2. Upload to Cloud CDN for permanent, publicly accessible storage
  const cdnUrl = await uploadToCloudCDN(buffer, filename, cleanMime);
  if (cdnUrl) {
    return { fileUrl: cdnUrl };
  }

  // 3. Fallback to local URL
  return { fileUrl: localUrl };
}
