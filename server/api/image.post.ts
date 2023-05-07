import { Configuration, OpenAIApi } from "openai";
import fs from "fs";
import { base64, prompt } from "~~/mocks/image";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const url = body.url; // the article URL

  // Setup open AI
  const { OPENAI_API_KEY } = useRuntimeConfig();
  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  // 1. make a request to the Chat API to generate the DALL-E prompt
  const { data } = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a prompt engineer creating DALL-E prompts",
      },
      {
        role: "user",
        content: `Provide 2 realistic physical objects based on this article: ${url}?`,
      },
    ],
    temperature: body.temperature || 1,
  });

  if (!data.choices[0].message) {
    throw new Error("No message in response from OpenAI");
  }

  const openAiPrompt = data.choices[0].message.content;
  // const openAiPrompt = prompt; // To be removed once the above is working

  // 2 make a request to DALL-E to generate the image
  const response = await openai.createImage({
    prompt: openAiPrompt + " repeat the items",
    n: 1,
    size: "1024x1024",
  });
  const imageURL = response.data.data[0].url;

  if (!imageURL) {
    throw new Error("No image_url in response from OpenAI");
  }
  // 3. return the image as a base64 encoded string for using with html-to-image on the front-end

  /*HINT: The following code is useful for creating a base64 encoded string for an imag
   */
  const res = (await $fetch(imageURL, {
    responseType: "arrayBuffer",
  })) as Buffer;
  const base64String = Buffer.from(res).toString("base64");

  return `data:image/jpeg;base64,${base64String}`;
  // return "/image-background.jpg"; // replae this with the base64 encoded generated image
});
