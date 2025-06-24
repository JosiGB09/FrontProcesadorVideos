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

  const formData = new FormData();
  formData.append('video', videoFile);

  fetch('http://localhost:8000/upload', { 
    method: 'POST',
    body: formData,
  })
    .then(response => response.json())
    .then(data => {
      alert('Video enviado correctamente');
      // Puedes manejar la respuesta aquí
    })
    .catch(error => {
      alert('Error al enviar el video');
      console.error(error);
    });
}