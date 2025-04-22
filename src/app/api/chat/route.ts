import { NextResponse } from "next/server";
import characterPrompts from "@/constants/prompts";
import OpenAI from "openai";

type CharacterModel = keyof typeof characterPrompts;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const body = await req.json();
  const { text, model } = body;

  const stream = await openai.chat.completions.create({
    model: "gpt-4-turbo-2024-04-09",
    stream: true,
    messages: [
      { role: "system", content: characterPrompts[model as CharacterModel] },
      { role: "user", content: text },
    ],
  });

  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          controller.enqueue(encoder.encode(content));
        }
      }
      controller.close();
    },
  });

  return new NextResponse(readableStream);
}
