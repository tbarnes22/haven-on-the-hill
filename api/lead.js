const { Resend } = require("resend");

const ALLOWED_ORIGINS = [
  "https://cnyjiujitsu.com",
  "https://www.cnyjiujitsu.com",
  "https://tbarnes22.github.io",
];

function isAllowedOrigin(origin) {
  if (!origin) return true; // same-origin / non-browser
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) return true;
  return false;
}

function setCors(req, res) {
  const origin = req.headers.origin || "";
  if (origin && isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  } else if (!origin) {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  return null;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

module.exports = async function handler(req, res) {
  setCors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const body = readBody(req);
  if (!body || typeof body !== "object") {
    return res.status(400).json({ ok: false, error: "Invalid JSON body" });
  }

  // Honeypot: pretend success, do not send
  if (String(body._honey || "").trim()) {
    return res.status(200).json({ ok: true });
  }

  const firstName = String(body.firstName || "").trim();
  const lastName = String(body.lastName || "").trim();
  const phone = String(body.phone || "").trim();
  const email = String(body.email || "").trim();
  const forWho = String(body.forWho || "").trim();
  const preferredLocation = String(body.preferredLocation || "").trim();
  const experience = String(body.experience || "").trim();
  const referred = String(body.referred || "").trim();
  const referrer = String(body.referrer || "").trim();

  if (!firstName || !lastName || !phone || !email || !forWho || !preferredLocation || !experience || !referred) {
    return res.status(400).json({ ok: false, error: "Missing required fields" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: "Invalid email" });
  }

  if (referred === "Yes" && !referrer) {
    return res.status(400).json({ ok: false, error: "Missing referrer name" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("lead: RESEND_API_KEY is not configured");
    return res.status(500).json({ ok: false, error: "Email service unavailable" });
  }

  const to = process.env.LEAD_TO_EMAIL || "info@cnyjiujitsu.com";
  const cc = process.env.LEAD_CC_EMAIL || "tbarnes22@gmail.com";
  const from = process.env.LEAD_FROM_EMAIL || "Haven Jiu Jitsu <noreply@cnyjiujitsu.com>";
  const subject = "Haven on the Hill — free class pass";

  const rows = [
    ["First Name", firstName],
    ["Last Name", lastName],
    ["Mobile Phone", phone],
    ["Email", email],
    ["Who is the free class for?", forWho],
    ["Preferred Location", preferredLocation],
    ["Experience Level", experience],
    ["Referred by a Haven member?", referred],
    ["Haven Member Who Referred You", referrer || "—"],
  ];

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;color:#111">
      <h2 style="margin:0 0 12px">Haven on the Hill — free class pass</h2>
      <table style="border-collapse:collapse;width:100%;max-width:640px">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:8px 10px;border:1px solid #ddd;font-weight:700;width:42%">${escapeHtml(label)}</td>
            <td style="padding:8px 10px;border:1px solid #ddd">${escapeHtml(value)}</td>
          </tr>`
          )
          .join("")}
      </table>
    </div>
  `;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      cc: [cc],
      replyTo: email,
      subject,
      text,
      html,
    });

    if (error) {
      console.error("lead: Resend send failed");
      return res.status(500).json({ ok: false, error: "Failed to send email" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("lead: unexpected send error");
    return res.status(500).json({ ok: false, error: "Failed to send email" });
  }
};
