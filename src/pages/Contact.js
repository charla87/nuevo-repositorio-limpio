import React from 'react';

const Contact = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center">Contacto</h1>
      <p className="lead text-center">Para más información, contáctanos a través del formulario a continuación.</p>
      <div className="row mt-4">
        <div className="col-md-6">
          <h3 className="text-center">Información de Contacto</h3>
          <p className="text-center">Puedes encontrarnos en nuestra oficina central o comunicarte con nosotros a través de los siguientes medios:</p>
          <ul className="list-unstyled text-center">
            <li><strong>Dirección:</strong> 123 Calle Principal, Ciudad, País</li>
            <li><strong>Teléfono:</strong> +123 456 7890</li>
            <li><strong>Email:</strong> info@quartziteshub.com</li>
          </ul>
        </div>
        <div className="col-md-6">
          <h3 className="text-center">Formulario de Contacto</h3>
          <form className="mt-3">
            <div className="mb-3">
              <label className="form-label">Nombre:</label>
              <input type="text" className="form-control" name="name" />
            </div>
            <div className="mb-3">
              <label className="form-label">Email:</label>
              <input type="email" className="form-control" name="email" />
            </div>
            <div className="mb-3">
              <label className="form-label">Mensaje:</label>
              <textarea className="form-control" name="message"></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-100">Enviar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
