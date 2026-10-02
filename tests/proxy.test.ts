import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "../proxy";

function req(path: string, cookie?: string) {
  return new NextRequest(`http://localhost:3000${path}`, {
    headers: cookie ? { cookie: `session=${cookie}` } : {},
  });
}

function locationPath(res: Response): string | null {
  const loc = res.headers.get("location");
  return loc ? new URL(loc, "http://localhost:3000").pathname : null;
}

describe("proxy: proteksi route aplikasi", () => {
  it("/dashboard tanpa session diarahkan ke /login", () => {
    const res = proxy(req("/dashboard"))!;
    expect(res.status).toBe(307);
    expect(locationPath(res)).toBe("/login");
  });

  it("/products tanpa session diarahkan ke /login", () => {
    const res = proxy(req("/products"))!;
    expect(res.status).toBe(307);
    expect(locationPath(res)).toBe("/login");
  });

  it("/reports tanpa session diarahkan ke /login", () => {
    const res = proxy(req("/reports"))!;
    expect(res.status).toBe(307);
    expect(locationPath(res)).toBe("/login");
  });
});

describe("proxy: halaman auth tidak boleh mem-bounce berdasarkan keberadaan cookie", () => {
  // Cookie "session" bisa basi (mis. sisa migrasi DB / row sudah dihapus),
  // sehingga keberadaan cookie tidak membuktikan session valid.
  it("/login dengan cookie basi tetap membuka halaman login (tidak redirect ke /dashboard)", () => {
    const res = proxy(req("/login", "stale-sid-123"))!;
    expect(locationPath(res)).toBeNull();
    expect(res.status).toBe(200);
  });

  it("/register dengan cookie basi tetap membuka halaman register", () => {
    const res = proxy(req("/register", "stale-sid-123"))!;
    expect(locationPath(res)).toBeNull();
    expect(res.status).toBe(200);
  });

  it("/login tanpa cookie tetap membuka halaman login", () => {
    const res = proxy(req("/login"))!;
    expect(locationPath(res)).toBeNull();
    expect(res.status).toBe(200);
  });
});

describe("proxy: proteksi /billing mempertahankan ?plan=", () => {
  function locationParts(res: Response) {
    const loc = res.headers.get("location");
    const url = new URL(loc ?? "http://localhost:3000/");
    return { pathname: loc ? url.pathname : null, search: loc ? url.search : "" };
  }

  it("/billing/checkout?plan=STARTER tanpa session → /login?plan=STARTER", () => {
    const res = proxy(req("/billing/checkout?plan=STARTER"))!;
    expect(res.status).toBe(307);
    expect(locationParts(res)).toEqual({ pathname: "/login", search: "?plan=STARTER" });
  });

  it("/billing/checkout?plan=PRO dengan session lolos", () => {
    const res = proxy(req("/billing/checkout?plan=PRO", "valid-sid"))!;
    expect(locationPath(res)).toBeNull();
    expect(res.status).toBe(200);
  });

  it("/billing/status tanpa session → /login, query diteruskan", () => {
    const res = proxy(req("/billing/status?order_id=ord-1"))!;
    expect(res.status).toBe(307);
    expect(locationParts(res)).toEqual({ pathname: "/login", search: "?order_id=ord-1" });
  });

  it("/billing/checkout dengan session lolos", () => {
    const res = proxy(req("/billing/checkout?plan=FREE", "valid-sid"))!;
    expect(res.status).toBe(200);
    expect(locationPath(res)).toBeNull();
  });
});
