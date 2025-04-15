import { useState, useEffect, lazy, Suspense } from "react";
import AudioPlayer from "./components/AudioPlayer";
import WechatConfig from "./components/WechatConfig";

// 使用懒加载组件
const VenueInfo = lazy(() => import("./components/VenueInfo"));
const PhotoGallery = lazy(() => import("./components/PhotoGallery"));

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'photos'>('info');

  useEffect(() => {
    // 确保资源加载完成
    const loadResources = async () => {
      try {
        // 预加载关键图片
        const img = new Image();
        img.src = '/images/couple.webp';
        await img.decode();
        
        setIsLoaded(true);
      } catch (error) {
        // 即使加载失败也显示内容
        setIsLoaded(true);
      }
    };

    loadResources();
  }, []);

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-start p-4 pt-2 select-none overflow-x-hidden"
      style={{ 
        background: `
          linear-gradient(180deg, #e6f3ff 0%, #ffffff 100%),
          repeating-linear-gradient(45deg, #ffffff 0px, #ffffff 2px, transparent 2px, transparent 4px),
          repeating-linear-gradient(-45deg, #ffffff 0px, #ffffff 2px, transparent 2px, transparent 4px)
        `,
        backgroundBlendMode: "soft-light",
        backgroundAttachment: "fixed"
      }}
    >
      <WechatConfig />
      <div
        className={`w-full max-w-md mx-auto rounded-md p-4 sm:p-8 pb-24 transition-opacity duration-1000 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ fontFamily: "'Montserrat', sans-serif", color: "#887e72" }}
      >
        <div className="mb-4 fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xs font-light tracking-wide uppercase text-center">WE SINCERELY INVITE YOU</h2>
          <h2 className="text-xs font-light tracking-wide uppercase mt-1 text-center">TO OUR WEDDING</h2>
        </div>

        <h1
          className="text-6xl sm:text-7xl my-8 text-[#887e72] text-center fade-in"
          style={{ fontFamily: "'Great Vibes', cursive", animationDelay: '0.3s' }}
        >
          Wedding
        </h1>

        <div className="text-center fade-in" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-base mb-1 font-light">婚礼邀请函</h3>
          <p className="text-sm text-[#887e72]/70">Wedding Invitation</p>
        </div>

        <div className="fade-in" style={{ animationDelay: '0.5s' }}>
          <p className="text-xs mt-6 mb-2 font-light text-center">诚挚邀请您</p>
          <p className="text-xs mb-2 font-light text-center">前来见证我们的爱与喜悦</p>
          <p className="text-xs mb-8 font-light text-center text-[#887e72]/70">Sincerely invite you to witness our love and joy</p>
        </div>

        <div className="mt-6 mb-12 fade-in relative" style={{ animationDelay: '0.6s' }}>
          <img
            src="/images/couple.webp"
            alt="新人合影"
            className="w-full h-auto rounded-sm shadow-sm mx-auto"
            loading="eager"
          />
          <p className="text-center mt-4 text-sm font-light text-[#887e72] tracking-widest">段雪松 / 贾坤</p>
          
          <div className="mt-12 space-y-2 text-[#887e72]">
            <p className="text-xs">日期：2025/05/10 (星期六)</p>
            <p className="text-xs opacity-80">Date: 2025/05/10 (Sat.)</p>
            <p className="text-xs mt-4">地址：湖北省黄石市富力万达嘉华酒店</p>
            <p className="text-xs opacity-80">Address: Wanda Realm, Huangshi City, Hubei Province</p>
          </div>
        </div>

        <div className="mt-12 fade-in" style={{ animationDelay: '0.7s' }}>
          <div className="flex mb-6">
            <button
              className={`flex-1 py-2 text-sm font-light ${activeTab === 'info' ? 'border-b-2 border-[#887e72]' : 'opacity-70'}`}
              onClick={() => setActiveTab('info')}
            >
              婚礼
            </button>
            <button
              className={`flex-1 py-2 text-sm font-light ${activeTab === 'photos' ? 'border-b-2 border-[#887e72]' : 'opacity-70'}`}
              onClick={() => setActiveTab('photos')}
            >
              相册
            </button>
          </div>

          <Suspense fallback={<div className="text-center py-8">加载中...</div>}>
            <div>
              <div className={`${activeTab === 'info' ? 'block' : 'hidden'}`}>
                <VenueInfo />
              </div>
              <div className={`${activeTab === 'photos' ? 'block' : 'hidden'}`}>
                <PhotoGallery />
              </div>
            </div>
          </Suspense>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-center px-4 py-2">
        <div className={`text-[#887e72]/70 text-xs text-center transition-opacity duration-1000 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <p>段雪松 & 贾坤</p>
          <p className="mt-1">© 2025 | 好久不见 婚礼见！</p>
        </div>
      </div>
      <AudioPlayer />
    </div>
  );
}

export default App;

