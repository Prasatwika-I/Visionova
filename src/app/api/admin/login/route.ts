import { NextRequest, NextResponse } from "next/server";
import { validateAdminCredentials, createAdminToken, setAdminSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Please provide both email and password." },
        { status: 400 }
      );
    }

    const isValid = validateAdminCredentials(email, password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await createAdminToken(email);
    await setAdminSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: "Admin authentication successful",
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication failed due to a server error." },
      { status: 500 }
    );
  }
}
