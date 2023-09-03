import { DiscussServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";

const MODEL_NAME = "models/chat-bison-001";
const API_KEY = process.env.PALM_API_KEY as string;

const client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

/**
 * Text generation using the palm model
 * @link https://developers.generativeai.google/tutorials/chat_node_quickstart#generate_messages
 * @param messages
 * @param context
 * @returns generated text
 */
export async function generateMessage(
  messages: { author?: string; content?: string }[],
  context?: string,
) {
  try {
    const result = await client.generateMessage({
      model: MODEL_NAME, // Required. The model to use to generate the result.
      temperature: 1, // Optional. Value `0.0` always uses the highest-probability result.
      candidateCount: 1, // Optional. The number of candidate results to generate.
      prompt: {
        // optional, preamble context to prime responses
        context,
        // Required. Alternating prompt/response messages.
        messages,
      },
    });

    if (
      !result ||
      !result[0] ||
      !result[0].candidates ||
      !result[0].candidates[0] ||
      !result[0].candidates[0].content
    ) {
      console.error("Error generating message", result);
      return null;
    }
    // remove all astriks from the response
    const content = result[0].candidates[0].content.replace(/\*/g, "");

    return content;
  } catch (e) {
    console.error("Error generating message", e);
    return null;
  }
}
