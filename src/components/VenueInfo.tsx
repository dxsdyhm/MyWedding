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
          <p className="text-xs leading-tight text-[#887e72]">* 户外仪式，建议穿着浅色衣服，一起来见证我们的幸福时刻</p>
          <p className="text-xs leading-tight text-[#887e72]">* 酒店可免费停车，请勿饮酒后驾车</p>
          <p className="text-xs leading-tight text-[#887e72]">* 感谢各位远道而来，如有服务不周，敬请见谅</p>
          <p className="text-xs leading-tight text-[#887e72]">* 请带着最开心的心情来参加我们的婚礼</p>
          <p className="text-xs leading-tight text-[#887e72]">* 赴宴请私信新人</p>
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
