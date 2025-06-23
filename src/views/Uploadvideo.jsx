import React, { useState, useRef } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const UploadVideo = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file || null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setVideoFile(e.dataTransfer.files[0]);
    }
  };

  const handleZoneClick = () => {
    inputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!videoFile) {
      alert('Seleccione un archivo de video');
      return;
    }
    alert('Video seleccionado: ' + videoFile.name);
    // Envio del video al backend
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Subir Video</h2>
      <Form onSubmit={handleSubmit}>
        <div
          onClick={handleZoneClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: dragActive ? '2px solid #007bff' : '2px dashed #ccc',
            borderRadius: 8,
            padding: 30,
            textAlign: 'center',
            background: dragActive ? '#e9f5ff' : '#fafafa',
            cursor: 'pointer',
            marginBottom: 20,
          }}
        >
          <Form.Label style={{ cursor: 'pointer' }}>
            Arrastra y suelta tu video aquí o haz clic para seleccionarlo
          </Form.Label>
          <Form.Control
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            ref={inputRef}
            style={{ display: 'none' }}
          />
        </div>
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