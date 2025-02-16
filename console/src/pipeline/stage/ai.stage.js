import { OpenAI } from "openai";
import dotenv from "dotenv";
import logger from '../../helper/logger.helper.js';

dotenv.config(); // Load API key from .env

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Securely access API key
});

const systemPrompt = `
You are an AI that generates structured JSON content while maintaining a precise format.
Your goal is to create a JSON configuration that follows the given example's structure but incorporates key insights from the provided summary.

### Instructions:
- **Maintain the original JSON format**, including all key properties and structures.
- **Use the summary to craft meaningful content** while keeping the same number of scenes.
- **Ensure each scene's narration logically connects to the summary's core ideas.**
- **Adjust visuals contextually to match the updated narration.**
- **Keep the 'audio' section unchanged.**
- **Return only valid JSON output without explanations.**
`;

const userPrompt = (example, summary) => `
### Example JSON Configuration:
${JSON.stringify(example, null, 2)}

### Summary:
"""
${summary}
"""

Based on the provided summary, generate a new JSON configuration that adheres to the example’s structure. Ensure the scenes reflect insights from the summary while keeping the format intact. Output only valid JSON.
`;

const aiStage = async (data) => {
  logger(`AI stage started.`);

  try {
    const { example, summary } = JSON.parse(data);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt(example, summary) }
      ],
      temperature: 0.7 // Balanced creativity
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response content received from OpenAI API");
    }

    const enhancedJSON = JSON.parse(content);
    logger(`Enhanced JSON generated successfully.`);
    logger(JSON.stringify(enhancedJSON, null, 2)); // Log the enhanced JSON in a readable format

    return enhancedJSON;
  } catch (error) {
    logger(`AI stage error: ${error.message}`, true);
    if (error.response) {
      logger(`Response error: ${JSON.stringify(error.response.data)}`, true);
    }
    throw error;
  }
};

export default aiStage;