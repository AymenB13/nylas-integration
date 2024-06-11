import { RedirectType, redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { setupOrganisation } from "./service";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  // const clientId = process.env.NEXT_PUBLIC_NYLAS_CLIENT_ID;
  // const clientSecret = process.env.NYLAS_CLIENT_SECRET;
  // const redirectUri = process.env.NYLAS_REDIRECT_URI;

  if (!code) {
    return NextResponse.json({ error: 'Authorization code is missing' }, { status: 400 });
  }

  await setupOrganisation({ code });

  redirect(process.env.NEXT_PUBLIC_MY_REDIRECT_URL as string, RedirectType.replace);
}
