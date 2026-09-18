import { canTransition, calculateTotal, getNextStatuses } from "../lib/order";
import { describe, it, expect } from "vitest";
describe("order state machine", () => {
  it("canTransition", () => {
    expect(canTransition("BARU","DIPROSES")).toBe(true);
    expect(canTransition("BARU","DIKIRIM")).toBe(false);
    expect(canTransition("DIPROSES","DIKIRIM")).toBe(true);
    expect(canTransition("DIKIRIM","SELESAI")).toBe(true);
    expect(canTransition("SELESAI","BATAL")).toBe(false);
    expect(canTransition("BARU","BATAL")).toBe(true);
    expect(canTransition("DIPROSES","BATAL")).toBe(true);
    expect(canTransition("DIKIRIM","BATAL")).toBe(false);
  });
  it("getNextStatuses", () => {
    expect(getNextStatuses("BARU")).toEqual(expect.arrayContaining(["DIPROSES","BATAL"]));
    expect(getNextStatuses("SELESAI")).toEqual([]);
  });
  it("calculateTotal", () => {
    expect(calculateTotal([{price:10000,qty:2},{price:5000,qty:3}])).toBe(35000);
    expect(calculateTotal([])).toBe(0);
  });
});
