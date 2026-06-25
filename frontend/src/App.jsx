import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import Header from './components/Header.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import FloatingHelp from './components/FloatingHelp.jsx';
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import Product from './pages/Product.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Success from './pages/Success.jsx';
import Admin from './pages/Admin.jsx';
import Help from './pages/Help.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Header />
        <CartDrawer />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogue" element={<Catalog />} />
            <Route path="/produit/:id" element={<Product />} />
            <Route path="/panier" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/aide" element={<Help />} />
          </Routes>
        </main>
        <FloatingHelp />
      </CartProvider>
    </BrowserRouter>
  );
}
