import { getToken } from "@/connectors/auth";
import { getCalendarEvents } from "@/connectors/event";

type SetupOrganisationParams = {
  code: string;
};

export const setupOrganisation = async ({ code }: SetupOrganisationParams) => {
  // retrieve token from SaaS API using the given code
  const { accessToken, grantId } = await getToken(code);

  const events = await getCalendarEvents(accessToken, grantId);
  console.log("events:", events);
};
