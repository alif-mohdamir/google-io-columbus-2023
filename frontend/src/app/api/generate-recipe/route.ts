import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI();

interface RequestBody {
  ingredients: string[];
  selectedMeal: string;
}

const voiceId = process.env.ELEVENLABS_VOICE_ID as string;
const apiKey = process.env.ELEVENLABS_API_KEY as string;

export async function POST(request: Request) {
  const { ingredients, selectedMeal }: RequestBody = await request.json();

  // generate recipe
  const content = "test";
  const openAiResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-16k",
    messages: [
      {
        role: "user",
        content: `Give me some meals based on the following ingredients. Not all items need to be used. ${ingredients.join(
          ", ",
        )}`,
      },
      {
        role: "assistant",
        content: content,
      },
      {
        role: "user",
        content: `Provide me a recipe for ${selectedMeal}`,
      },
    ],
    temperature: 1,
    max_tokens: 1638,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const recipe = openAiResponse.choices[0].message.content;

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
  const arrayBuffer = await blob.arrayBuffer();
  const byteArray = new Uint8Array(arrayBuffer);

  let binary = "";
  byteArray.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  const base64Blob = btoa(binary);

  return NextResponse.json({ recipe, base64Blob });
}
