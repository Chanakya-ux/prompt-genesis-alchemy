
interface OptimizeRequest {
  prompt: string;
  mode: string;
  customStyle?: string;
}

interface ExplainRequest {
  originalPrompt: string;
  optimizedPrompt: string;
  mode: string;
}

class PromptService {
  private baseUrl = '/api';

  async optimizePrompt(request: OptimizeRequest): Promise<ReadableStream<Uint8Array> | null> {
    const response = await fetch(`${this.baseUrl}/optimize-prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.body;
  }

  async explainPrompt(request: ExplainRequest): Promise<any> {
    const response = await fetch(`${this.baseUrl}/explain-prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getPromptHistory(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/prompt-history`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Utility method to read stream as text
  async readStream(stream: ReadableStream<Uint8Array>): Promise<string> {
    const reader = stream.getReader();
    let result = '';
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += new TextDecoder().decode(value);
      }
    } finally {
      reader.releaseLock();
    }
    
    return result;
  }

  // Method to handle streaming response with callback
  async streamOptimizePrompt(
    request: OptimizeRequest, 
    onChunk: (chunk: string) => void
  ): Promise<string> {
    const stream = await this.optimizePrompt(request);
    if (!stream) throw new Error('No stream received');

    const reader = stream.getReader();
    let fullResponse = '';
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        fullResponse += chunk;
        onChunk(chunk);
        
        // Add artificial delay for better UX
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    } finally {
      reader.releaseLock();
    }
    
    return fullResponse;
  }
}

export const promptService = new PromptService();
export type { OptimizeRequest, ExplainRequest };
