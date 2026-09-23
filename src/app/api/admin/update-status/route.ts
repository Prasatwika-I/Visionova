import { NextRequest, NextResponse } from "next/server";
import { checkIsAdminAuthenticated } from "@/lib/auth";
import { updateRegistrationStatus, getRegistrationById } from "@/lib/googleSheets";
import { sendPaymentStatusEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const isAuthed = await checkIsAdminAuthenticated();
  if (!isAuthed) {
    return NextResponse.json(
      { success: false, error: "Unauthorized access to admin resource." },
      { status: 401 }
    );
  }

  try {
    const { id, status } = await req.json();

    if (!id || !["Pending", "Verified", "Rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid registration ID or status value." },
        { status: 400 }
      );
    }

    const updated = await updateRegistrationStatus(id, status);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Failed to update status for the specified registration." },
        { status: 500 }
      );
    }

    // Fetch the registration details to dispatch the status update email
    try {
      const reg = await getRegistrationById(id);
      if (reg && reg.teamLeadEmail) {
        // Send email notification to the student team lead
        await sendPaymentStatusEmail(reg, status);
      }
    } catch (emailErr) {
      console.error(`[STATUS EMAIL] Failed to send status email to registration ${id}:`, emailErr);
    }

    return NextResponse.json({
      success: true,
      message: `Payment status updated to ${status} for ${id}`,
      id,
      status,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
