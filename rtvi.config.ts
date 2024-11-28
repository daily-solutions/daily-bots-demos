export const defaultConfig = {
  bot_profile: "vision_2024_10",
  max_duration: 600,
  services: {
    llm: "anthropic",
    tts: "cartesia",
  },
  service_options: {
    anthropic: {
      model: "claude-3-5-sonnet-latest",
    },
  },
  recording_settings: {
    type: "cloud",
  },
  config: [
    {
      service: "tts",
      options: [
        {
          name: "voice",
          value: "79a125e8-cd45-4c13-8a67-188112f4dd22",
        },
      ],
    },
    {
      service: "llm",
      options: [
        {
          name: "initial_messages",
          value: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "You are an assistant called Daily Bot. You can ask me anything. Keep responses brief and legible. Start by briefly introducing yourself. Your responses will be converted to audio.",
                },
              ],
            },
          ],
        },
        {
          name: "run_on_config",
          value: true,
        },
      ],
    },
  ],
};
