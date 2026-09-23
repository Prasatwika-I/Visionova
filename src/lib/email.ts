import nodemailer from "nodemailer";
import { RegistrationData } from "./types";
import { EVENT_CONFIG } from "./config";

function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  // If using Gmail, nodemailer's built-in service preset ensures optimal TLS configuration
  if (host === "smtp.gmail.com" || (user && user.endsWith("@gmail.com"))) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendConfirmationEmail(data: RegistrationData): Promise<{ sent: boolean; message?: string }> {
  const transporter = getTransporter();

  const statusLabel = data.paymentStatus === "Verified"
    ? "Verified ✓"
    : data.paymentStatus === "Rejected"
    ? "Rejected ✗"
    : "Pending Verification";

  const statusColor = data.paymentStatus === "Verified"
    ? "#10b981"
    : data.paymentStatus === "Rejected"
    ? "#f43f5e"
    : "#f59e0b";

  const plainText = `Dear ${data.teamLeadName},

Your team has been successfully registered for the ${EVENT_CONFIG.EVENT_NAME}.

Registration ID:
${data.id}

Team Lead:
${data.teamLeadName}

Year:
${data.year}

Section:
${data.section}

Team Members:
1. ${data.member1Name} — ${data.member1Roll}
2. ${data.member2Name} — ${data.member2Roll}
3. ${data.member3Name} — ${data.member3Roll}

Payment Status:
${statusLabel}

Please keep your Registration ID for future reference.

Thank you for participating!

${EVENT_CONFIG.EVENT_NAME} Team`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #e2e8f0; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background: #131b2e; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%); padding: 32px 24px; text-align: center; }
    .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; }
    .header p { margin: 6px 0 0 0; color: #e0f2fe; font-size: 14px; }
    .content { padding: 32px 24px; line-height: 1.6; }
    .reg-badge { display: inline-block; background: rgba(14, 165, 233, 0.15); border: 1px solid #0ea5e9; color: #38bdf8; padding: 8px 16px; border-radius: 8px; font-size: 18px; font-weight: 700; letter-spacing: 1px; margin: 12px 0; }
    .card { background: #0c1222; border: 1px solid #1e293b; border-radius: 8px; padding: 18px; margin: 16px 0; }
    .card-title { font-size: 13px; text-transform: uppercase; color: #94a3b8; letter-spacing: 1px; margin-bottom: 10px; font-weight: 600; }
    .member-item { background: #172033; padding: 10px 14px; border-radius: 6px; margin-bottom: 6px; font-size: 14px; color: #cbd5e1; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${EVENT_CONFIG.EVENT_NAME}</h1>
      <p>Registration Confirmed</p>
    </div>
    <div class="content">
      <p>Dear <strong>${data.teamLeadName}</strong>,</p>
      <p>Your team has been successfully registered for the <strong>${EVENT_CONFIG.EVENT_NAME}</strong>.</p>
      
      <div style="text-align: center; margin: 20px 0;">
        <span style="font-size: 12px; color: #94a3b8; display: block; margin-bottom: 4px;">YOUR REGISTRATION ID</span>
        <div class="reg-badge">${data.id}</div>
      </div>

      <div class="card">
        <div class="card-title">Team Lead Details</div>
        <div style="color: #f1f5f9; font-size: 14px; margin-bottom: 4px;"><strong>Name:</strong> ${data.teamLeadName}</div>
        <div style="color: #f1f5f9; font-size: 14px; margin-bottom: 4px;"><strong>Roll Number:</strong> ${data.teamLeadRollNumber}</div>
        <div style="color: #f1f5f9; font-size: 14px; margin-bottom: 4px;"><strong>Year & Section:</strong> ${data.year} — ${data.section}</div>
        <div style="color: #f1f5f9; font-size: 14px;"><strong>Phone:</strong> ${data.teamLeadPhone}</div>
      </div>

      <div class="card">
        <div class="card-title">Team Members (3)</div>
        <div class="member-item">1. <strong>${data.member1Name}</strong> — ${data.member1Roll}</div>
        <div class="member-item">2. <strong>${data.member2Name}</strong> — ${data.member2Roll}</div>
        <div class="member-item">3. <strong>${data.member3Name}</strong> — ${data.member3Roll}</div>
      </div>

      <div class="card">
        <div class="card-title">Payment Verification Status</div>
        <div style="font-size: 15px;">Status: <strong style="color: ${statusColor};">${statusLabel}</strong></div>
      </div>

      <p style="font-size: 14px; color: #94a3b8; margin-top: 24px;">Please keep your Registration ID for future reference during the event check-in.</p>
      <p style="font-size: 14px; color: #f1f5f9;">Thank you for participating!<br/><strong>${EVENT_CONFIG.EVENT_NAME} Team</strong></p>
    </div>
    <div class="footer">
      This is an automated confirmation email for ${EVENT_CONFIG.EVENT_NAME}.
    </div>
  </div>
</body>
</html>
  `;

  if (!transporter) {
    console.log(`[DEV MODE] Email service not configured. Confirmation email for ${data.teamLeadEmail} logged:\n${plainText}`);
    return { sent: true, message: "Logged locally in dev mode" };
  }

  try {
    const fromAddress = process.env.SMTP_FROM || `"${EVENT_CONFIG.EVENT_NAME}" <${process.env.SMTP_USER}>`;
    await transporter.sendMail({
      from: fromAddress,
      to: data.teamLeadEmail,
      subject: `${EVENT_CONFIG.EVENT_NAME} — Registration Confirmed (${data.id})`,
      text: plainText,
      html: htmlContent,
    });
    console.log(`[EMAIL DISPATCH] Confirmation email sent successfully to ${data.teamLeadEmail} (ID: ${data.id})`);
    return { sent: true };
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send confirmation email to ${data.teamLeadEmail}:`, error);
    return { sent: false, message: "Failed to send email via SMTP" };
  }
}

// Send dedicated Payment Status Update email when Admin verifies or rejects
export async function sendPaymentStatusEmail(
  data: RegistrationData,
  newStatus: "Verified" | "Rejected" | "Pending"
): Promise<{ sent: boolean; message?: string }> {
  const transporter = getTransporter();
  if (!transporter) {
    return { sent: false, message: "Email transporter not configured" };
  }

  const isVerified = newStatus === "Verified";
  const isRejected = newStatus === "Rejected";

  const statusLabel = isVerified ? "VERIFIED ✓" : isRejected ? "REJECTED ✗" : "PENDING";
  const statusColor = isVerified ? "#10b981" : isRejected ? "#f43f5e" : "#f59e0b";
  const subjectStatus = isVerified ? "Payment Verified ✓" : isRejected ? "Payment Verification Update" : "Payment Status Update";

  const messageNotice = isVerified
    ? `Great news! Your squad's registration fee payment of ₹100 has been verified by the event organizers. Your team is officially confirmed to compete at ${EVENT_CONFIG.EVENT_NAME} on ${EVENT_CONFIG.EVENT_DATE} at ${EVENT_CONFIG.EVENT_VENUE}.`
    : isRejected
    ? `Your payment screenshot could not be verified by the organizers. Please ensure your transaction reference (UTR) is clear and contact the event coordinators for assistance.`
    : `Your payment status is currently under review by the event organizers.`;

  const plainText = `Dear ${data.teamLeadName},

${subjectStatus} for ${EVENT_CONFIG.EVENT_NAME}

Registration ID: ${data.id}
Status: ${statusLabel}

${messageNotice}

Team Details:
- Team Lead: ${data.teamLeadName} (${data.teamLeadRollNumber})
- Year & Section: ${data.year} — ${data.section}
- Members:
  1. ${data.member1Name} (${data.member1Roll})
  2. ${data.member2Name} (${data.member2Roll})
  3. ${data.member3Name} (${data.member3Roll})

Venue: ${EVENT_CONFIG.EVENT_VENUE}
Date: ${EVENT_CONFIG.EVENT_DATE}

${EVENT_CONFIG.EVENT_NAME} Team`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #e2e8f0; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background: #131b2e; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; }
    .header { background: ${isVerified ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : isRejected ? 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)' : 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)'}; padding: 32px 24px; text-align: center; }
    .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; }
    .header p { margin: 6px 0 0 0; color: #ffffff; font-size: 15px; font-weight: 600; }
    .content { padding: 32px 24px; line-height: 1.6; }
    .status-badge { display: inline-block; background: ${isVerified ? 'rgba(16, 185, 129, 0.15)' : isRejected ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)'}; border: 1px solid ${statusColor}; color: ${statusColor}; padding: 10px 20px; border-radius: 8px; font-size: 18px; font-weight: 800; letter-spacing: 1px; margin: 12px 0; }
    .card { background: #0c1222; border: 1px solid #1e293b; border-radius: 8px; padding: 18px; margin: 16px 0; }
    .card-title { font-size: 13px; text-transform: uppercase; color: #94a3b8; letter-spacing: 1px; margin-bottom: 10px; font-weight: 600; }
    .member-item { background: #172033; padding: 10px 14px; border-radius: 6px; margin-bottom: 6px; font-size: 14px; color: #cbd5e1; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${EVENT_CONFIG.EVENT_NAME}</h1>
      <p>${subjectStatus}</p>
    </div>
    <div class="content">
      <p>Dear <strong>${data.teamLeadName}</strong>,</p>
      
      <div style="text-align: center; margin: 20px 0;">
        <span style="font-size: 12px; color: #94a3b8; display: block; margin-bottom: 4px;">REGISTRATION ID: ${data.id}</span>
        <div class="status-badge">${statusLabel}</div>
      </div>

      <p style="font-size: 15px; color: #f1f5f9; background: #0c1222; border-left: 4px solid ${statusColor}; padding: 14px 18px; border-radius: 4px;">
        ${messageNotice}
      </p>

      <div class="card">
        <div class="card-title">Confirmed Squad Details</div>
        <div style="color: #f1f5f9; font-size: 14px; margin-bottom: 4px;"><strong>Lead:</strong> ${data.teamLeadName} (${data.teamLeadRollNumber})</div>
        <div style="color: #f1f5f9; font-size: 14px; margin-bottom: 4px;"><strong>Year & Section:</strong> ${data.year} — ${data.section}</div>
        <div style="color: #f1f5f9; font-size: 14px;"><strong>Event Date:</strong> ${EVENT_CONFIG.EVENT_DATE}</div>
        <div style="color: #f1f5f9; font-size: 14px;"><strong>Venue:</strong> ${EVENT_CONFIG.EVENT_VENUE}</div>
      </div>

      <div class="card">
        <div class="card-title">Team Members (3)</div>
        <div class="member-item">1. <strong>${data.member1Name}</strong> — ${data.member1Roll}</div>
        <div class="member-item">2. <strong>${data.member2Name}</strong> — ${data.member2Roll}</div>
        <div class="member-item">3. <strong>${data.member3Name}</strong> — ${data.member3Roll}</div>
      </div>

      <p style="font-size: 14px; color: #94a3b8; margin-top: 24px;">Please present your Registration ID (<strong>${data.id}</strong>) at the venue entrance.</p>
      <p style="font-size: 14px; color: #f1f5f9;">Best of luck in the challenge!<br/><strong>${EVENT_CONFIG.EVENT_NAME} Team</strong></p>
    </div>
    <div class="footer">
      Official notification from ${EVENT_CONFIG.EVENT_NAME} • ${EVENT_CONFIG.COLLEGE_NAME}
    </div>
  </div>
</body>
</html>
  `;

  try {
    const fromAddress = process.env.SMTP_FROM || `"${EVENT_CONFIG.EVENT_NAME}" <${process.env.SMTP_USER}>`;
    await transporter.sendMail({
      from: fromAddress,
      to: data.teamLeadEmail,
      subject: `${EVENT_CONFIG.EVENT_NAME} — ${subjectStatus} (${data.id})`,
      text: plainText,
      html: htmlContent,
    });
    console.log(`[EMAIL STATUS UPDATE] Sent ${newStatus} notification email to ${data.teamLeadEmail} (ID: ${data.id})`);
    return { sent: true };
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send status update email to ${data.teamLeadEmail}:`, error);
    return { sent: false, message: "Failed to send status update email" };
  }
}
