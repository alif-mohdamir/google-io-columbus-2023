import { NextResponse } from "next/server";
import { generateAiText } from "@/ai-models";
import { blobToBase64String } from "@/utils";
import { imageGeneration } from "@/ai-models/openai";

interface RequestBody {
  ingredients: string[];
  meal: { name: string, description: string};
  model: string;
}

const voiceId = process.env.ELEVENLABS_VOICE_ID as string;
const apiKey = process.env.ELEVENLABS_API_KEY as string;

export async function POST(request: Request) {
  const { ingredients, meal, model }: RequestBody =
    await request.json();

  const { name: mealName, description: mealDescription } = meal;
  const prompt = `Provide me a recipe for ${mealName} using the following ingredients. ${ingredients.join(
    ", ",
  )}`;
  const context = "You are Gordon Ramsey";
  // const recipe = await generateAiText(model, prompt, context);

  // // generate ai image from meal description  
  // const aiImageRes = await imageGeneration(mealDescription);
  
  // generate recipe and image in parallel
  const res = await Promise.all([generateAiText(model, prompt, context), imageGeneration(mealDescription)])
  
  const recipe = res[0];
  const image = res[1];

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
  //   return NextResponse.json({ recipe, aiImageRes });
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
    return NextResponse.json({ recipe, image });
  }

  // convert audio to base64
  const blob = await elevenLabsRes.blob();
  const base64Blob = await blobToBase64String(blob);

  return NextResponse.json({ recipe, base64Blob, image });
}
