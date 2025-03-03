import type { FormData } from '../types';

export class GoogleSheetsService {
  private readonly API_URL = import.meta.env.VITE_API_URL || 
    (import.meta.env.PROD 
      ? 'https://app.chivisclothes.com/api/submit-form'
      : `${window.location.protocol}//${window.location.hostname}:3000/api/submit-form`);
  private readonly ORIGIN = window.location.origin;

  async appendData(data: FormData): Promise<{ success: boolean; data?: any }> {
    try {
      console.log('Enviando datos a:', this.API_URL);
      console.log('Datos:', JSON.stringify(data, null, 2));

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': this.ORIGIN
        },
        mode: 'cors',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const jsonResponse = await response.json();
      console.log('Respuesta exitosa:', jsonResponse);
      return jsonResponse;
    } catch (error: any) {
      console.error('Error detallado:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      throw new Error(error.message || 'Error al enviar los datos');
    }
  }
}