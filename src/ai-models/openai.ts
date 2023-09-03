import OpenAI from "openai";

const openai = new OpenAI();

/**
 * Text generation using OpenAI's Chat Completion API
 * @link https://platform.openai.com/docs/guides/gpt/chat-completions-api
 * @param messages
 * @param model
 * @returns generated text
 */
export async function chatCompletion(
  messages: OpenAI.Chat.Completions.CreateChatCompletionRequestMessage[],
  model = "gpt-3.5-turbo-16k",
) {
  try {
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature: 1,
      max_tokens: 1638,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const content = response.choices[0].message.content;

    return content;
  } catch (error) {
    console.error("Error generating message", error);
    return null;
  }
}

/**
 * Image generation using OpenAI's DALL-E API
 * @link https://beta.openai.com/docs/guides/dall-e
 * @param text
 * @returns generated image url
 */

export async function imageGeneration(text: string) {
  try {
    const response = await openai.images.generate({
      prompt: text,
      n: 1,
      size: "256x256",
    });

    return response.data[0].url ?? "";
  } catch (error) {
    console.error("Error generating image", error);
    return "";
  }
}
