import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI();

export async function POST(request: Request) {
  const { ingredients }: { ingredients: [] } = await request.json();

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-16k",
    messages: [
      {
        role: "user",
        content: `Give me 10 meals based on the following ingredients. Not all items need to be used: ${ingredients.join(
          ", ",
        )}`,
      },
    ],
    temperature: 1,
    max_tokens: 1638,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  let matches = response.choices[0].message.content?.match(/\d+\..*/g);

  if (!matches) {
    return NextResponse.json({ message: "hi mom" });
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
