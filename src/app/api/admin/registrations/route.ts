import { NextResponse } from "next/server";
import { checkIsAdminAuthenticated } from "@/lib/auth";
import { getAllRegistrations } from "@/lib/googleSheets";

export async function GET() {
  const isAuthed = await checkIsAdminAuthenticated();
  if (!isAuthed) {
    return NextResponse.json(
      { success: false, error: "Unauthorized access to admin resource." },
      { status: 401 }
    );
  }

  try {
    const registrations = await getAllRegistrations();
    return NextResponse.json({
      success: true,
      data: registrations,
      isConfiguredWithGoogle: !!(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_SHEET_ID),
    });
  } catch (error) {
    console.error("Error fetching registrations for admin:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve registrations." },
      { status: 500 }
    );
  }
}
