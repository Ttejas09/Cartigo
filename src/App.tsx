import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header'; // Import Header
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { Checkout } from './pages/Checkout';
import { Cart } from './pages/Cart';
import { CartCheckout } from './pages/CartCheckout';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        {/* Main Application Wrapper with White Background */}
        <div className="min-h-screen bg-white font-sans text-gray-900">
          
          {/* Header is placed here to show on every page */}
          <Header />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout/:productId" element={<Checkout />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/cart/checkout" element={<CartCheckout />} />
          </Routes>
          
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;