import { createHash } from "node:crypto";
import { prisma } from "./prisma";
import type { BillingStatus, Subscription } from "@prisma/client";

export const PLANS = {
  FREE: { label: "FREE", amount: 0, tagline: "Untuk mencoba OrderKu" },
  STARTER: { label: "STARTER", amount: 39000, tagline: "Untuk UMKM yang mulai serius" },
  PRO: { label: "PRO", amount: 79000, tagline: "Untuk usaha dengan order lebih ramai" },
} as const;

export type PlanKey = keyof typeof PLANS;

export function isBillingPlan(v: unknown): v is PlanKey {
  return typeof v === "string" && v in PLANS;
}

export function formatRupiah(amount: number): string {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

export function addOneMonth(from: Date): Date {
  const d = new Date(from.getTime());
  d.setMonth(d.getMonth() + 1);
  return d;
}

export function verifyMidtransSignature(input: {
  orderId: string;
  statusCode: string;
  grossAmount: string;
  signatureHash: string;
}, serverKey: string): boolean {
  if (!input.signatureHash || !serverKey) return false;
  const expected = createHash("sha512")
    .update(input.orderId + input.statusCode + input.grossAmount + serverKey)
    .digest("hex");
  return expected === input.signatureHash;
}

export function mapTransactionStatus(transactionStatus: string, fraudStatus?: string | null): BillingStatus {
  switch (transactionStatus) {
    case "settlement":
      return "SUCCESS";
    case "capture":
      return fraudStatus === "deny" ? "FAILED" : "SUCCESS";
    case "pending":
      return "PENDING";
    case "expire":
      return "EXPIRED";
    case "deny":
    case "cancel":
    case "failure":
      return "FAILED";
    default:
      return "PENDING";
  }
}

export async function getActivePlan(userId: string): Promise<PlanKey> {
  const sub = await prisma.subscription.findFirst({
    where: { userId, status: "ACTIVE", endAt: { gt: new Date() } },
    orderBy: { startAt: "desc" },
  });
  return (sub?.plan as PlanKey | undefined) ?? "FREE";
}

export async function activateSubscription(userId: string, plan: PlanKey): Promise<Subscription> {
  const now = new Date();
  return prisma.subscription.create({
    data: { userId, plan, status: "ACTIVE", startAt: now, endAt: addOneMonth(now) },
  });
}

function midtransApiBase(): string {
  return process.env.MIDTRANS_IS_PRODUCTION === "true"
    ? "https://api.midtrans.com"
    : "https://api.sandbox.midtrans.com";
}

export async function createSnapTransaction(input: {
  orderId: string;
  plan: PlanKey;
  name: string;
  email: string;
}): Promise<{ token: string; redirectUrl: string }> {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey) {
    throw new Error("MIDTRANS_SERVER_KEY belum diatur. Isi .env dengan server key Midtrans Sandbox.");
  }
  const plan = PLANS[input.plan];
  const res = await fetch(`${midtransApiBase()}/snap/v1/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`,
    },
    body: JSON.stringify({
      transaction_details: { order_id: input.orderId, gross_amount: plan.amount },
      item_details: [
        { id: input.plan, price: plan.amount, quantity: 1, name: `OrderKu ${plan.label} (1 bulan)` },
      ],
      customer_details: { first_name: input.name, email: input.email },
      callbacks: { finish: "/billing/status" },
    }),
  });
  if (!res.ok) {
    throw new Error(`Midtrans menolak transaksi (HTTP ${res.status}). Periksa MIDTRANS_SERVER_KEY.`);
  }
  const data = (await res.json()) as { token?: string; redirect_url?: string };
  if (!data.token || !data.redirect_url) {
    throw new Error("Respons Midtrans Snap tidak lengkap.");
  }
  return { token: data.token, redirectUrl: data.redirect_url };
}
