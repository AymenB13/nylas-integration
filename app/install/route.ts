import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export function GET(request: NextRequest) {
    
  const state = crypto.randomUUID();
    
  const redirectUrl = new URL(`https://api.eu.nylas.com/v3/connect/auth/`);
  redirectUrl.searchParams.append("response_type", "code");
  redirectUrl.searchParams.append("client_id", process.env.NEXT_PUBLIC_NYLAS_CLIENT_ID as string);
  redirectUrl.searchParams.append("redirect_uri", process.env.NEXT_PUBLIC_NYLAS_REDIRECT_URI as string);
    // redirectUrl.searchParams.append("access_type", "online");
  redirectUrl.searchParams.append("prompt", "detect");
  // redirectUrl.searchParams.append("provider", "microsoft");
  // redirectUrl.searchParams.append("state", state);

  // we redirect the user to the installation page of the SaaS application
  redirect(redirectUrl.toString());
}
