import { defaultConfig } from "../../../../rtvi.config";

export async function POST(req: Request) {
  console.log(req);
  const { DAILY_API_KEY, DAILY_BOTS_URL } = process.env;

  if (!DAILY_API_KEY || !DAILY_BOTS_URL) {
    console.error(
      "Required environment variables are missing",
      DAILY_API_KEY,
      DAILY_BOTS_URL
    );
    return Response.json(
      { error: "Required environment variables are missing" },
      { status: 500 }
    );
  }

  const payload = {
    ...defaultConfig,
  };

  const request = await fetch(DAILY_BOTS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DAILY_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  const response = await request.json();

  if (request.status !== 200) {
    return Response.json({ info: response.error }, { status: request.status });
  }

  return Response.json(response);
}
