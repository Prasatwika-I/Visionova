import { NextResponse } from "next/server";
import { EVENT_CONFIG } from "@/lib/config";

export async function GET() {
  return NextResponse.json({
    eventName: EVENT_CONFIG.EVENT_NAME,
    eventTitle: EVENT_CONFIG.EVENT_TITLE,
    eventSubtitle: EVENT_CONFIG.EVENT_SUBTITLE,
    eventTagline: EVENT_CONFIG.EVENT_TAGLINE,
    collegeName: EVENT_CONFIG.COLLEGE_NAME,
    organizerName: EVENT_CONFIG.ORGANIZER_NAME,
    registrationFee: EVENT_CONFIG.REGISTRATION_FEE,
    eventDate: EVENT_CONFIG.EVENT_DATE,
    eventVenue: EVENT_CONFIG.EVENT_VENUE,
    yearSectionOptions: EVENT_CONFIG.YEAR_SECTION_OPTIONS,
  });
}
