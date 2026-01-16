import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CreditCard, Smartphone, Wallet, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];
type DeliverySlot = Database['public']['Tables']['delivery_slots']['Row'];

const DELIVERY_FEE = 40;

export function Checkout() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [deliverySlots, setDeliverySlots] = useState<DeliverySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'COD' | 'CARD'>('UPI');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    loadData();
  }, [productId]);

  async function loadData() {
    if (!productId) return;

    try {
      const [productRes, slotsRes] = await Promise.all([
        supabase.from('products').select('*').eq('id', productId).maybeSingle(),
        supabase.from('delivery_slots').select('*').eq('active', true)
      ]);

      if (productRes.data) setProduct(productRes.data);
      if (slotsRes.data) {
        setDeliverySlots(slotsRes.data);
        if (slotsRes.data.length > 0) {
          setSelectedSlot(slotsRes.data[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePlaceOrder() {
    if (!product || !selectedSlot || !address.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setPlacing(true);

    try {
      const totalAmount = product.price + DELIVERY_FEE;

      setOrderPlaced(true);

      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6 animate-bounce" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  const totalAmount = product.price + DELIVERY_FEE;

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-4xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Product Details</h2>
              <div className="flex gap-4">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-gray-600 mt-1">Quantity: 1</p>
                  <p className="text-lg font-bold text-gray-900 mt-2">₹{product.price}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Delivery Slot
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {deliverySlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                      selectedSlot === slot.id
                        ? 'border-blue-600 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-semibold text-gray-800">{slot.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Delivery Address</h2>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your complete delivery address..."
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
              />
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { id: 'UPI', label: 'UPI', icon: Smartphone },
                  { id: 'COD', label: 'Cash on Delivery', icon: Wallet },
                  { id: 'CARD', label: 'Credit/Debit Card', icon: CreditCard }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setPaymentMethod(id as typeof paymentMethod)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all transform hover:scale-[1.02] ${
                      paymentMethod === id
                        ? 'border-blue-600 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-800">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Bill Details</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Item Total</span>
                  <span>₹{product.price}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>₹{DELIVERY_FEE}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placing || !address.trim()}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {placing ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
