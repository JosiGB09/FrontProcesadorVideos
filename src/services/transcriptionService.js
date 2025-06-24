/**
 * Servicio para manejar la transcripción de videos.
 * Proporciona métodos para subir archivos de video al backend para su procesamiento.
 *
 * @namespace transcriptionService
 */
import { getApiUrl, getUploadHeaders, API_CONFIG } from '../config/api.js';

export const transcriptionService = {
    async uploadVideo(videoFile) {
        try {
            const formData = new FormData();
            formData.append('videoFile', videoFile);

            const url = getApiUrl(API_CONFIG.ENDPOINTS.UPLOAD);

            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                headers: {
                    'accept': 'text/plain',
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error response:', errorText);
                
                // Handle specific 400 error
                if (response.status === 400) {
                    throw new Error(`Error 400: Verifica que el archivo sea un video válido y no exceda el tamaño máximo permitido. Detalles: ${errorText}`);
                }
                
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error uploading video:', error);
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose en https://localhost:7064');
            }
            
            throw new Error(`Error al subir el video: ${error.message}`);
        }
    },
}; 