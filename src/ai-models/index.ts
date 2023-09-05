import { chatCompletion as openaiChatCompletion } from "./openai";
import { generateMessage as palmGenerateMessage } from "./palm";

/**
 * A function that generates text with the given model and prompt
 * @param model
 * @param prompt
 * @returns Promise<string | null>
 */
async function generateAiText(model: string, prompt: string, context?: string, stream?: boolean) {
  let content: string | null = null;

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
    ], model, stream);
  }

  return content;
}

export { openaiChatCompletion, palmGenerateMessage, generateAiText };
