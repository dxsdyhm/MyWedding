import { useState, useRef, useEffect } from 'react';

interface Photo {
  id: number;
  src: string;
  alt: string;
}

const PhotoGallery = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const touchStartX = useRef(0);
  const touchStartTime = useRef(0);
  const animationFrameRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  // 照片数据
  const photos: Photo[] = [
    { id: 1, src: '/images/photo1.jpg', alt: '婚纱照1' },
    { id: 2, src: '/images/photo2.jpg', alt: '婚纱照2' },
    { id: 3, src: '/images/photo3.jpg', alt: '婚纱照3' },
    { id: 4, src: '/images/photo4.jpg', alt: '婚纱照4' },
    { id: 5, src: '/images/photo5.jpg', alt: '婚纱照5' },
    { id: 6, src: '/images/photo6.jpg', alt: '婚纱照6' },
  ];

  // 更新当前照片
  useEffect(() => {
    setSelectedPhoto(photos[currentIndex]);
  }, [currentIndex]);

  // 清理动画帧
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
    setIsTransitioning(false);
    setTranslateX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!selectedPhoto) return;
    
    const touchX = e.touches[0].clientX;
    const diff = touchX - touchStartX.current;
    setTranslateX(diff);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!selectedPhoto) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndTime = Date.now();
    const diff = touchEndX - touchStartX.current;
    const duration = touchEndTime - touchStartTime.current;
    const velocity = Math.abs(diff) / duration;
    
    // 判断滑动方向和距离
    const isSwipe = Math.abs(diff) > 50 || velocity > 0.5;
    const isSwipeLeft = diff < 0;
    const isSwipeRight = diff > 0;
    
    if (isSwipe) {
      setIsTransitioning(true);
      
      // 使用requestAnimationFrame实现平滑动画
      const startTime = performance.now();
      const startX = translateX;
      const targetX = isSwipeLeft ? -window.innerWidth : window.innerWidth;
      const duration = 300; // 动画持续时间（毫秒）
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 使用缓动函数使动画更自然
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        const currentX = startX + (targetX - startX) * easeProgress;
        setTranslateX(currentX);
        
        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          // 动画结束，更新索引
          if (isSwipeLeft && currentIndex < photos.length - 1) {
            setCurrentIndex(prev => prev + 1);
          } else if (isSwipeRight && currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
          }
          
          // 重置状态
          setIsTransitioning(false);
          setTimeout(() => {
            setTranslateX(0);
          }, 50);
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      // 如果没有达到滑动阈值，回到原位
      setIsTransitioning(true);
      
      const startTime = performance.now();
      const startX = translateX;
      const duration = 300;
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        const currentX = startX * (1 - easeProgress);
        setTranslateX(currentX);
        
        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          setIsTransitioning(false);
          setTranslateX(0);
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  };

  const handleTouchCancel = () => {
    setIsTransitioning(false);
    setTranslateX(0);
  };

  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      {selectedPhoto && (
        <div
          ref={containerRef}
          className="relative w-full h-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
        >
          {/* 当前照片 */}
          <div
            className="absolute inset-0 transition-transform duration-300"
            style={{
              transform: `translateX(${translateX}px)`,
              zIndex: 2,
            }}
          >
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* 下一张照片 */}
          {currentIndex < photos.length - 1 && (
            <div
              className="absolute inset-0 transition-transform duration-300"
              style={{
                transform: `translateX(calc(100% + ${translateX}px))`,
                zIndex: 1,
              }}
            >
              <img
                src={photos[currentIndex + 1].src}
                alt={photos[currentIndex + 1].alt}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* 上一张照片 */}
          {currentIndex > 0 && (
            <div
              className="absolute inset-0 transition-transform duration-300"
              style={{
                transform: `translateX(calc(-100% + ${translateX}px))`,
                zIndex: 1,
              }}
            >
              <img
                src={photos[currentIndex - 1].src}
                alt={photos[currentIndex - 1].alt}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      )}
      
      {/* 指示器 */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {photos.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => {
              if (index !== currentIndex) {
                setCurrentIndex(index);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;
