
export interface Document {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

export enum AIActionType {
  IMPROVE = 'improve',
  SUMMARIZE = 'summarize',
  CONTINUE = 'continue',
  EXPLAIN = 'explain',
  GENERATE_IMAGE = 'generate_image',
  RESEARCH = 'research'
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface AIResponse {
  content: string;
  action: AIActionType;
  imageUrl?: string;
  sources?: GroundingChunk[];
}
