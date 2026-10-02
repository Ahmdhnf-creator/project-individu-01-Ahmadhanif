import { describe, it, expect } from "vitest";
import { createHash } from "node:crypto";
import {
  PLANS,
  isBillingPlan,
  formatRupiah,
  addOneMonth,
  verifyMidtransSignature,
  mapTransactionStatus,
} from "../lib/billing";

describe("katalog paket billing", () => {
  it("harga sesuai spesifikasi", () => {
    expect(PLANS.FREE.amount).toBe(0);
    expect(PLANS.STARTER.amount).toBe(39000);
    expect(PLANS.PRO.amount).toBe(79000);
  });

  it("format rupiah mudah dibaca", () => {
    expect(formatRupiah(0)).toBe("Rp0");
    expect(formatRupiah(39000)).toBe("Rp39.000");
    expect(formatRupiah(79000)).toBe("Rp79.000");
  });

  it("validasi plan", () => {
    expect(isBillingPlan("FREE")).toBe(true);
    expect(isBillingPlan("STARTER")).toBe(true);
    expect(isBillingPlan("PRO")).toBe(true);
    expect(isBillingPlan("ENTERPRISE")).toBe(false);
    expect(isBillingPlan(undefined)).toBe(false);
    expect(isBillingPlan(39000)).toBe(false);
  });
});

describe("periode subscription", () => {
  it("satu bulan ke depan", () => {
    const start = new Date("2026-01-15T10:00:00.000Z");
    const end = addOneMonth(start);
    expect(end.getFullYear()).toBe(2026);
    expect(end.getMonth()).toBe(1);
    expect(end.getDate()).toBe(15);
  });
});

describe("verifikasi signature notifikasi Midtrans", () => {
  const serverKey = "SB-Mid-server-dummy";
  const orderId = "ord-abc-123";
  const statusCode = "200";
  const grossAmount = "39000";
  const goodSig = createHash("sha512")
    .update(orderId + statusCode + grossAmount + serverKey)
    .digest("hex");

  it("signature valid diterima", () => {
    expect(
      verifyMidtransSignature(
        { orderId, statusCode, grossAmount, signatureHash: goodSig },
        serverKey,
      ),
    ).toBe(true);
  });

  it("signature palsu ditolak", () => {
    expect(
      verifyMidtransSignature(
        { orderId, statusCode, grossAmount, signatureHash: "a".repeat(128) },
        serverKey,
      ),
    ).toBe(false);
  });

  it("server key berbeda membuat signature tidak cocok", () => {
    expect(
      verifyMidtransSignature(
        { orderId, statusCode, grossAmount, signatureHash: goodSig },
        "kunci-lain",
      ),
    ).toBe(false);
  });

  it("order_id dimanipulasi membuat signature tidak cocok", () => {
    expect(
      verifyMidtransSignature(
        { orderId: "ord-hacked", statusCode, grossAmount, signatureHash: goodSig },
        serverKey,
      ),
    ).toBe(false);
  });
});

describe("pemetaan status transaksi Midtrans", () => {
  it("settlement/capture → SUCCESS", () => {
    expect(mapTransactionStatus("settlement")).toBe("SUCCESS");
    expect(mapTransactionStatus("capture", "accept")).toBe("SUCCESS");
    expect(mapTransactionStatus("capture")).toBe("SUCCESS");
  });

  it("capture fraud deny → FAILED", () => {
    expect(mapTransactionStatus("capture", "deny")).toBe("FAILED");
  });

  it("pending → PENDING (belum aktif)", () => {
    expect(mapTransactionStatus("pending")).toBe("PENDING");
  });

  it("expire → EXPIRED", () => {
    expect(mapTransactionStatus("expire")).toBe("EXPIRED");
  });

  it("deny/cancel/failure → FAILED", () => {
    expect(mapTransactionStatus("deny")).toBe("FAILED");
    expect(mapTransactionStatus("cancel")).toBe("FAILED");
    expect(mapTransactionStatus("failure")).toBe("FAILED");
  });

  it("status tak dikenal → PENDING (tidak pernah mengaktifkan)", () => {
    expect(mapTransactionStatus("something-new")).toBe("PENDING");
  });
});
