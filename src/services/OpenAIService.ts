import axios from 'axios';
import { ENV_CONFIG, isOpenAIConfigured } from '../config/env';

export interface ProductAnalysisResult {
  barcode?: string;
  name_kr?: string;
  name_jp?: string;
  name_ch?: string;
  name_en?: string;
}

export interface OpenAIAnalysisResponse {
  success: boolean;
  data?: ProductAnalysisResult;
  error?: string;
}

class OpenAIService {
  private readonly API_URL = 'https://api.openai.com/v1/chat/completions';
  private readonly API_KEY = ENV_CONFIG.OPENAI_API_KEY;

  constructor() {
    if (!this.API_KEY) {
      // Surface a clear error early in logs without leaking any key
      console.warn('[OpenAIService] Missing OPENAI_API_KEY in environment');
    }
  }

  async analyzeProductImage(imageUrl: string): Promise<OpenAIAnalysisResponse> {
    if (!this.isConfigured()) {
      return { success: false, error: 'OpenAI is not configured. Please set OPENAI_API_KEY.' };
    }
    try {
      const requestBody = {
        response_format: { type: 'json_object' },
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a precise extraction engine. Only return a single JSON object matching the requested keys. Do not include any additional text.'
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Extract the product name in Japanese, Korean, Chinese, and English, and the barcode number from this image. Return a JSON object with keys: barcode, name_kr, name_jp, name_ch, name_en. Use null when unavailable.' },
              { type: 'image_url', image_url: { url: imageUrl } }
            ]
          }
        ],
        temperature: 0.2,
        max_tokens: 1000
      };
      const response = await axios.post(this.API_URL, requestBody, {
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30_000, // ms
      });

      if (response.data?.choices?.[0]?.message?.content) {
        try {
          const content = response.data.choices[0].message.content;
          const parsedData: ProductAnalysisResult = JSON.parse(content);
          
          return {
            success: true,
            data: parsedData,
          };
        } catch (parseError) {
          console.error('Failed to parse OpenAI response:', parseError);
          return {
            success: false,
            error: 'Failed to parse AI response. Please try again.',
          };
        }
      } else {
        return {
          success: false,
          error: 'No response from AI service.',
        };
      }
    } catch (error: any) {
      console.error('OpenAI API error:', error);
      
      let errorMessage = 'Failed to analyze image. Please try again.';
      if (error.response?.status === 401) {
        errorMessage = 'Invalid API key or unauthorized access';
      } else if (error.response?.status === 429) {
        errorMessage = 'API rate limit exceeded. Please try again later.';
      } else if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Helper method to validate if we have a valid API key
  isConfigured(): boolean {
    return isOpenAIConfigured();
  }
}

export default new OpenAIService();