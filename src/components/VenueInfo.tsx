import { useEffect, useState } from 'react';
import LocationMap from './LocationMap';
import '../styles/fonts.css';

const VenueInfo = () => {
  const [isEnglish, setIsEnglish] = useState(false);

  const toggleLanguage = () => {
    setIsEnglish(!isEnglish);
  };

  const tips = {
    zh: [
      "户外仪式，建议穿着浅色衣服，一起来见证我们的幸福时刻",
      "酒店可免费停车，请勿饮酒后驾车",
      "感谢各位远道而来，如有服务不周，敬请见谅",
      "请带着最开心的心情来参加我们的婚礼",
      "赴宴请私信新人"
    ],
    en: [
      "Outdoor ceremony, light-colored attire recommended, let's witness our happy moment together",
      "Free parking available at the hotel, please do not drive after drinking",
      "Thank you for coming from afar, we apologize for any inconvenience",
      "Please bring your happiest mood to our wedding",
      "Please contact the couple privately for attendance confirmation"
    ]
  };

  return (
    <div className="mt-8 w-full fade-in font-shaonv" style={{ animationDelay: '0.4s' }}>
      
      <div className="mb-6 -mx-4 sm:-mx-6 md:-mx-8">
        <img 
          src="/timeline-image.png" 
          alt="婚礼流程" 
          className="w-full"
        />
      </div>

      <LocationMap />

      <div className="mt-8 -mx-4 sm:-mx-6 md:-mx-8">
        <div className="relative mb-2">
          <h3 className="text-sm font-light text-center text-[#887e72]">新人碎碎念</h3>
          <button 
            onClick={toggleLanguage}
            className="absolute right-0 top-0 text-xs py-0.5 px-1.5 text-[#887e72]/60 hover:text-[#887e72] hover:bg-[#887e72]/5 rounded-sm transition-colors duration-300"
          >
            {isEnglish ? '中文' : 'English'}
          </button>
        </div>
        <div className="space-y-2 px-4 sm:px-6 md:px-8">
          {tips[isEnglish ? 'en' : 'zh'].map((tip, index) => (
            <p key={index} className="text-xs leading-tight text-[#887e72]">* {tip}</p>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center text-sm">
        <p className="mb-1">这场婚礼</p>
        <p className="mb-1">将是我们终身浪漫的开始</p>
        <p className="mt-2 text-[#887e72]/70">The beginning of our lifelong romance</p>
        <p className="mt-6 text-[#887e72]/70">DUAN & JIA</p>
      </div>
    </div>
  );
};

export default VenueInfo;
