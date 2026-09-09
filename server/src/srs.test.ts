import { describe, expect, it } from "vitest";
import { addDays, intervalDaysForStrength, isDue, nextStrength } from "./srs.js";

describe("nextStrength", () => {
  it("increases strength on a strong attempt", () => {
    expect(nextStrength(2, 85)).toBe(3);
  });

  it("caps strength at the max level", () => {
    expect(nextStrength(5, 100)).toBe(5);
  });

  it("decreases strength on a weak attempt", () => {
    expect(nextStrength(3, 40)).toBe(2);
  });

  it("floors strength at the min level", () => {
    expect(nextStrength(1, 10)).toBe(1);
  });

  it("leaves strength unchanged for a middling attempt", () => {
    expect(nextStrength(3, 65)).toBe(3);
  });
});

describe("intervalDaysForStrength", () => {
  it("widens the interval as strength increases", () => {
    const days = [1, 2, 3, 4, 5].map(intervalDaysForStrength);
    for (let i = 1; i < days.length; i++) {
      expect(days[i]).toBeGreaterThan(days[i - 1]);
    }
  });

  it("clamps out-of-range strengths", () => {
    expect(intervalDaysForStrength(0)).toBe(intervalDaysForStrength(1));
    expect(intervalDaysForStrength(9)).toBe(intervalDaysForStrength(5));
  });
});

describe("isDue", () => {
  it("is due when the due date has passed", () => {
    const now = new Date("2026-09-08T08:00:00Z");
    expect(isDue(new Date("2026-09-07T08:00:00Z"), now)).toBe(true);
    expect(isDue(now, now)).toBe(true);
  });

  it("is not due when the due date is in the future", () => {
    const now = new Date("2026-09-08T08:00:00Z");
    expect(isDue(addDays(now, 1), now)).toBe(false);
  });
});
