/**
 * @file VideosUtils.js
 * @description Utilidades para la gestión de archivos de video, manejo de eventos de carga/arrastre, procesamiento de transcripción y descarga de resultados.
 * @module utils/VideosUtils
 */

 /**
  * Maneja el evento de cambio de archivo en un input de tipo file.
  * @param {Event} e - Evento de cambio del input.
  * @param {Function} setVideoFile - Función para actualizar el estado del archivo de video seleccionado.
  */
 
 /**
  * Maneja el evento de arrastre sobre el área de drop.
  * @param {Event} e - Evento de drag over.
  * @param {Function} setDragActive - Función para actualizar el estado de arrastre activo.
  */
 
 /**
  * Maneja el evento cuando el archivo deja el área de drop.
  * @param {Event} e - Evento de drag leave.
  * @param {Function} setDragActive - Función para actualizar el estado de arrastre activo.
  */
 
 /**
  * Maneja el evento de soltar archivo en el área de drop.
  * @param {Event} e - Evento de drop.
  * @param {Function} setVideoFile - Función para actualizar el estado del archivo de video seleccionado.
  * @param {Function} setDragActive - Función para actualizar el estado de arrastre activo.
  */
 
 /**
  * Maneja el envío del formulario para procesar el archivo de video y obtener la transcripción.
  * @async
  * @param {Event} e - Evento de submit del formulario.
  * @param {File|null} videoFile - Archivo de video seleccionado.
  * @param {Function} setIsProcessing - Función para actualizar el estado de procesamiento.
  * @param {Function} setTranscriptionData - Función para actualizar los datos de transcripción recibidos.
  */
 
 /**
  * Descarga la transcripción y detalles en un archivo de texto.
  * @param {Object} transcriptionData - Datos de la transcripción generados por el backend.
  * @param {string} transcriptionData.id - ID de la transcripción.
  * @param {string} transcriptionData.language_model - Modelo de lenguaje utilizado.
  * @param {string} transcriptionData.acoustic_model - Modelo acústico utilizado.
  * @param {string} transcriptionData.language_code - Código de idioma.
  * @param {string} transcriptionData.status - Estado de la transcripción.
  * @param {string} transcriptionData.text - Texto completo transcrito.
  * @param {Array<Object>} transcriptionData.words - Palabras detalladas con tiempos y confianza.
  * @param {string} [transcriptionData.summary] - Resumen de la transcripción (opcional).
  */

/**
 * Formatea un tiempo en milisegundos a un formato legible (segundos o minutos).
 * @param {number} milliseconds - Tiempo en milisegundos.
 * @returns {string} Tiempo formateado en segundos o minutos.
 */
export function formatTime(milliseconds) {
  const seconds = milliseconds / 1000;
  
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  } else {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toFixed(1)}s`;
  }
}

import { transcriptionService } from '../services/transcriptionService.js';

export function handleFileChange(e, setVideoFile) {
  const file = e.target.files[0];
  setVideoFile(file || null);
}

export function handleDragOver(e, setDragActive) {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(true);
}

export function handleDragLeave(e, setDragActive) {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);
}

export function handleDrop(e, setVideoFile, setDragActive) {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    setVideoFile(e.dataTransfer.files[0]);
  }
}

export async function handleSubmit(e, videoFile, setIsProcessing, setTranscriptionData) {
  e.preventDefault();
  if (!videoFile) {
    alert('Seleccione un archivo de video');
    return;
  }

  setIsProcessing(true);
  
  try {
    const uploadResponse = await transcriptionService.uploadVideo(videoFile);

    if (uploadResponse.text && uploadResponse.words) {
      setTranscriptionData(uploadResponse);
    } else {
      throw new Error('Formato de respuesta inesperado del servidor');
    }
    
  } catch (error) {
    console.error('Error:', error);
    alert('Error al procesar el video: ' + error.message);
  } finally {
    setIsProcessing(false);
  }
}

export function downloadTranscription(transcriptionData) {
  if (!transcriptionData) return;

  const content = `TRANSCRIPCIÓN DEL VIDEO
=======================

ID: ${transcriptionData.id}
Modelo de Lenguaje: ${transcriptionData.language_model}
Modelo Acústico: ${transcriptionData.acoustic_model}
Código de Idioma: ${transcriptionData.language_code}
Estado: ${transcriptionData.status}

TEXTO COMPLETO:
${transcriptionData.text}

PALABRAS DETALLADAS:
${transcriptionData.words.map(word => 
  `- "${word.text}" (${word.start}s - ${word.end}s, confianza: ${(word.confidence * 100).toFixed(1)}%, hablante: ${word.speaker})`
).join('\n')}

${transcriptionData.summary ? `
RESUMEN:
${transcriptionData.summary}
` : 'RESUMEN: No disponible'}`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transcripcion_${transcriptionData.id}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}