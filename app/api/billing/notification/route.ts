import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  PLANS,
  addOneMonth,
  mapTransactionStatus,
  verifyMidtransSignature,
} from "@/lib/billing";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const orderId = String(body.order_id ?? "");
  const statusCode = String(body.status_code ?? "");
  const grossAmount = String(body.gross_amount ?? "");
  const signatureHash = String(body.signature_hash ?? "");
  const serverKey = process.env.MIDTRANS_SERVER_KEY;

  if (!orderId || !statusCode || !grossAmount || !signatureHash || !serverKey) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const valid = verifyMidtransSignature(
    { orderId, statusCode, grossAmount, signatureHash },
    serverKey,
  );
  if (!valid) {
    return NextResponse.json({ error: "invalid signature" }, { status: 403 });
  }

  const tx = await prisma.billingTransaction.findUnique({
    where: { midtransOrderId: orderId },
  });
  if (!tx) return NextResponse.json({ status: "ignored" });

  if (Number(grossAmount) !== PLANS[tx.plan].amount) {
    return NextResponse.json({ error: "amount mismatch" }, { status: 403 });
  }

  const transactionStatus = String(body.transaction_status ?? "");
  const fraudStatus = typeof body.fraud_status === "string" ? body.fraud_status : null;
  const mapped = mapTransactionStatus(transactionStatus, fraudStatus);

  const processed = await prisma.$transaction(async (txClient) => {
    const updated = await txClient.billingTransaction.updateMany({
      where: {
        midtransOrderId: orderId,
        status: { in: ["PENDING", "FAILED", "EXPIRED"] },
      },
      data: {
        status: mapped,
        midtransTransactionId:
          typeof body.transaction_id === "string" && body.transaction_id
            ? body.transaction_id
            : tx.midtransTransactionId,
        paymentReference:
          typeof body.payment_type === "string" && body.payment_type
            ? body.payment_type
            : tx.paymentReference,
      },
    });
    if (updated.count === 1 && mapped === "SUCCESS") {
      const now = new Date();
      await txClient.subscription.create({
        data: {
          userId: tx.userId,
          plan: tx.plan,
          status: "ACTIVE",
          startAt: now,
          endAt: addOneMonth(now),
        },
      });
    }
    return updated.count;
  });

  return NextResponse.json({
    status: processed === 0 ? "already-processed" : "ok",
  });
}
