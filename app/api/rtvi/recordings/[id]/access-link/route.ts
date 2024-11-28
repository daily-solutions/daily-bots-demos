import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split("/")[4];

  console.log("----- id:", id);

  try {
    const DAILY_BOTS_API_KEY = process.env.DAILY_BOTS_API_KEY;

    if (!DAILY_BOTS_API_KEY) {
      return NextResponse.json(
        { error: "Daily API key not configured" },
        { status: 500 }
      );
    }

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${DAILY_BOTS_API_KEY}`,
      },
    };

    const response = await fetch(
      `https://api.daily.co/v1/recordings/${id}/access-link`,
      options
    );
    const data = await response.json();

    console.log("Recordings response:", data);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch recordings: ${error}` },
      { status: 500 }
    );
  }
}
