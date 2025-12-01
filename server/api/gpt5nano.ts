import { defineEventHandler, readBody } from 'h3';
import OpenAI from 'openai';
import type { TextGenerationRequest, ApiResponse } from '../types/api';
import { enhanceTextPrompt } from '../utils/enhance';

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const apiKey = config.openaiApiKey;

    if (!apiKey) {
      return { success: false, error: 'OPENAI_API_KEY not configured' } as ApiResponse;
    }

    const body = await readBody<TextGenerationRequest>(event);
    const { prompt, model = 'gpt-5-nano' } = body;

    if (!prompt) {
      return { success: false, error: 'Prompt is required' } as ApiResponse;
    }

    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create({
        model: "gpt-5-nano",
        messages: [
          {
            "role": "developer",
            "content": [
              {
                "type": "text",
                "text": enhanceTextPrompt
              }
            ]
          },
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": prompt
              }
            ]
          }
        ],
        response_format: {
          "type": "text"
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
      error: e instanceof Error ? e.message : 'Failed to generate text',
    } as ApiResponse;
  }
});

