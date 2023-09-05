import { chatCompletion } from "@/ai-models/openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge";

interface RequestBody {
  ingredients: string[];
  meal: { name: string; description?: string };
  model: string;
}

export async function POST(request: Request) {
  const { ingredients, meal, model }: RequestBody = await request.json();
  const { name: mealName } = meal;
  const prompt = `Provide me a recipe for ${mealName} using the following ingredients. ${ingredients.join(
    ", ",
  )}`;

  const recipe = await chatCompletion([
    {
      role: "system",
      content: "You are Gordan Ramsey"
    },
    {
      role: "user",
      content: prompt,
    },
  ], model, true);

  if (!recipe) {
    throw new Error("Error generating recipe");
  }

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(recipe);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
