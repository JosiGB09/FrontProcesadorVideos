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

export function handleSubmit(e, videoFile) {
  e.preventDefault();
  if (!videoFile) {
    alert('Seleccione un archivo de video');
    return;
  }
  alert('Video seleccionado: ' + videoFile.name);
  // Envio a backend
}