import { NextResponse } from "next/server";
import { openaiChatCompletion, palmGenerateMessage } from "@/ai-models";
import { blobToBase64String } from "@/utils";

interface RequestBody {
  ingredients: string[];
  selectedMeal: string;
  model: string;
}

const voiceId = process.env.ELEVENLABS_VOICE_ID as string;
const apiKey = process.env.ELEVENLABS_API_KEY as string;

async function aiTextGeneration(
  model: string,
  prompt: string,
  selectedMeal: string,
) {
  let content: string | null = null;
  const context = `Provide me a recipe for ${selectedMeal}`;

  if (model === "palm") {
    content = await palmGenerateMessage(
      [
        {
          content: prompt,
        },
      ],
      context,
    );
  } else {
    content = await openaiChatCompletion([
      {
        role: "user",
        content: prompt,
      },
      {
        role: "assistant",
        content: "test",
      },
      {
        role: "user",
        content: context,
      },
    ]);
  }

  return content;
}

export async function POST(request: Request) {
  const { ingredients, selectedMeal, model }: RequestBody =
    await request.json();

  const prompt = `Give me a recipe based on the following ingredients. ${ingredients.join(
    ", ",
  )}`;

  const recipe = await aiTextGeneration(model, prompt, selectedMeal);

  // generate audio
  const elevenLabsRes = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text: recipe,
        model_id: "eleven_monolingual_v1",
      }),
    },
  );

  if (!elevenLabsRes.ok) {
    console.error("Error generating audio");
    return NextResponse.json({ recipe });
  }

  // convert audio to base64
  const blob = await elevenLabsRes.blob();
  const base64Blob = await blobToBase64String(blob);

  return NextResponse.json({ recipe, base64Blob });
}
