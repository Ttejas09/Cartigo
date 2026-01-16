import { MapPin, Star, BadgeCheck } from 'lucide-react';

interface StoreCardProps {
  name: string;
  location: string;
  rating: number;
  verified: boolean;
  imageUrl?: string;
}

export function StoreCard({ name, location, rating, verified, imageUrl }: StoreCardProps) {
  return (
    <div className="flex-shrink-0 w-72 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 cursor-pointer">
      <div className="h-40 bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-bold text-blue-600">{name.charAt(0)}</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-gray-800 text-lg">{name}</h3>
          {verified && (
            <BadgeCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
          )}
        </div>

        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{location}</span>
        </div>

        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold text-gray-800">{rating}</span>
          <span className="text-sm text-gray-500 ml-1">rating</span>
        </div>
      </div>
    </div>
  );
}
