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