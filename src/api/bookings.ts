import { fakeFetch } from "./fake-server";

export type Booking = {
  id: string;
  title: string;
  startsAt: string;
  timezone: string;
};

const BASE = process.env.EXPO_PUBLIC_API_URL ?? "https://fake.local";

// Real fetch when EXPO_PUBLIC_API_URL is set, otherwise the in-app fake.
export const apiFetch: typeof fetch = process.env.EXPO_PUBLIC_API_URL
  ? fetch
  : fakeFetch;

const isNonEmpty = (v: unknown): v is string =>
  typeof v === "string" && v.trim() !== "";

function isValidBooking(row: any): row is Booking {
  return (
    !!row &&
    isNonEmpty(row.id) &&
    isNonEmpty(row.title) &&
    isNonEmpty(row.timezone) &&
    isNonEmpty(row.startsAt) &&
    !Number.isNaN(Date.parse(row.startsAt))
  );
}

export async function fetchBookings(
  fetchFn: typeof fetch = fetch,
): Promise<Booking[]> {
  const res = await fetchFn(`${BASE}/bookings`, { method: "GET" });
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("Unexpected response shape");
  }
  return data.filter(isValidBooking);
}
