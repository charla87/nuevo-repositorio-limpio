import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getContents } from '../services/contentService';
import { Card, Container, Row, Col, Spinner } from 'react-bootstrap';
import './Products.css'; // Importa el archivo CSS aquí

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getContents();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <Spinner animation="border" />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">All Products</h1>
      <Row>
        {products.map((product) => (
          <Col key={product.id} md={4} className="mb-4">
            <Card>
              <Card.Img variant="top" src={product.imagenPrincipal} />
              <Card.Body>
                <Card.Title>{product.producto}</Card.Title>
                <Card.Text><strong>Acabado:</strong> {product.acabado}</Card.Text>
                <Card.Text><strong>M2:</strong> {product.m2}</Card.Text>
                <Card.Text><strong>Dimensiones:</strong> {product.dimensiones}</Card.Text>
                <Card.Text><strong>Número de Tablas:</strong> {product.nTablas}</Card.Text>
                {Object.keys(product).filter(key => !['id', 'producto', 'acabado', 'nTablas', 'galeriaImagen', 'imagenPrincipal', 'm2', 'dimensiones'].includes(key)).map(field => (
                  <Card.Text key={field}><strong>{field}:</strong> {product[field]}</Card.Text>
                ))}
                <Link to={`/product/${product.id}`} className="btn btn-primary">
                  View Details
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Products;
