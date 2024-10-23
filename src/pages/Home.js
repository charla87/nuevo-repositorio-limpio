import React from 'react';
import { Carousel } from 'react-bootstrap';
import '../App.css';  // Asegúrate de que esta ruta sea correcta

const Home = () => {
  return (
    <div className="container mt-5 home-container"> {/* Añadir clase personalizada */}
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://via.placeholder.com/800x400"
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>Bienvenido a QUARTZITES HUB</h3>
            <p>Comercialización de cuarcitas de alta calidad</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://via.placeholder.com/800x400"
            alt="Second slide"
          />
          <Carousel.Caption>
            <h3>Variedad y Calidad</h3>
            <p>Encuentra la cuarcita perfecta para tu proyecto</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://via.placeholder.com/800x400"
            alt="Third slide"
          />
          <Carousel.Caption>
            <h3>Asesoramiento Personalizado</h3>
            <p>Te ayudamos a elegir la mejor opción</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <section className="my-5">
        <h2 className="text-center">¿Por qué elegir QUARTZITES HUB?</h2>
        <p className="lead text-center">Nos dedicamos a ofrecer cuarcitas de la más alta calidad con un servicio excepcional.</p>
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="card">
              <img src="https://via.placeholder.com/300" className="card-img-top" alt="Calidad" />
              <div className="card-body">
                <h5 className="card-title">Calidad Inigualable</h5>
                <p className="card-text">Nuestras cuarcitas son seleccionadas cuidadosamente para garantizar la mejor calidad en cada pieza.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <img src="https://via.placeholder.com/300" className="card-img-top" alt="Variedad" />
              <div className="card-body">
                <h5 className="card-title">Amplia Variedad</h5>
                <p className="card-text">Ofrecemos una amplia gama de cuarcitas en diferentes colores y texturas para satisfacer todas tus necesidades.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <img src="https://via.placeholder.com/300" className="card-img-top" alt="Servicio" />
              <div className="card-body">
                <h5 className="card-title">Servicio Personalizado</h5>
                <p className="card-text">Nuestro equipo de expertos está siempre disponible para brindarte asesoramiento y soporte personalizado.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
