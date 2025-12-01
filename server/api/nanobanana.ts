import { defineEventHandler, createError, readBody } from 'h3';
import { NanobananaReplicateResponse } from '../types/nanobanana';

export default defineEventHandler(async (event) => {
    try {
      const config = useRuntimeConfig();
      const apiToken = config.replicateApiToken;
      
      if (!apiToken) {
        throw createError({
          statusCode: 500,
          message: 'Missing Replicate API token. Please set REPLICATE_API_TOKEN environment variable.',
        });
      }
      
      const body = await readBody(event);
      const prompt = body?.prompt || "How engineers see the San Francisco Bridge";
      const isPro = body?.isPro || false;
      
      const model = isPro ? 'google/nano-banana-pro' : 'google/nano-banana';
      const apiUrl = `https://api.replicate.com/v1/models/${model}/predictions`;
      
      const input = {
        prompt: prompt,
        aspect_ratio: body?.aspect_ratio || "4:3",
        output_format: body?.output_format || "png"
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
          'Prefer': 'wait'
        },
        body: JSON.stringify({ input })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw createError({
          statusCode: response.status,
          message: errorData.detail || `API request failed with status ${response.status}`,
        });
      }
    
      const data = await response.json() as NanobananaReplicateResponse;
      
      console.log('Replicate response:', data);
      
      if (data.error) {
        throw createError({
          statusCode: 500,
          message: data.error || 'Failed to generate image. No output received.',
        });
      }
      
      if (!data.output) {
        throw createError({
          statusCode: 500,
          message: 'No output received from Replicate API.',
        });
      }
    
      return data;

    } catch (error: any) {
      console.error('Error in replicate API:', error);
      
      if (error.statusCode) {
        throw error;
      }
      
      throw createError({
        statusCode: 500,
        message: error.message || 'Failed to generate image with replicate.',
      });
    }
  });