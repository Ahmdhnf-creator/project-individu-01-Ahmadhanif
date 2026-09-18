import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../lib/auth";
import { loginSchema, registerSchema } from "../lib/validations";

describe("auth", () => {
  it("hash dan verify password", async () => {
    const h = await hashPassword("123456");
    expect(await verifyPassword("123456", h)).toBe(true);
    expect(await verifyPassword("wrong", h)).toBe(false);
  });
  it("loginSchema validasi", () => {
    expect(loginSchema.safeParse({email:"a@b.com", password:"123456"}).success).toBe(true);
    expect(loginSchema.safeParse({email:"invalid", password:"123"}).success).toBe(false);
  });
  it("registerSchema validasi", () => {
    expect(registerSchema.safeParse({name:"Budi", email:"budi@mail.com", password:"123456", wa:"08123456789"}).success).toBe(true);
    expect(registerSchema.safeParse({name:"", email:"bad", password:"123", wa:""}).success).toBe(false);
  });
});
