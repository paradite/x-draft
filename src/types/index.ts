export type ModelName = 'claude-opus-4.5' | 'gemini-2.5-pro';

export type PromptStyle = 'direct' | 'engaging' | 'conversational' | 'controversial' | 'story';

export interface Draft {
  text: string;
  topic: string;
  model: ModelName;
  promptStyle: PromptStyle;
}

export interface ModelConfig {
  provider: 'anthropic' | 'google';
  modelId: string;
  maxTokens: number;
}

export const MODEL_REGISTRY: Record<ModelName, ModelConfig> = {
  'claude-opus-4.5': {
    provider: 'anthropic',
    modelId: 'claude-opus-4-5-20251101',
    maxTokens: 1024,
  },
  'gemini-2.5-pro': {
    provider: 'google',
    modelId: 'gemini-2.5-pro',
    maxTokens: 1024,
  },
};
