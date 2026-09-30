import { getUrl, validateFile } from "../lib/storage";
import { describe, it, expect } from "vitest";
describe("storage", () => {
  it("getUrl", () => {
    expect(getUrl("/uploads/abc.jpg")).toBe("/uploads/abc.jpg");
  });
  it("validateFile menolak tipe salah", () => {
    const file = new File(["x"], "a.txt", { type:"text/plain" });
    Object.defineProperty(file, "size", { value: 1000 });
    expect(()=>validateFile(file)).toThrow("Tipe file");
  });
  it("validateFile menolak >5MB", () => {
    const file = new File(["x"], "a.jpg", { type:"image/jpeg" });
    Object.defineProperty(file, "size", { value: 6*1024*1024 });
    expect(()=>validateFile(file)).toThrow("Maks 5MB");
  });
});
