// src/components/ProductDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getContentById, getContents } from '../services/contentService';
import { Container, Row, Col, Table, Carousel, Spinner, Button, Nav } from 'react-bootstrap';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import PackingList from './PackingList'; // Importa el nuevo componente
import 'bootstrap-icons/font/bootstrap-icons.css'; // Importa Bootstrap Icons
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('details');
  const [referencia, setReferencia] = useState(null); // Estado para almacenar la referencia

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getContentById(id);
        setProduct(data);
        setLoading(false);

        // Identificar dinámicamente el campo de referencia
        const refField = Object.keys(data).find(key => key.toLowerCase().includes('referencia'));
        if (refField) {
          setReferencia(data[refField]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error);
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const data = await getContents();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProduct();
    fetchProducts();
  }, [id]);

  const handleNextProduct = () => {
    const currentIndex = products.findIndex((p) => p.id === id);
    const nextIndex = (currentIndex + 1) % products.length;
    const nextProductId = products[nextIndex].id;
    navigate(`/product/${nextProductId}`);
  };

  const handlePreviousProduct = () => {
    const currentIndex = products.findIndex((p) => p.id === id);
    const prevIndex = (currentIndex - 1 + products.length) % products.length;
    const prevProductId = products[prevIndex].id;
    navigate(`/product/${prevProductId}`);
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <div>Error: {error.message}</div>;
  if (!product) return <div>No product found</div>;

  const allImages = [product.imagenPrincipal, ...product.galeriaImagen];

  const openLightbox = (index) => {
    setPhotoIndex(index);
    setIsLightboxOpen(true);
  };

  const dynamicFields = Object.keys(product).filter(
    (key) => !['id', 'producto', 'acabado', 'nTablas', 'galeriaImagen', 'imagenPrincipal', 'm2', 'dimensiones', 'referencia'].includes(key)
  );

  return (
    <Container className="mt-5 product-detail-container">
      <Row>
        <Col md={1} className="d-flex align-items-center justify-content-center">
          <Button variant="secondary" onClick={handlePreviousProduct}>
            <i className="bi bi-arrow-left"></i>
          </Button>
        </Col>
        <Col md={10} className="custom-carousel-container">
          <Carousel interval={null} className="custom-carousel">
            {allImages.map((img, index) => (
              <Carousel.Item key={index} onClick={() => openLightbox(index)}>
                <img className="d-block w-100 carousel-img" src={img} alt={`Slide ${index}`} />
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
        <Col md={1} className="d-flex align-items-center justify-content-center">
          <Button variant="secondary" onClick={handleNextProduct}>
            <i className="bi bi-arrow-right"></i>
          </Button>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <h1 className="text-center">{product.producto}</h1>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={3}>
          <Nav className="flex-column nav-buttons">
            <Button
              variant={activeTab === 'details' ? 'primary' : 'outline-primary'}
              className="mb-2"
              onClick={() => setActiveTab('details')}
            >
              <i className="bi bi-info-circle mr-2"></i>
              Detalles
            </Button>
            <Button
              variant={activeTab === 'packinglist' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('packinglist')}
            >
              <i className="bi bi-list-ul mr-2"></i>
              Packinglist
            </Button>
          </Nav>
        </Col>
        <Col md={9}>
          {activeTab === 'details' && (
            <Table striped bordered hover>
              <tbody>
                <tr>
                  <td><strong>Acabado</strong></td>
                  <td>{product.acabado}</td>
                </tr>
                <tr>
                  <td><strong>M2</strong></td>
                  <td>{product.m2}</td>
                </tr>
                <tr>
                  <td><strong>Dimensiones</strong></td>
                  <td>{product.dimensiones}</td>
                </tr>
                <tr>
                  <td><strong>Número de Tablas</strong></td>
                  <td>{product.nTablas}</td>
                </tr>
                {dynamicFields.map(field => (
                  <tr key={field}>
                    <td><strong>{field}</strong></td>
                    <td>{product[field]}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          {activeTab === 'packinglist' && referencia && (
            <PackingList referencia={referencia} productName={product.producto} />
          )}
          {activeTab === 'packinglist' && !referencia && (
            <div>No reference found for this product.</div>
          )}
        </Col>
      </Row>
      {isLightboxOpen && (
        <Lightbox
          mainSrc={allImages[photoIndex]}
          nextSrc={allImages[(photoIndex + 1) % allImages.length]}
          prevSrc={allImages[(photoIndex + allImages.length - 1) % allImages.length]}
          onCloseRequest={() => setIsLightboxOpen(false)}
          onMovePrevRequest={() => setPhotoIndex((photoIndex + allImages.length - 1) % allImages.length)}
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % allImages.length)}
          reactModalStyle={{ overlay: { zIndex: 1040 } }}
          toolbarButtons={[
            <button
              type="button"
              className="lightbox-close"
              aria-label="Close"
              onClick={() => setIsLightboxOpen(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '2rem',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              &times;
            </button>
          ]}
        />
      )}
    </Container>
  );
};

export default ProductDetail;
