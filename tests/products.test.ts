import { productSchema, customerSchema } from "../lib/validations";
import { describe, it, expect } from "vitest";
describe("product & customer", () => {
  it("productSchema validasi", () => {
    expect(productSchema.safeParse({name:"Kopi", price:15000, stock:10}).success).toBe(true);
    expect(productSchema.safeParse({name:"", price:-1, stock:-1}).success).toBe(false);
  });
  it("customerSchema validasi", () => {
    expect(customerSchema.safeParse({name:"Budi", wa:"08123456789", address:"Jl"}).success).toBe(true);
    expect(customerSchema.safeParse({name:"", wa:""}).success).toBe(false);
  });
});
