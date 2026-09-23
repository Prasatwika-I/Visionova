import { NextRequest, NextResponse } from "next/server";
import { checkDuplicateRegistration, getNextRegistrationId, appendRegistration } from "@/lib/googleSheets";
import { uploadPaymentScreenshotToDrive } from "@/lib/googleDrive";
import { sendConfirmationEmail } from "@/lib/email";
import { RegistrationData } from "@/lib/types";
import { EVENT_CONFIG } from "@/lib/config";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract form fields
    const teamLeadEmail = (formData.get("teamLeadEmail") as string || "").trim();
    const teamLeadName = (formData.get("teamLeadName") as string || "").trim();
    const year = (formData.get("year") as string || "").trim();
    const section = (formData.get("section") as string || "").trim();
    const teamLeadRollNumber = (formData.get("teamLeadRollNumber") as string || "").trim();
    const teamLeadPhone = (formData.get("teamLeadPhone") as string || "").trim();

    const member1Name = (formData.get("member1Name") as string || "").trim();
    const member1Roll = (formData.get("member1Roll") as string || "").trim();
    const member2Name = (formData.get("member2Name") as string || "").trim();
    const member2Roll = (formData.get("member2Roll") as string || "").trim();
    const member3Name = (formData.get("member3Name") as string || "").trim();
    const member3Roll = (formData.get("member3Roll") as string || "").trim();

    const paymentFile = formData.get("paymentScreenshot") as File | null;

    // 1. Validation: Required fields
    if (
      !teamLeadEmail ||
      !teamLeadName ||
      !year ||
      !section ||
      !teamLeadRollNumber ||
      !teamLeadPhone ||
      !member1Name ||
      !member1Roll ||
      !member2Name ||
      !member2Roll ||
      !member3Name ||
      !member3Roll
    ) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    // 2. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(teamLeadEmail)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // 3. Validate phone format (standard phone / min 10 digits)
    const phoneClean = teamLeadPhone.replace(/\D/g, "");
    if (phoneClean.length < 10) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid phone number (minimum 10 digits)." },
        { status: 400 }
      );
    }

    // 4. Validate Year & Section against allowed options
    const validYearGroup = EVENT_CONFIG.YEAR_SECTION_OPTIONS.find((y) => y.year === year);
    if (!validYearGroup || !validYearGroup.sections.includes(section)) {
      return NextResponse.json(
        { success: false, error: "Please select a valid Year and Section from the list." },
        { status: 400 }
      );
    }

    // 5. Validate File: Check image format and size
    if (!paymentFile || !(paymentFile instanceof File) || paymentFile.size === 0) {
      return NextResponse.json(
        { success: false, error: "Please upload your payment screenshot (PNG, JPG, or WEBP)." },
        { status: 400 }
      );
    }

    const fileName = paymentFile.name.toLowerCase();
    const mimeType = paymentFile.type.toLowerCase();
    const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".pjp", ".pjpeg"];
    const hasValidExt = allowedExtensions.some((ext) => fileName.endsWith(ext));
    const hasValidMime = mimeType.startsWith("image/");

    if (!hasValidExt && !hasValidMime) {
      return NextResponse.json(
        { success: false, error: "Invalid payment screenshot. Please upload an image file (PNG, JPG, or WEBP)." },
        { status: 400 }
      );
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    if (paymentFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "The payment screenshot is too large. Please upload an image under 5MB." },
        { status: 400 }
      );
    }

    // 6. Duplicate Registration Check
    const dupCheck = await checkDuplicateRegistration(teamLeadEmail, teamLeadRollNumber);
    if (dupCheck.isDuplicate) {
      return NextResponse.json(
        {
          success: false,
          error: "This team appears to be already registered. Please contact the event organizers if you believe this is an error.",
        },
        { status: 409 }
      );
    }

    // 7. Generate Registration ID on server
    const registrationId = await getNextRegistrationId();

    // 8. Convert File to Buffer and Upload to Google Drive (or local fallback)
    const bytes = await paymentFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const driveResult = await uploadPaymentScreenshotToDrive(
      buffer,
      registrationId,
      paymentFile.name,
      paymentFile.type
    );

    // Format current timestamp e.g. "23-09-2026 17:15"
    const now = new Date();
    const formattedTimestamp = now.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    // 9. Prepare Registration Record
    const record: RegistrationData = {
      id: registrationId,
      timestamp: formattedTimestamp,
      teamLeadEmail,
      teamLeadName,
      year,
      section,
      teamLeadRollNumber,
      teamLeadPhone,
      member1Name,
      member1Roll,
      member2Name,
      member2Roll,
      member3Name,
      member3Roll,
      paymentScreenshotUrl: driveResult.fileUrl,
      paymentScreenshotDriveId: driveResult.fileId,
      paymentStatus: "Pending",
    };

    // 10. Append to Google Sheets (or local fallback)
    await appendRegistration(record);

    // 11. Send Confirmation Email to Team Lead (async without blocking failure)
    try {
      await sendConfirmationEmail(record);
    } catch (emailErr) {
      console.error("Non-fatal confirmation email error:", emailErr);
    }

    // 12. Return Success Response
    return NextResponse.json({
      success: true,
      registrationId,
      message: "Your team has been successfully registered for the AI Video Making Event.",
      data: {
        id: registrationId,
        teamLeadEmail,
        teamLeadName,
      },
    });
  } catch (error) {
    console.error("Error in registration endpoint:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong while submitting your registration. Please try again.",
      },
      { status: 500 }
    );
  }
}
