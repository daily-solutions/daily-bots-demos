import {
  api_keys,
  bot_profile,
  getDefaultConfig,
  max_duration,
  service_options,
  services,
  webhook_tools,
} from "@/rtvi.config";

export async function POST(req: Request) {
  const { DAILY_BOTS_API_KEY, DAILY_BOTS_URL, OPENAI_API_KEY } = process.env;

  if (!DAILY_BOTS_API_KEY || !DAILY_BOTS_URL || !OPENAI_API_KEY) {
    console.error(
      "Required environment variables are missing",
      DAILY_BOTS_API_KEY,
      DAILY_BOTS_URL,
      OPENAI_API_KEY
    );
    return Response.json(
      { error: "Required environment variables are missing" },
      { status: 500 }
    );
  }

  const jsonReq = await req.json();

  const { callId, phoneNumber = "" } = jsonReq;

  const payload = {
    bot_profile,
    max_duration,
    services,
    api_keys,
    config: getDefaultConfig(callId, phoneNumber),
    webhook_tools,
    service_options,
  };

  const request = await fetch(DAILY_BOTS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DAILY_BOTS_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  const response = await request.json();

  if (request.status !== 200) {
    return Response.json({ info: response.error }, { status: request.status });
  }

  return Response.json(response);
}
