import React from 'react';

interface AdBannerProps {
  title: string;
  subtitle: string;
  buttonText: string;
  imageUrl: string;
  bgColor?: string;
  textColor?: string;
}

export function AdBanner({ 
  title, 
  subtitle, 
  buttonText, 
  imageUrl, 
  // Updated default to match the light blue gradient in the screenshot
  bgColor = 'from-blue-100 to-blue-200',
  // New prop to handle text color flexibility (defaulting to dark for this design)
  textColor = 'text-slate-800'
}: AdBannerProps) {
  return (
    <div className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-r ${bgColor} shadow-sm transition-all duration-300 hover:shadow-md min-h-[260px] flex items-center`}>
      
      {/* Content Section */}
      <div className="relative z-10 p-8 md:p-12 w-full md:w-2/3 flex flex-col items-start">
        <h2 className={`text-3xl md:text-5xl font-bold mb-4 tracking-tight ${textColor} animate-fade-in`}>
          {title}
        </h2>
        
        <p className={`text-lg md:text-xl mb-8 font-medium ${textColor} opacity-80 max-w-md`}>
          {subtitle}
        </p>
        
        <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold border border-blue-100 shadow-md hover:shadow-lg hover:bg-gray-50 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
          {buttonText}
        </button>
      </div>

      {/* Image Section with Gradient Fade */}
      <div className="absolute right-0 top-0 h-full w-3/5 hidden md:block pointer-events-none">
        <div className="w-full h-full relative">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover object-center mix-blend-multiply opacity-90"
            // This mask creates the smooth fade-out effect to the left
            style={{ 
              maskImage: 'linear-gradient(to right, transparent, black 40%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)' 
            }}
          />
        </div>
      </div>
      
    </div>
  );
}