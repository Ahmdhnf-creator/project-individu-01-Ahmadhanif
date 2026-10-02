"use server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  PLANS,
  activateSubscription,
  createSnapTransaction,
  getActivePlan,
  isBillingPlan,
} from "@/lib/billing";

async function resolveBillingUser(plan: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?plan=${encodeURIComponent(plan)}`);
  if (!isBillingPlan(plan)) redirect("/");
  return user;
}

export async function activateFreePlan(formData: FormData) {
  const plan = String(formData.get("plan") ?? "");
  const user = await resolveBillingUser(plan);
  if (plan !== "FREE") redirect(`/billing/checkout?plan=${plan}`);
  const activePlan = await getActivePlan(user.id);
  if (activePlan !== "FREE") redirect(`/billing/checkout?plan=${activePlan}`);
  const existing = await prisma.subscription.findFirst({
    where: { userId: user.id, status: "ACTIVE", plan: "FREE", endAt: { gt: new Date() } },
  });
  if (!existing) await activateSubscription(user.id, "FREE");
  redirect("/dashboard");
}

export type StartPaymentResult =
  | { ok: true; orderId: string; token: string }
  | { ok: false; error: string };

export async function startPayment(plan: string): Promise<StartPaymentResult> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?plan=${encodeURIComponent(plan ?? "")}`);
  if (!isBillingPlan(plan) || plan === "FREE") return { ok: false, error: "Paket tidak valid" };
  const orderId = `ord-${crypto.randomUUID()}`;
  let token: string;
  let redirectUrl: string;
  try {
    const snap = await createSnapTransaction({
      orderId,
      plan,
      name: user.name,
      email: user.email,
    });
    token = snap.token;
    redirectUrl = snap.redirectUrl;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Gagal memulai pembayaran" };
  }
  await prisma.billingTransaction.create({
    data: {
      userId: user.id,
      plan,
      amount: PLANS[plan].amount,
      status: "PENDING",
      midtransOrderId: orderId,
      snapToken: token,
      snapRedirectUrl: redirectUrl,
    },
  });
  return { ok: true, orderId, token };
}
