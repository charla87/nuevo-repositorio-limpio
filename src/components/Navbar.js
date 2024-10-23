import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // eslint-disable-next-line 
import { getAuth, signOut } from 'firebase/auth'; 
import { auth } from '../firebaseConfig'; // Importa auth correctamente desde firebaseConfig

const NavigationBar = ({ user }) => {
  const handleLogout = () => {
    signOut(auth).then(() => {
      console.log("User signed out");
    }).catch((error) => {
      console.error("Error signing out: ", error);
    });
  };

  return (
    <Navbar bg="dark" expand="lg" variant="dark" fixed="top">
      <Navbar.Brand as={Link} to="/">Quartzites Hub</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/products">Products</Nav.Link>
          <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
          <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
        </Nav>
        {user ? (
          <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
        ) : (
          <Button variant="outline-primary" as={Link} to="/login">Login</Button>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
