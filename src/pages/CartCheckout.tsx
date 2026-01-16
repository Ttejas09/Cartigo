import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CreditCard, Smartphone, Wallet, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type DeliverySlot = Database['public']['Tables']['delivery_slots']['Row'];

const DELIVERY_FEE = 40;

export function CartCheckout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const [deliverySlots, setDeliverySlots] = useState<DeliverySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'COD' | 'CARD'>('UPI');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    loadDeliverySlots();
  }, []);

  async function loadDeliverySlots() {
    try {
      const { data } = await supabase
        .from('delivery_slots')
        .select('*')
        .eq('active', true);

      if (data) {
        setDeliverySlots(data);
        if (data.length > 0) {
          setSelectedSlot(data[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading slots:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePlaceOrder() {
    if (!address.trim() || !email.trim() || !phone.trim() || !selectedSlot) {
      alert('Please fill in all required fields');
      return;
    }

    setPlacing(true);

    try {
      const totalAmount = total + DELIVERY_FEE;
      console.log('Order placed:', {
        items: items.length,
        total: totalAmount,
        paymentMethod,
        address,
        email,
        phone,
        deliverySlotId: selectedSlot
      });

      setOrderPlaced(true);

      setTimeout(() => {
        clearCart();
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

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Go back to shopping
          </button>
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
          <p className="text-gray-600 mb-4">You will receive a confirmation email shortly.</p>
          <p className="text-sm text-gray-500">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  const totalAmount = total + DELIVERY_FEE;

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
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Items</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+91 9876543210"
                  />
                </div>
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
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>₹{DELIVERY_FEE}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placing || !address.trim() || !email.trim() || !phone.trim()}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {placing ? 'Placing Order...' : 'Place Order'}
              </button>

              <button
                onClick={() => navigate('/cart')}
                className="w-full mt-3 py-3 border-2 border-gray-300 text-gray-800 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Edit Cart
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
