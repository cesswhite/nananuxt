export interface TextGenerationRequest {
    prompt: string;
    model?: string;
}

export interface ApiResponse {
    success: boolean;
    data?: { text: string };
    error?: string;
}

