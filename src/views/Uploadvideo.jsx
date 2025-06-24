import React, { useState, useRef } from 'react';
import { Container, Form, Button, Row, Col, Card, Badge, Spinner, Nav, Tab } from 'react-bootstrap';
import { FaCloudUploadAlt, FaDownload, FaFileAlt, FaUser, FaTextHeight, FaList, FaChartBar } from 'react-icons/fa';
import {
  handleFileChange,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleSubmit,
  downloadTranscription,
} from '../utils/VideosUtils';

const UploadVideo = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcriptionData, setTranscriptionData] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const inputRef = useRef(null);

  const handleZoneClick = () => {
    inputRef.current.click();
  };

  const LoadingSpinner = () => (
    <div className="text-center p-5">
      <div className="mb-5">
        <div className="position-relative d-inline-block">
          <Spinner 
            animation="border" 
            variant="primary" 
            style={{ width: '5rem', height: '5rem' }}
          />
          <div 
            className="position-absolute top-50 start-50 translate-middle"
            style={{ marginTop: '-2px' }}
          >
            <FaFileAlt size={30} color="#0d6efd" />
          </div>
        </div>
      </div>
      <h3 className="text-primary mb-4">Procesando video...</h3>
      <p className="text-muted mb-5 fs-5">Estamos transcribiendo tu video, esto puede tomar unos momentos</p>
      <div className="d-flex justify-content-center">
        <div className="d-flex gap-3">
          <div className="bg-primary rounded-circle loading-dots" style={{ width: '12px', height: '12px' }}></div>
          <div className="bg-primary rounded-circle loading-dots" style={{ width: '12px', height: '12px' }}></div>
          <div className="bg-primary rounded-circle loading-dots" style={{ width: '12px', height: '12px' }}></div>
        </div>
      </div>
    </div>
  );

  const UploadTab = () => (
    <div className="h-100 d-flex align-items-center justify-content-center">
      <Card className="shadow-lg border-0" style={{ maxWidth: '600px', width: '100%' }}>
        <Card.Header className="bg-gradient-primary text-white border-0 py-4">
          <h3 className="mb-0 text-center">
            <FaCloudUploadAlt className="me-3" />
            Subir Video
          </h3>
        </Card.Header>
        <Card.Body className="p-5">
          <Form onSubmit={e => handleSubmit(e, videoFile, setIsProcessing, setTranscriptionData)}>
            <div
              onClick={handleZoneClick}
              onDragOver={e => handleDragOver(e, setDragActive)}
              onDragLeave={e => handleDragLeave(e, setDragActive)}
              onDrop={e => handleDrop(e, setVideoFile, setDragActive)}
              className={`upload-zone ${dragActive ? 'border-primary' : ''}`}
              style={{
                border: dragActive ? '4px solid #0d6efd' : '4px dashed #adb5bd',
                borderRadius: 25,
                padding: 80,
                textAlign: 'center',
                background: dragActive ? 'linear-gradient(135deg, #e7f1ff 0%, #f8f9fa 100%)' : 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                cursor: 'pointer',
                marginBottom: 40,
                boxShadow: dragActive ? '0 12px 35px rgba(13, 110, 253, 0.2)' : '0 6px 20px rgba(0,0,0,0.1)',
                position: 'relative',
                transition: 'all 0.3s ease',
              }}
            >
              <FaCloudUploadAlt 
                size={80} 
                color={dragActive ? "#0d6efd" : "#adb5bd"} 
                className="mb-5" 
              />
              <Form.Label style={{ cursor: 'pointer', fontSize: 24, fontWeight: 500 }}>
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
              <Button 
                variant="primary" 
                type="submit" 
                size="lg" 
                disabled={!videoFile || isProcessing}
                className="py-4 fs-5"
              >
                {isProcessing ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-3" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <FaCloudUploadAlt className="me-3" />
                    Subir y Procesar Video
                  </>
                )}
              </Button>
            </div>
          </Form>

          {videoFile && (
            <div className="mt-5 p-5 rounded bg-light border">
              <h5 className="mb-4 text-primary">
                <FaFileAlt className="me-3" />
                Video seleccionado:
              </h5>
              <ul className="mb-0 fs-6">
                <li className="mb-2"><strong>Nombre:</strong> {videoFile.name}</li>
                <li className="mb-2"><strong>Tamaño:</strong> {(videoFile.size / (1024 * 1024)).toFixed(2)} MB</li>
                <li><strong>Tipo:</strong> {videoFile.type}</li>
              </ul>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );

  const TranscriptionTab = () => {
    if (!transcriptionData) {
      return (
        <div className="h-100 d-flex align-items-center justify-content-center">
          <div className="text-center text-muted">
            <FaFileAlt size={100} className="mb-5 opacity-50" />
            <h2 className="mb-4">Sin transcripción disponible</h2>
            <p className="fs-4">Sube un video para ver la transcripción detallada aquí</p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-100 w-100">
        <Card className="h-100 shadow-lg border-0 w-100">
          <Card.Header className="bg-gradient-primary text-white border-0 py-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <h4 className="mb-0">
                <FaList className="me-3" />
                Transcripción Detallada
              </h4>
              <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
                <Badge bg="light" text="dark" className="fs-5 px-3 py-2">
                  {transcriptionData.language_code?.toUpperCase() || 'N/A'}
                </Badge>
                <Button 
                  variant="outline-light" 
                  size="sm"
                  onClick={() => downloadTranscription(transcriptionData)}
                >
                  <FaDownload className="me-2" />
                  Descargar
                </Button>
              </div>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="p-4 border-bottom bg-light">
              <div className="row text-muted mb-3">
                <div className="col-md-3">
                  <strong className="fs-6">ID:</strong> {transcriptionData.id}
                </div>
                <div className="col-md-3">
                  <strong className="fs-6">Estado:</strong> 
                  <Badge bg="success" className="ms-3 fs-6 px-3 py-2">
                    {transcriptionData.status}
                  </Badge>
                </div>
                <div className="col-md-3">
                  <strong className="fs-6">Modelo Lenguaje:</strong> {transcriptionData.language_model}
                </div>
                <div className="col-md-3">
                  <strong className="fs-6">Modelo Acústico:</strong> {transcriptionData.acoustic_model}
                </div>
              </div>
            </div>
            <div className="p-4" style={{ height: 'calc(100vh - 300px)', overflowY: 'auto' }}>
              <h5 className="mb-3 text-primary">
                <FaUser className="me-2" />
                Palabras Detalladas ({transcriptionData.words?.length || 0} palabras):
              </h5>
              <div className="words-container w-100">
                {transcriptionData.words?.map((word, index) => (
                  <div key={index} className="word-item mb-2 p-3 border rounded shadow-sm w-100" style={{ fontSize: '1rem', padding: '1rem 1.25rem' }}>
                    <div className="d-flex flex-wrap justify-content-between align-items-center">
                      <span className="fw-bold text-primary" style={{ fontSize: '1.15rem' }}>
                        "{word.text}"
                      </span>
                      <div className="d-flex flex-wrap gap-3 mt-2 mt-md-0" style={{ fontSize: '0.98rem' }}>
                        <span><strong>Tiempo:</strong> {word.start}s - {word.end}s</span>
                        <span><strong>Confianza:</strong> <span className={word.confidence > 0.8 ? 'text-success' : word.confidence > 0.6 ? 'text-warning' : 'text-danger'}>{(word.confidence * 100).toFixed(1)}%</span></span>
                        <span><FaUser className="me-1" /><strong>Hablante:</strong> {word.speaker}</span>
                        <span><strong>Posición:</strong> #{index + 1}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  };

  const SummaryTab = () => {
    if (!transcriptionData) {
      return (
        <div className="h-100 d-flex align-items-center justify-content-center">
          <div className="text-center text-muted">
            <FaChartBar size={100} className="mb-5 opacity-50" />
            <h2 className="mb-4">Sin resumen disponible</h2>
            <p className="fs-4">Sube un video para ver el texto completo y resumen aquí</p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-100 p-4">
        <Card className="h-100 shadow-lg border-0">
          <Card.Header className="bg-gradient-success text-white border-0 py-4">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <FaTextHeight className="me-3" />
                Texto Completo y Resumen
              </h4>
              <Button 
                variant="outline-light" 
                size="lg"
                onClick={() => downloadTranscription(transcriptionData)}
                className="px-4 py-2"
              >
                <FaDownload className="me-2" />
                Descargar Todo
              </Button>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="row h-100 m-0">
              <div className="col-md-8 p-5" style={{ height: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                <h5 className="text-primary mb-4">
                  <FaFileAlt className="me-3" />
                  Texto Completo:
                </h5>
                <div className="bg-light p-4 rounded">
                  <p className="text-muted mb-0 fs-5 lh-base">
                    {transcriptionData.text}
                  </p>
                </div>
              </div>
              <div className="col-md-4 p-5 bg-light" style={{ height: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                <h5 className="text-primary mb-4">
                  <FaChartBar className="me-3" />
                  Resumen:
                </h5>
                {transcriptionData.summary ? (
                  <div className="bg-white p-4 rounded shadow-sm">
                    <p className="text-muted mb-0 fs-6">
                      {transcriptionData.summary}
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-muted">
                    <FaFileAlt size={48} className="mb-3 opacity-50" />
                    <h6>No hay resumen disponible</h6>
                    <p className="small">El resumen no se pudo generar para este video</p>
                  </div>
                )}
                
                <div className="mt-5">
                  <h6 className="text-primary mb-3">Estadísticas:</h6>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <div className="row text-center">
                      <div className="col-6">
                        <div className="fs-4 fw-bold text-primary">{transcriptionData.words?.length || 0}</div>
                        <div className="small text-muted">Palabras</div>
                      </div>
                      <div className="col-6">
                        <div className="fs-4 fw-bold text-success">
                          {transcriptionData.words ? 
                            (transcriptionData.words.reduce((acc, word) => acc + word.confidence, 0) / transcriptionData.words.length * 100).toFixed(1) : 0
                          }%
                        </div>
                        <div className="small text-muted">Confianza Promedio</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  };

  return (
    <Container fluid className="mt-4 px-4">
      <Row className="justify-content-center mb-4">
        <Col xs={12}>
          <div className="text-center">
            <h1 className="fw-bold text-primary mb-3">
              <FaCloudUploadAlt className="me-4" />
              Procesador de Videos
            </h1>
            <p className="text-secondary fs-5">Sube tu video y obtén transcripciones automáticas con análisis detallado</p>
          </div>
        </Col>
      </Row>

      {isProcessing ? (
        <Card className="shadow-lg border-0">
          <Card.Body className="p-0">
            <LoadingSpinner />
          </Card.Body>
        </Card>
      ) : (
        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
          <Row className="justify-content-center">
            <Col xs={12}>
              <Nav variant="tabs" className="mb-4 custom-tabs justify-content-center">
                <Nav.Item>
                  <Nav.Link 
                    eventKey="upload" 
                    className={`custom-tab ${activeTab === 'upload' ? 'active' : ''}`}
                  >
                    <FaCloudUploadAlt className="me-2" />
                    Subir Video
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    eventKey="transcription" 
                    className={`custom-tab ${activeTab === 'transcription' ? 'active' : ''}`}
                    disabled={!transcriptionData}
                  >
                    <FaList className="me-2" />
                    Transcripción
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    eventKey="summary" 
                    className={`custom-tab ${activeTab === 'summary' ? 'active' : ''}`}
                    disabled={!transcriptionData}
                  >
                    <FaChartBar className="me-2" />
                    Resumen
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content className="h-100">
                <Tab.Pane eventKey="upload" className="h-100">
                  <UploadTab />
                </Tab.Pane>
                <Tab.Pane eventKey="transcription" className="h-100">
                  <TranscriptionTab />
                </Tab.Pane>
                <Tab.Pane eventKey="summary" className="h-100">
                  <SummaryTab />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      )}
    </Container>
  );
};

export default UploadVideo;