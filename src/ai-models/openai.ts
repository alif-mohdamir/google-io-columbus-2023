import OpenAI from "openai";

const openai = new OpenAI();

/**
 * Text generation using OpenaAI's Chat Completion API
 * @link https://platform.openai.com/docs/guides/gpt/chat-completions-api
 * @param messages
 * @param model
 * @returns generated text
 */
export async function chatCompletion(
  messages: OpenAI.Chat.Completions.CreateChatCompletionRequestMessage[],
  model = "gpt-3.5-turbo-16k",
) {
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
}