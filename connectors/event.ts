import { z } from "zod";

const getCalendarEventsResponseSchema = z.object({
  data: z.array(z.unknown()).nullable(),
  next_cursor: z.string().optional(),
});

export const getCalendarEvents = async (token: string, grantId: string) => {
  const url = new URL(`https://api.eu.nylas.com/v3/grants/me/events`);
  url.searchParams.append("calendar_id", "primary");
  url.searchParams.append("limit", "5");
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Could not retrieve users");
  }
  const data: unknown = await response.json();

  const result = getCalendarEventsResponseSchema.safeParse(data);
  if (!result.success) {
    throw new Error("Invalid Calendar Event response", {
      cause: result.error,
    });
  }

  return result.data.data;
};
