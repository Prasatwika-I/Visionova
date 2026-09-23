import fs from "fs";
import path from "path";
import { RegistrationData } from "./types";

const isServerless = process.env.VERCEL || (process.env.NODE_ENV === "production" && process.platform !== "win32");
const DATA_DIR = isServerless ? path.join("/tmp", ".data") : path.join(process.cwd(), ".data");
const REGISTRATIONS_FILE = path.join(DATA_DIR, "registrations.json");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  if (!fs.existsSync(REGISTRATIONS_FILE)) {
    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify([], null, 2));
  }
}

export function getLocalRegistrations(): RegistrationData[] {
  try {
    ensureDataDir();
    const content = fs.readFileSync(REGISTRATIONS_FILE, "utf-8");
    return JSON.parse(content || "[]");
  } catch (e) {
    console.error("Error reading local registrations:", e);
    return [];
  }
}

export function saveLocalRegistration(registration: RegistrationData): void {
  try {
    ensureDataDir();
    const list = getLocalRegistrations();
    list.push(registration);
    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(list, null, 2));
  } catch (e) {
    console.error("Error saving local registration:", e);
  }
}

export function updateLocalPaymentStatus(id: string, status: "Pending" | "Verified" | "Rejected"): boolean {
  try {
    ensureDataDir();
    const list = getLocalRegistrations();
    const index = list.findIndex((r) => r.id === id);
    if (index === -1) return false;
    list[index].paymentStatus = status;
    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(list, null, 2));
    return true;
  } catch (e) {
    console.error("Error updating local payment status:", e);
    return false;
  }
}

export function saveLocalUpload(filename: string, buffer: Buffer): string {
  try {
    ensureDataDir();
    const filePath = path.join(UPLOADS_DIR, filename);
    fs.writeFileSync(filePath, buffer);
    return `/api/view-proof/${filename}`;
  } catch (e) {
    console.error("Error saving local upload:", e);
    return "";
  }
}

export function getLocalUploadPath(filename: string): string | null {
  const filePath = path.join(UPLOADS_DIR, filename);
  if (fs.existsSync(filePath)) {
    return filePath;
  }
  return null;
}
