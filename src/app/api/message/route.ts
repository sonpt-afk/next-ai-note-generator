import OpenAI from "openai";
import { StreamingTextResponse } from "ai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  const { topic } = await req.json();

  const prompt = `generate a short note between 150 to 200 words on topic: ${topic}`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 150,
  });

  // Convert the response into a friendly text-stream
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        const text = chunk.choices[0]?.delta?.content || "";
        controller.enqueue(text);
      }
      controller.close();
    },
  });

  return new StreamingTextResponse(stream);
}
