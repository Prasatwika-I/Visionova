// Centralized configuration for Visionova — AI Video Making Event

export const EVENT_CONFIG = {
  // Event Name & Branding
  EVENT_NAME: process.env.EVENT_NAME || "Visionova — AI Video Making Event",
  EVENT_TITLE: "Visionova",
  EVENT_SUBTITLE: "AI Video Making Event",
  EVENT_TAGLINE: "Create. Imagine. Animate. Inspire.",
  
  // Institution & Organizing Department
  COLLEGE_NAME: process.env.COLLEGE_NAME || "Annamacharya Institute of Technology and Sciences, Tirupati",
  ORGANIZER_NAME: process.env.ORGANIZER_NAME || "Department of Artificial Intelligence and Data Science",
  
  // Event Schedule & Venue
  EVENT_DATE: process.env.EVENT_DATE || "28 September 2026",
  EVENT_VENUE: process.env.EVENT_VENUE || "MBA Seminar Hall",

  // Fee & Payment Details
  REGISTRATION_FEE: process.env.REGISTRATION_FEE || "₹100",
  PAYMENT_RECEIVER_NAME: "Yalakamani Shameer Taaj",
  PAYMENT_UPI_ID: "7993356216@slc",
  PAYMENT_PHONE_NUMBER: "7993356216",

  // Team restrictions
  TEAM_SIZE: 4, // Team Lead + 3 Members
  
  // Year and Section options
  YEAR_SECTION_OPTIONS: [
    {
      year: "II Year",
      sections: ["Section 1", "Section 2", "Section 3", "Section 4"],
    },
    {
      year: "III Year",
      sections: ["Section 1", "Section 2", "Section 3"],
    },
  ],
};

export type YearSectionOption = typeof EVENT_CONFIG.YEAR_SECTION_OPTIONS[number];
