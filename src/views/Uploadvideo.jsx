
import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const UploadVideo = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoBase64, setVideoBase64] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1]; 
        setVideoBase64(base64String);
        console.log('Base64 del video:', base64String.slice(0, 100) + '...'); 
      };
      reader.readAsDataURL(file); 
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!videoFile) {
      alert('Seleccione un archivo de video');
      return;
    }

    alert('Video convertido a Base64. Revisa la consola del navegador.');
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
          Convertir a Base64
        </Button>
      </Form>

      {videoBase64 && (
        <div className="mt-4">
          <h5>Base64 generado (vista parcial):</h5>
          <code style={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>
            {videoBase64.slice(0, 300)}...
          </code>
        </div>
      )}
    </Container>
  );
};

export default UploadVideo;
