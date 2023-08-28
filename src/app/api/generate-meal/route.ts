import { openaiChatCompletion, palmGenerateMessage } from "@/ai-models";
import { NextResponse } from "next/server";

async function aiTextGeneration(model: string, prompt: string) {
  let content: string | null = null;

  if (model === "palm") {
    content = await palmGenerateMessage([
      {
        content: prompt,
      },
    ]);
  } else {
    content = await openaiChatCompletion([
      {
        role: "user",
        content: prompt,
      },
    ]);
  }

  return content;
}

export async function POST(request: Request) {
  const { ingredients, model }: { ingredients: []; model: string } =
    await request.json();

  const prompt = `Give me 10 meals based on the following ingredients. Not all items need to be used: ${ingredients.join(
    ", ",
  )}`;

  const content = await aiTextGeneration(model, prompt);

  let matches = content?.match(/\d+\..*/g);

  if (!matches) {
    return NextResponse.json({ meals: [] });
  }

  const meals: { name: string; description: string }[] = [];
  // parse the response into a list of meals with their names and descriptions
  for (let match of matches) {
    let description = "";
    let split = match.split(":");
    let name = match.split(":")[0].replace(/\d+\.\s*/, "");

    if (split.length > 1) {
      description = match.split(":")[1].trim();
    }

    meals.push({
      name: name.replace(/\d+\.\s*/, ""),
      description: description,
    });
  }

  return NextResponse.json({ meals });
}
