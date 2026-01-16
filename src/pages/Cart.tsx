import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';

import { useCart } from '../context/CartContext';

export function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 py-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Add some items to get started!</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95"
            >
              Continue Shopping
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">


      <main className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all"
              >
                <div className="flex gap-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
                    {item.storeName && (
                      <p className="text-sm text-gray-500 mt-1">{item.storeName}</p>
                    )}

                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="w-8 text-center font-semibold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right flex flex-col justify-between">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                      {item.originalPrice && (
                        <p className="text-sm text-gray-400 line-through">
                          ₹{(item.originalPrice * item.quantity).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 space-y-4">
              <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>

              <div className="space-y-3 border-b pb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>To be calculated</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString()}</span>
              </div>

              <button
                onClick={() => navigate('/cart/checkout')}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full py-3 border-2 border-gray-300 text-gray-800 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Continue Shopping
              </button>

              {items.length > 1 && (
                <button
                  onClick={clearCart}
                  className="w-full py-2 text-red-600 text-sm hover:bg-red-50 rounded-lg transition-colors"
                >
                  Clear Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
