import { fetchBookings } from "../api/bookings";

const stub = (status: number, body: unknown) =>
  (async () => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  })) as unknown as typeof fetch;

const body = [
  {
    id: "studio",
    title: "Studio visit",
    startsAt: "2026-06-01T15:00:00.000Z",
    timezone: "America/New_York",
  },
  {
    id: "site",
    title: "Site walkthrough",
    startsAt: "2026-06-01T18:00:00.000Z",
    timezone: "America/Los_Angeles",
  },
  { id: "broken", title: "Broken row" },
  {
    id: "review",
    title: "Plan review",
    startsAt: "2026-06-01T14:00:00.000Z",
    timezone: "Europe/London",
  },
];

describe("fetchBookings", () => {
  it("skips invalid rows", async () => {
    const result = await fetchBookings(stub(200, body));
    expect(result).toHaveLength(3);
    expect(result.some((b) => b.id === "broken")).toBe(false);
  });

  it("throws on HTTP 500", async () => {
    await expect(
      fetchBookings(stub(500, { error: "unavailable" })),
    ).rejects.toThrow();
  });
});
