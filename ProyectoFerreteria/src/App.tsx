import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Cart } from './pages/Cart';
import { Login } from './pages/Login';
import { AdminPanel } from './pages/AdminPanel';
import { Checkout } from './pages/Checkout';
import { MyOrders } from './pages/MyOrders';
import { ProductDetails } from './pages/ProductDetails';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Footer } from './components/Footer';

import { Faq } from './pages/Faq';

function AppRoutes() {
  const { isAdmin, user } = useAuth();

  return (
    <Routes>
      {/* Admin route protected */}
      <Route
        path="/admin"
        element={isAdmin ? <AdminPanel /> : <Navigate to="/login" replace />}
      />

      {/* Main routes with Navbar and standard footer */}
      <Route path="/*" element={
        <>
          <Navbar />
          <div style={{ flex: 1 }}>
            <Routes>
              <Route index element={<Home />} />
              <Route path="productos" element={<Shop />} />
              <Route path="carrito" element={<Cart />} />
              <Route path="login" element={<Login />} />
              <Route path="finalizar-compra" element={user ? <Checkout /> : <Navigate to="/login" />} />
              <Route path="mis-pedidos" element={user ? <MyOrders /> : <Navigate to="/login" />} />
              <Route path="preguntas" element={<Faq />} />
              <Route path="producto/:id" element={<ProductDetails />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
        </>
      } />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <AppRoutes />
            </div>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
