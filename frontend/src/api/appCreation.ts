const API_BASE_URL = 'http://localhost:3001/api';

export interface AppCreationResponse {
  success: boolean;
  message: string;
  nextSteps?: string[];
  data?: {
    id: number;
    name: string;
    subdomain: string;
    configuration: any;
    branding: any;
    adminSettings: any;
  };
}

export interface GeneratedApp {
  name: string;
  path: string;
  created: Date;
}

export interface GeneratedAppsResponse {
  apps: GeneratedApp[];
}

export class AppCreationAPI {
  static async createApp(formData: any): Promise<AppCreationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/apps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create app');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating app:', error);
      throw error;
    }
  }

  static async getGeneratedApps(): Promise<GeneratedAppsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/apps`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch apps');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching apps:', error);
      throw error;
    }
  }

  static async checkServerHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
      return response.ok;
    } catch (error) {
      console.error('Server health check failed:', error);
      return false;
    }
  }
} 