export interface NanobananaReplicateResponse {
    id: string;
    model: string;
    version: string;
    input: {
        aspect_ratio: string;
        output_format: string;
        prompt: string;
    };
    logs: string | null;
    output: string | null;
    data_removed: boolean;
    error: string | null;
    source: string;
    status: string;
    created_at: string;
    started_at: string;
    completed_at: string;
    urls: {
        cancel: string;
        get: string;
        stream: string;
        web: string;
    };
    metrics: {
        predict_time: number;
        total_time: number;
    };
}
