import { NextResponse } from "next/server";
import { generateAiText } from "@/ai-models";
import { blobToBase64String } from "@/utils";

interface RequestBody {
  ingredients: string[];
  selectedMeal: string;
  model: string;
}

const voiceId = process.env.ELEVENLABS_VOICE_ID as string;
const apiKey = process.env.ELEVENLABS_API_KEY as string;

export async function POST(request: Request) {
  const { ingredients, selectedMeal, model }: RequestBody =
    await request.json();

  const prompt = `Provide me a recipe for ${selectedMeal} using the following ingredients. ${ingredients.join(
    ", ",
  )}`;
  const context = "You are Gordon Ramsey";
  const recipe = await generateAiText(model, prompt, context);

  // // get voices
  // const elevenLabsVoicesRes = await fetch(
  //   "https://api.elevenlabs.io/v1/voices",
  //   {
  //     method: "GET",
  //     headers: {
  //       accept: "application/json",
  //       "xi-api-key": apiKey,
  //     },
  //   },
  // );

  // if (!elevenLabsVoicesRes.ok) {
  //   const error = await elevenLabsVoicesRes.json();
  //   console.error("Error getting voices", error);
  //   return NextResponse.json({ recipe });
  // }

  // const elevenLabsVoices = await elevenLabsVoicesRes.json();

  // console.log("elevenLabsVoices", elevenLabsVoices)

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
    const error = await elevenLabsRes.json();
    console.error("Error generating audio", error);
    return NextResponse.json({ recipe });
  }

  // convert audio to base64
  const blob = await elevenLabsRes.blob();
  const base64Blob = await blobToBase64String(blob);

  return NextResponse.json({ recipe, base64Blob });
}
