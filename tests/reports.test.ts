import { groupByPeriod } from "../lib/reports";
import { describe, it, expect } from "vitest";
describe("reports", () => {
  it("groupByPeriod harian", () => {
    const data = [{total:10000, createdAt:new Date("2026-09-10")},{total:20000, createdAt:new Date("2026-09-10")},{total:5000, createdAt:new Date("2026-09-11")}];
    const res = groupByPeriod(data, "harian");
    expect(res.find(r=>r.label==="2026-09-10")?.total).toBe(30000);
    expect(res.find(r=>r.label==="2026-09-11")?.total).toBe(5000);
  });
  it("groupByPeriod bulanan", () => {
    const data = [{total:10000, createdAt:new Date("2026-09-10")},{total:20000, createdAt:new Date("2026-10-01")}];
    const res = groupByPeriod(data, "bulanan");
    expect(res.find(r=>r.label==="2026-09")?.total).toBe(10000);
    expect(res.find(r=>r.label==="2026-10")?.total).toBe(20000);
  });
});
