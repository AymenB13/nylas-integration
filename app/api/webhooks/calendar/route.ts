import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { extractTopLevelProperties } from "@/utils/extract";

const WEBHOOK_SECRET = process.env.NEXT_PUBLIC_NYLAS_WEBHOOK_SECRET; // Ensure this is set in your environment variables

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.text(); // Get the raw request body
  const signature = request.headers.get("x-nylas-signature");
  console.log("signature:", signature);

  if (!signature || !WEBHOOK_SECRET) {
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  }

  // Verify the signature
  const hash = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(body)
    .digest("hex");

  console.log("hash:", hash);

  // if (hash !== signature) {
  //   return new NextResponse("Invalid signature", {
  //     status: 401,
  //   });
  // }

  // Process the webhook event
  const event = JSON.parse(body);

  let sendData = null;
  if (event.type === "event.created") {
    sendData = event.data;
    console.log("event.created sendData:", sendData);
    sendData = { ...sendData, type: event.type };
  }
  if (!process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL) {
    return new NextResponse("Invalid googesheet webhook url", {
      status: 404,
    });
  }
  const send = await extractTopLevelProperties(event);
  console.log("send:", send);
  // Send the webhook data to Google Sheets
  const response = await fetch(
    process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(send),
    }
  );

  if (!response.ok) {
    console.error("Failed to send data to Google Sheets:", response.statusText);
    return new NextResponse("Failed to send data to Google Sheets", {
      status: 500,
    });
  }

  // Respond with 200 status to acknowledge receipt
  return new NextResponse("Webhook received and forwarded to Google Sheets", {
    status: 200,
  });
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  // Extract the challenge query parameter from the request URL
  const url = new URL(request.url);
  const challenge = url.searchParams.get("challenge");
  // const body = await request.text(); // Get the raw request body
  console.log("challenge:", challenge);
  // Return the challenge parameter value in the response body
  if (challenge) {
    return new NextResponse(challenge, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  return new NextResponse("Challenge parameter missing", {
    status: 400,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
