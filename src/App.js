import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Home from './pages/Home';
import Products from './pages/Products';
import Contact from './pages/Contact';
import ContentAdmin from './components/ContentAdmin';
import Login from './components/Login';
import NavigationBar from './components/Navbar';
import Footer from './components/Footer';
import ProductDetail from './components/ProductDetail';
import ProductList from './components/ProductList';
import { getContents } from './services/contentService';

import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getContents();
      setProducts(data);
    };

    fetchData();
  }, []);

  return (
    <Router>
      <div className="App">
        <NavigationBar user={user} />
        <div style={{ marginTop: '56px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />

            <Route path="/products" element={<ProductList products={products} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/product/:id" element={<ProductDetail products={products} />} />
            <Route path="/admin" element={user ? <ContentAdmin /> : <Login onLogin={() => setUser(getAuth().currentUser)} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
