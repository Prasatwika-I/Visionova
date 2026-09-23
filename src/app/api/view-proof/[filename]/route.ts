import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { getLocalUploadPath } from "@/lib/storageFallback";
import { checkIsAdminAuthenticated } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  // Protect proof access with admin authentication
  const isAuthed = await checkIsAdminAuthenticated();
  if (!isAuthed) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { filename } = await context.params;
    // Sanitize filename to prevent path traversal
    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "");
    const filePath = getLocalUploadPath(safeFilename);

    if (!filePath || !fs.existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const ext = safeFilename.split(".").pop()?.toLowerCase() || "png";
    const contentType =
      ext === "jpg" || ext === "jpeg" || ext === "pjp" || ext === "pjpeg"
        ? "image/jpeg"
        : ext === "webp"
        ? "image/webp"
        : ext === "gif"
        ? "image/gif"
        : "image/png";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (e) {
    console.error("Error serving proof file:", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
