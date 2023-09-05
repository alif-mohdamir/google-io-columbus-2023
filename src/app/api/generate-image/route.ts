import { NextResponse } from "next/server";
import { imageGeneration } from "@/ai-models/openai";

interface RequestBody {
  prompt: string;
}

export async function POST(request: Request) {
  const { prompt }: RequestBody = await request.json();

  const image = await imageGeneration(prompt);

  return NextResponse.json({ image });
}
