import { useEffect, useState } from 'react';
import LocationMap from './LocationMap';
import '../styles/fonts.css';

const VenueInfo = () => {
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
        <h3 className="text-sm font-light mb-2 text-center text-[#887e72]">新人碎碎念</h3>
        <div className="space-y-2 px-4 sm:px-6 md:px-8">
          <p className="text-xs leading-tight text-[#887e72]">* 戶外儀式，請穿著繽紛色彩的衣服，一起來見證我們的幸福時刻</p>
          <p className="text-xs leading-tight text-[#887e72]">* 感謝各位遠道而來，如有服務不周，敬請見諒</p>
          <p className="text-xs leading-tight text-[#887e72]">* 請帶著最開心的心情來參加我們的婚禮</p>
          <p className="text-xs leading-tight text-[#887e72]">* 赴宴請私信新人</p>
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
