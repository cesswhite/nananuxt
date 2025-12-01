import { defineEventHandler } from 'h3';
import OpenAI from 'openai';
import type { ApiResponse } from '../types/api';
import { surprisePrompt } from '../utils/surprise';

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const apiKey = config.openaiApiKey;

    if (!apiKey) {
      return { success: false, error: 'OPENAI_API_KEY not configured' } as ApiResponse;
    }

    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "developer",
          content: [
            {
              type: "text",
              text: surprisePrompt
            }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Generate a creative image prompt"
            }
          ]
        }
      ],
      response_format: {
        type: "text"
      },
      verbosity: "medium",
      reasoning_effort: "medium",
      store: false
    });

    const text = response.choices[0]?.message?.content || '';

    if (!text) {
      return { success: false, error: 'No content generated' } as ApiResponse;
    }

    return {
      success: true,
      data: { text },
    } as ApiResponse;

  } catch (e) {
    console.error('Error:', e);
    return {
      success: false,
      error: e instanceof Error ? e.message : 'Failed to generate prompt',
    } as ApiResponse;
  }
});

