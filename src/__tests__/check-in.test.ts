import { canCheckIn } from "../lib/check-in";

const startsAt = new Date("2026-06-01T15:00:00.000Z");

describe("canCheckIn", () => {
  it("is false 16 minutes before", () => {
    expect(canCheckIn(new Date("2026-06-01T14:44:00.000Z"), startsAt)).toBe(
      false,
    );
  });
  it("is true exactly 15 minutes before", () => {
    expect(canCheckIn(new Date("2026-06-01T14:45:00.000Z"), startsAt)).toBe(
      true,
    );
  });
  it("is true at start time", () => {
    expect(canCheckIn(new Date("2026-06-01T15:00:00.000Z"), startsAt)).toBe(
      true,
    );
  });
});
