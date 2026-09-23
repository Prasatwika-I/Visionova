# AI Video Making Event Registration Web Application

A production-ready, futuristic event registration web application built for the **AI Video Making Event**. Features a high-converting student registration interface, official payment QR code scanning, `.PNG` payment proof upload, server-side private Google Sheets & Google Drive storage, confirmation email dispatch, duplicate registration checks, and a secured Admin Dashboard with payment verification.

---

## ✨ Features

- **Futuristic AI Theme**: Dark space palette, cyber grid, neon cyan & electric purple glows, glassmorphism cards, modern typography, and responsive layouts.
- **Structured 4-Step Registration Form**:
  - `01 TEAM LEAD DETAILS`: Validated email, full name, year and section dropdowns (**II Year**: Section 1–4, **III Year**: Section 1–3), roll number, and phone number.
  - `02 TEAM MEMBERS`: 3 required team members (Full name & Roll number). Total squad size = 4.
  - `03 PAYMENT`: Displays official `payment-qr.jpeg`, configurable registration fee, one-click copyable UPI ID, and strict `.PNG` screenshot dropzone (max 5MB).
  - `04 SUBMIT REGISTRATION`: Client & server validation, submission spinner, double-submission prevention.
- **Server-Generated Registration ID**: Unique sequential IDs formatted as `AIVM-001`, `AIVM-002`, etc.
- **Private Google Sheets & Drive Integration**:
  - Automatically writes all 16 columns to your private Google Sheet.
  - Uploads payment screenshot as `[Registration ID]-payment.png` directly into your private Google Drive folder.
  - **Zero Direct Student Access**: Students never see the sheet or drive; all communication happens strictly through server-side APIs.
- **Automated Confirmation Email**: Professional email sent to the Team Lead upon registration.
- **Protected Admin Dashboard (`/admin`)**:
  - Secure JWT session cookie authentication (unauthorized users redirected to `/admin/login`).
  - Stat counters: Total Registrations, Pending Payments, Verified Payments, Rejected Payments.
  - Search & filter by ID, Name, Roll No, Year, Section, and Payment Status.
  - View full squad details & inspect uploaded payment proof.
  - One-click payment status update (**Pending** / **Verified** / **Rejected**) synced to Google Sheets.
  - Export to CSV for organizers.
- **Zero-Config Resilient Local Mode**: Works immediately out of the box with local file persistence before Google Cloud credentials are configured.

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional for local testing)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the student registration portal.  
Access [http://localhost:3000/admin](http://localhost:3000/admin) to log in to the admin console.  
*Default dev login*: `admin@aivideoevent.com` / `Admin@AIEvent2026`

---

## ⚙️ Google Cloud & Service Account Configuration Guide

Follow these steps to connect your private Google Sheet and Google Drive folder:

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown in the top bar and select **New Project**.
3. Name it (e.g. `AI-Video-Event-2026`) and click **Create**.

### Step 2: Enable Google Sheets & Drive APIs
1. In the sidebar, go to **APIs & Services** → **Library**.
2. Search for **Google Sheets API** and click **Enable**.
3. Search for **Google Drive API** and click **Enable**.

### Step 3: Create a Service Account & Download Key
1. Go to **APIs & Services** → **Credentials**.
2. Click **Create Credentials** → **Service Account**.
3. Enter a name (e.g. `sheet-writer`) and click **Done**.
4. Click on the newly created Service Account email.
5. Go to the **Keys** tab → Click **Add Key** → **Create new key** → Choose **JSON**.
6. A JSON file will download. Keep it safe.

### Step 4: Create Private Google Sheet & Drive Folder
1. **Google Sheet**:
   - Create a new Google Sheet named `AI Video Event Registrations`.
   - Copy the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/`**`<GOOGLE_SHEET_ID>`**`/edit`.
   - Click the **Share** button in the top right and share with your Service Account Email (found in the JSON: `xxxx@xxxx.iam.gserviceaccount.com`) with **Editor** permissions.
2. **Google Drive Folder**:
   - Create a folder named `AI Video Event Payment Screenshots`.
   - Copy the Folder ID from the URL: `https://drive.google.com/drive/folders/`**`<GOOGLE_DRIVE_FOLDER_ID>`**.
   - Share this folder with your Service Account Email as **Editor**.

### Step 5: Configure `.env.local`
From your downloaded JSON key, copy:
- `client_email` into `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `private_key` into `GOOGLE_PRIVATE_KEY` (ensure `\n` line breaks are preserved)
- Set `GOOGLE_SHEET_ID` and `GOOGLE_DRIVE_FOLDER_ID`.

---

## 📧 Confirmation Email Configuration (SMTP)

To send real emails to team leads:
1. In `.env.local`, set:
   - `SMTP_HOST="smtp.gmail.com"`
   - `SMTP_PORT=587`
   - `SMTP_USER="your-email@gmail.com"`
   - `SMTP_PASS="your-16-char-app-password"` (generate from [Google Account Security → App Passwords](https://myaccount.google.com/apppasswords))
   - `SMTP_FROM="\"AI Video Making Event\" <your-email@gmail.com>"`

---

## 🔒 Security Architecture

```
Student Browser
      │
      ▼
Next.js Secure API (/api/register)  ◄── Validates form & PNG proof
      │
      ├─► Checks duplicate in Google Sheets
      ├─► Uploads payment PNG to Private Google Drive
      ├─► Appends row to Private Google Sheets
      ├─► Sends confirmation email via SMTP
      │
      ▼
Student Receives Success Response & Registration ID (AIVM-XXX)
```

- **No Public Access**: Google Sheet and Drive are strictly private.
- **No Client Secrets**: Service account credentials and private keys exist only on the server.
- **Admin Isolation**: Admin operations require cryptographic JWT cookie validation.

---

## 📁 Project Structure

```
GoogleForm/
├── public/
│   └── payment-qr.jpeg       # Official payment QR
├── src/
│   ├── app/
│   │   ├── page.tsx           # Futuristic Public Registration Page
│   │   ├── admin/
│   │   │   ├── page.tsx       # Protected Admin Dashboard
│   │   │   └── login/
│   │   │       └── page.tsx   # Admin Login Page
│   │   ├── api/
│   │   │   ├── register/      # Main registration & upload endpoint
│   │   │   ├── admin/         # Admin auth, list, & status endpoints
│   │   │   └── config/        # Public config endpoint
│   │   └── globals.css        # Tailwind & AI neon glow styles
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── RegistrationForm.tsx
│   │   ├── TeamLeadSection.tsx
│   │   ├── TeamMembersSection.tsx
│   │   ├── PaymentSection.tsx
│   │   ├── SuccessModal.tsx
│   │   └── admin/
│   │       ├── AdminDashboard.tsx
│   │       ├── DetailModal.tsx
│   │       └── StatusBadge.tsx
│   └── lib/
│       ├── config.ts          # Centralized event settings
│       ├── googleSheets.ts    # Google Sheets client & duplicate check
│       ├── googleDrive.ts     # Google Drive upload helper
│       ├── email.ts           # Email sender & HTML template
│       ├── auth.ts            # Admin JWT session & passwords
│       └── storageFallback.ts # Local persistence fallback
├── .env.example
├── README.md
└── package.json
```
