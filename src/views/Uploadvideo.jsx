import React, { useState, useRef } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { FaCloudUploadAlt } from 'react-icons/fa';
import {
  handleFileChange,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleSubmit,
} from '../utils/VideosUtils';

const UploadVideo = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleZoneClick = () => {
    inputRef.current.click();
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <div className="text-center mb-4">
            <h2 className="fw-bold">Subir Video</h2>
            <p className="text-secondary">Arrastra tu video o haz clic en la zona para seleccionarlo</p>
          </div>
          <Form onSubmit={e => handleSubmit(e, videoFile)}>
            <div
              onClick={handleZoneClick}
              onDragOver={e => handleDragOver(e, setDragActive)}
              onDragLeave={e => handleDragLeave(e, setDragActive)}
              onDrop={e => handleDrop(e, setVideoFile, setDragActive)}
              style={{
                border: dragActive ? '2px solid #0d6efd' : '2px dashed #adb5bd',
                borderRadius: 16,
                padding: 40,
                textAlign: 'center',
                background: dragActive ? '#e7f1ff' : '#f8f9fa',
                cursor: 'pointer',
                marginBottom: 24,
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                transition: 'all 0.2s',
                position: 'relative',
              }}
            >
              <FaCloudUploadAlt size={48} color={dragActive ? "#0d6efd" : "#adb5bd"} className="mb-3" />
              <Form.Label style={{ cursor: 'pointer', fontSize: 18 }}>
                {dragActive
                  ? "¡Suelta tu video aquí!"
                  : "Arrastra y suelta tu video aquí o haz clic para seleccionarlo"}
              </Form.Label>
              <Form.Control
                type="file"
                accept="video/*"
                onChange={e => handleFileChange(e, setVideoFile)}
                ref={inputRef}
                style={{ display: 'none' }}
              />
            </div>
            <div className="d-grid">
              <Button variant="primary" type="submit" size="lg" disabled={!videoFile}>
                Subir Video
              </Button>
            </div>
          </Form>

          {videoFile && (
            <div className="mt-5 p-4 rounded shadow-sm bg-white border">
              <h5 className="mb-3 text-primary">Información del video seleccionado:</h5>
              <ul className="mb-3">
                <li><strong>Nombre:</strong> {videoFile.name}</li>
                <li><strong>Tamaño:</strong> {(videoFile.size / (1024 * 1024)).toFixed(2)} MB</li>
                <li><strong>Tipo:</strong> {videoFile.type}</li>
              </ul>
              <video
                src={URL.createObjectURL(videoFile)}
                controls
                width="100%"
                className="rounded"
                style={{ maxHeight: 320, background: "#000" }}
              />
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default UploadVideo;