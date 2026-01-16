import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, Package, ShieldCheck, MapPin, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'] & {
  stores?: { name: string; location: string } | null;
};

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cartAdded, setCartAdded] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  async function loadProduct() {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, stores(name, location)')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setProduct(data);
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
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
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

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

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                    {discount}% OFF
                  </div>
                )}
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? 'border-blue-600 scale-105'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">4.5</span>
                  <span className="text-sm">(127 reviews)</span>
                </div>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-4xl font-bold text-gray-900">₹{product.price}</span>
                  {product.original_price && (
                    <span className="text-xl text-gray-400 line-through">
                      ₹{product.original_price}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {product.open_box_delivery && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-200">
                    <Package className="w-4 h-4" />
                    <span className="text-sm font-medium">Open Box Delivery Available</span>
                  </div>
                )}
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-sm font-medium">100% Original</span>
                </div>
              </div>

              {product.description && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}

              {product.stores && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Seller Information</h3>
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <BadgeCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-800">
                        Sold by: {product.stores.name}
                      </p>
                      <div className="flex items-center gap-2 text-gray-600 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{product.stores.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-800 mb-2">Return Policy</h3>
                <p className="text-gray-600">{product.return_policy}</p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => navigate(`/checkout/${product.id}`)}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => {
                    addItem({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      originalPrice: product.original_price || undefined,
                      image: product.images[0] || '',
                      quantity: 1,
                      storeId: product.store_id || '',
                      storeName: product.stores?.name
                    });
                    setCartAdded(true);
                    setTimeout(() => setCartAdded(false), 2000);
                  }}
                  className={`px-8 py-4 border-2 rounded-xl font-semibold transition-all ${
                    cartAdded
                      ? 'bg-green-50 border-green-600 text-green-600'
                      : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {cartAdded ? 'Added to Cart' : 'Add to Cart'}
                </button>
              </div>

              {product.stock > 0 && product.stock < 10 && (
                <p className="text-orange-600 text-sm font-medium">
                  Only {product.stock} items left in stock!
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
