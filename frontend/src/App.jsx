import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import Header from './components/Header.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import FloatingHelp from './components/FloatingHelp.jsx';
import ToastContainer from './components/Toast.jsx';
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import Product from './pages/Product.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Success from './pages/Success.jsx';
import Admin from './pages/Admin.jsx';
import Help from './pages/Help.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

function PageWrapper({ children }) {
  const { pathname } = useLocation();
  const [cls, setCls] = useState('page-in');
  useEffect(() => {
    setCls('');
    const t = setTimeout(() => setCls('page-in'), 10);
    return () => clearTimeout(t);
  }, [pathname]);
  return <div className={cls}>{children}</div>;
}

function ScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    const observe = () => document.querySelectorAll('.reveal:not(.revealed)').forEach(el => io.observe(el));
    observe();
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
  return null;
}

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button
      className="back-to-top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Retour en haut"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="m18 15-6-6-6 6"/>
      </svg>
      <style>{`
        .back-to-top {
          position: fixed; bottom: 96px; right: 24px; z-index: 490;
          background: white; color: var(--text);
          border: 1.5px solid var(--border);
          width: 44px; height: 44px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; box-shadow: var(--shadow);
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          animation: fadeIn 0.3s ease;
        }
        .back-to-top:hover {
          background: var(--gradient); color: white; border-color: transparent;
          transform: scale(1.12) translateY(-2px); box-shadow: var(--shadow-primary);
        }
      `}</style>
    </button>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ScrollToTop />
        <ScrollReveal />
        <Header />
        <CartDrawer />
        <main>
          <PageWrapper>
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
          </PageWrapper>
        </main>
        <FloatingHelp />
        <BackToTop />
        <ToastContainer />
      </CartProvider>
    </BrowserRouter>
  );
}
