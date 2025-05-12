import { NextResponse } from "next/server";

export async function GET() {
  try {
    const DAILY_API_KEY = process.env.DAILY_API_KEY;

    if (!DAILY_API_KEY) {
      return NextResponse.json(
        { error: "Daily API key not configured" },
        { status: 500 }
      );
    }

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
    };

    const response = await fetch("https://api.daily.co/v1/recordings", options);
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
