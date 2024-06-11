import { z } from "zod";

const tokenResponseSchema = z.object({
  access_token: z.string(),
  grant_id: z.string(),
});

export const getToken = async (code: string) => {
  console.log("code:", code);
  const response = await fetch(`https://api.eu.nylas.com/v3/connect/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_NYLAS_CLIENT_ID as string,
      client_secret: process.env.NEXT_PUBLIC_NYLAS_CLIENT_SECRET as string,
      grant_type: "authorization_code",
      redirect_uri: process.env.NEXT_PUBLIC_NYLAS_REDIRECT_URI as string,
      code,
      code_verifier: "nylas",
    }),
  });

  if (!response.ok) {
    throw new Error("Could not retrieve token");
  }

  const data: unknown = await response.json();

  const result = tokenResponseSchema.safeParse(data);

  if (!result.success) {
    throw new Error("Invalid Jira token response");
  }

  return {
    accessToken: result.data.access_token,
    grantId: result.data.grant_id,
  };
};
