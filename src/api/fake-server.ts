const BOOKINGS = [
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

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const fakeFetch: typeof fetch = async (input, init) => {
  const url = String(input);
  const method = (init?.method ?? "GET").toUpperCase();

  await new Promise((r) => setTimeout(r, 400));

  if (method !== "GET" || !url.endsWith("/bookings")) {
    return json({ error: "not found" }, 404);
  }

  const mode = process.env.EXPO_PUBLIC_BOOKINGS;
  if (mode === "empty") return json([], 200);
  if (mode === "error") return json({ error: "unavailable" }, 500);
  return json(BOOKINGS, 200);
};
