import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const UploadVideo = () => {
  const [videoFile, setVideoFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file || null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!videoFile) {
      alert('Seleccione un archivo de video');
      return;
    }

    alert('Video seleccionado: ' + videoFile.name);
    // Aquí podrías enviar el archivo a un backend si lo necesitas
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Subir Video</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Seleccione un archivo de video</Form.Label>
          <Form.Control 
            type="file" 
            accept="video/*" 
            onChange={handleFileChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Subir Video
        </Button>
      </Form>

      {videoFile && (
        <div className="mt-4">
          <h5>Información del video seleccionado:</h5>
          <ul>
            <li><strong>Nombre:</strong> {videoFile.name}</li>
            <li><strong>Tamaño:</strong> {(videoFile.size / (1024 * 1024)).toFixed(2)} MB</li>
            <li><strong>Tipo:</strong> {videoFile.type}</li>
          </ul>
          <video
            src={URL.createObjectURL(videoFile)}
            controls
            width="320"
            className="mt-2"
          />
        </div>
      )}
    </Container>
  );
};

export default UploadVideo;