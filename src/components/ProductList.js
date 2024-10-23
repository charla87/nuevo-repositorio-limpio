import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getContents } from '../services/contentService';
import { Card, Container, Row, Col, Spinner } from 'react-bootstrap';

const ProductList = () => {
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
                <Card.Text>{product.acabado}</Card.Text>
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

export default ProductList;
