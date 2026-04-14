import crypto from "crypto";
import axios from "axios";

const PAYNOW_INIT_URL = "https://www.paynow.co.zw/interface/initiatetransaction";
const PAYNOW_MOBILE_URL = "https://www.paynow.co.zw/interface/remotetransaction";

export const PLAN_INFO: Record<string, { name: string; price: number; chats: number; images: number; pdfs: number; downloads: string }> = {
  free:    { name: "Free",    price: 0,  chats: 25,    images: 3,  pdfs: 1,  downloads: "10/day" },
  starter: { name: "Starter", price: 1,  chats: 75,    images: 8,  pdfs: 3,  downloads: "Unlimited" },
  basic:   { name: "Basic",   price: 3,  chats: 300,   images: 20, pdfs: 10, downloads: "Unlimited" },
  pro:     { name: "Pro",     price: 10, chats: 1000,  images: 50, pdfs: 50, downloads: "Unlimited" },
  premium: { name: "Premium", price: 20, chats: -1,    images: -1, pdfs: -1, downloads: "Unlimited" },
};

function sha512Hash(data: string): string {
  return crypto.createHash("sha512").update(data).digest("hex").toUpperCase();
}

function buildHash(fields: Record<string, string>, integrationKey: string): string {
  const values = Object.values(fields).join("") + integrationKey;
  return sha512Hash(values);
}

export async function initiateWebPayment(opts: {
  integrationId: string;
  integrationKey: string;
  reference: string;
  email: string;
  planName: string;
  amount: number;
  returnUrl: string;
  resultUrl: string;
}): Promise<{ success: boolean; redirectUrl?: string; pollUrl?: string; error?: string }> {
  const fields: Record<string, string> = {
    id: opts.integrationId,
    reference: opts.reference,
    amount: opts.amount.toFixed(2),
    additionalinfo: `FUNDO AI ${opts.planName} Plan`,
    returnurl: opts.returnUrl,
    resulturl: opts.resultUrl,
    status: "Message",
    authemail: opts.email,
  };

  fields.hash = buildHash(fields, opts.integrationKey);

  try {
    const res = await axios.post(PAYNOW_INIT_URL, new URLSearchParams(fields).toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      timeout: 15000,
    });

    const parsed = Object.fromEntries(new URLSearchParams(res.data as string));

    if (parsed["status"]?.toLowerCase() === "ok") {
      return {
        success: true,
        redirectUrl: parsed["browserurl"],
        pollUrl: parsed["pollurl"],
      };
    }

    return { success: false, error: parsed["error"] || "Payment initiation failed" };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

export async function initiateEcoCashPayment(opts: {
  integrationId: string;
  integrationKey: string;
  reference: string;
  email: string;
  planName: string;
  amount: number;
  phone: string;
  returnUrl: string;
  resultUrl: string;
}): Promise<{ success: boolean; pollUrl?: string; instructions?: string; error?: string }> {
  const fields: Record<string, string> = {
    id: opts.integrationId,
    reference: opts.reference,
    amount: opts.amount.toFixed(2),
    additionalinfo: `FUNDO AI ${opts.planName} Plan`,
    returnurl: opts.returnUrl,
    resulturl: opts.resultUrl,
    status: "Message",
    authemail: opts.email,
    phone: opts.phone,
    method: "ecocash",
  };

  fields.hash = buildHash(fields, opts.integrationKey);

  try {
    const res = await axios.post(PAYNOW_MOBILE_URL, new URLSearchParams(fields).toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      timeout: 15000,
    });

    const parsed = Object.fromEntries(new URLSearchParams(res.data as string));

    if (parsed["status"]?.toLowerCase() === "ok" || parsed["status"]?.toLowerCase() === "sent") {
      return {
        success: true,
        pollUrl: parsed["pollurl"],
        instructions: parsed["instructions"] || `Check your EcoCash on ${opts.phone} to approve $${opts.amount.toFixed(2)} payment.`,
      };
    }

    return { success: false, error: parsed["error"] || "EcoCash payment initiation failed" };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

export async function pollPaymentStatus(pollUrl: string): Promise<{ paid: boolean; status: string }> {
  try {
    const res = await axios.post(pollUrl, "", {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      timeout: 10000,
    });
    const parsed = Object.fromEntries(new URLSearchParams(res.data as string));
    const status = parsed["status"]?.toLowerCase() || "";
    return { paid: status === "paid" || status === "awaiting delivery", status };
  } catch {
    return { paid: false, status: "error" };
  }
}
