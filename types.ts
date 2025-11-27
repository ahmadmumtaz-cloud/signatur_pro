export type SignatureColor = '#000000' | '#1e40af' | '#dc2626' | '#15803d';
export type ExportFormat = 'jpg' | 'png' | 'pdf' | 'docx';

export interface DrawPoint {
  x: number;
  y: number;
}

export interface SignatureConfig {
  color: SignatureColor;
  thickness: number;
}

export interface GeneratedSignature {
  imageUrl: string;
  name: string;
}