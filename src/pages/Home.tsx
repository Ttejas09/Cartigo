import { useEffect, useState } from 'react';
// import { Header } from '../components/Header'; // Uncomment if not using global header in App.tsx
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { StoreCard } from '../components/StoreCard';
import { AdBanner } from '../components/AdBanner';
import { FeaturesStrip } from '../components/FeaturesStrip'; // Added import
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Category = Database['public']['Tables']['categories']['Row'];
type Store = Database['public']['Tables']['stores']['Row'];
type Product = Database['public']['Tables']['products']['Row'] & {
  stores?: { name: string } | null;
};

export function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [categoriesRes, storesRes, productsRes] = await Promise.all([
        supabase.from('categories').select('*'),
        supabase.from('stores').select('*').limit(6),
        supabase
          .from('products')
          .select('*, stores(name)')
          .limit(8)
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (storesRes.data) setStores(storesRes.data);
      if (productsRes.data) setProducts(productsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-10">
        
        {/* 1. Flash Sale Banner - UPDATED to Cool/Premium Style */}
        <section className="animate-fade-in">
          <AdBanner
            title="Flash Sale!"
            subtitle="Up to 60% off on all fashion items"
            buttonText="Shop Now"
            imageUrl="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80"
            // Using the Cool Indigo/Violet Gradient
            bgColor="from-indigo-600 to-violet-600"
            textColor="text-white"
          />
        </section>

        {/* 2. NEW: Features Strip (Trust Signals) */}
        {/* This adds the "Free Shipping", "Secure Payment" strip */}
        <section>
          <FeaturesStrip />
        </section>

        {/* 3. Categories */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-6 ml-1">Categories</h2>
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide px-1">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                name={category.name}
                icon={category.icon}
                onClick={() => console.log(`Clicked ${category.name}`)}
              />
            ))}
          </div>
        </section>

        {/* 4. Second Banner (Same Day Delivery) */}
        <section className="animate-fade-in">
          <AdBanner
            title="Same Day Delivery"
            subtitle="Order now and get it delivered today"
            buttonText="Order Now"
            imageUrl="https://images.pexels.com/photos/4393426/pexels-photo-4393426.jpeg?auto=compress&cs=tinysrgb&w=800"
            // Kept Green/Teal but made it slightly deeper/richer
            bgColor="from-emerald-600 to-teal-600"
            textColor="text-white"
          />
        </section>

        {/* 5. Stores Near You */}
        {stores.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6 px-1">
              <h2 className="text-xl font-bold text-slate-900">Stores Near You</h2>
              <button className="text-indigo-600 text-sm font-semibold hover:underline">View All</button>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-6 scrollbar-hide px-1">
              {stores.map((store) => (
                <StoreCard
                  key={store.id}
                  name={store.name}
                  location={store.location}
                  rating={store.rating}
                  verified={store.verified}
                  imageUrl={store.image_url || undefined}
                />
              ))}
            </div>
          </section>
        )}

        {/* 6. Featured Products */}
        <section>
          <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="text-xl font-bold text-slate-900">Featured Products</h2>
            <button className="text-indigo-600 text-sm font-semibold hover:underline">View All</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.original_price || undefined}
                image={product.images?.[0] || 'https://via.placeholder.com/300'}
                storeName={product.stores?.name}
              />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
} 