import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';

export function FeaturesStrip() {
  const features = [
    { icon: Truck, title: "Free Shipping", desc: "On orders over ₹999" },
    { icon: ShieldCheck, title: "Secure Payment", desc: "100% protected payments" },
    { icon: RefreshCw, title: "Easy Returns", desc: "30 day return policy" },
    { icon: Headphones, title: "24/7 Support", desc: "Dedicated support team" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 py-8 border-b border-gray-100">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group cursor-default">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
            <feature.icon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">{feature.title}</h4>
            <p className="text-xs text-gray-500">{feature.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}