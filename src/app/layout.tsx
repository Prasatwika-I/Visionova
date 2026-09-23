import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Visionova — AI Video Making Event | Official Registration",
  description: "Official registration portal for Visionova — AI Video Making Event at Annamacharya Institute of Technology and Sciences, Tirupati. Organized by the Department of AI & DS.",
  keywords: ["Visionova", "AI Video Making", "AITS Tirupati", "AI Film Festival", "Generative AI"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F7F5F0] text-[#111827] font-sans antialiased selection:bg-[#2563EB]/15 selection:text-[#111827]">
        {children}
      </body>
    </html>
  );
}
