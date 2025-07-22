// consumers.ts - API utility for consumers

const isDevelopment = import.meta.env.DEV;
const BASE_URL = isDevelopment 
  ? '/api'  // Use Vite proxy in development
  : 'https://www.sandeep.bestinfra.app/api'; // Replace with actual production URL

export interface Consumer {
  id: number;
  consumerNumber: string;
  name: string;
  meters?: any[];
  [key: string]: any;
}

export interface GetAllConsumersResponse {
  success: boolean;
  data: Consumer[];
  message: string;
}

export async function getAllConsumers(): Promise<Consumer[]> {
  const response = await fetch(`${BASE_URL}/consumers`);
  if (!response.ok) {
    throw new Error('Failed to fetch consumers');
  }
  const result: GetAllConsumersResponse = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'Failed to fetch consumers');
  }
  return result.data;
} 