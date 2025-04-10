import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';

interface Photo {
  id: number;
  src: string;
  alt: string;
  thumbnail?: string;
}

const PhotoGallery = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const touchStartX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // 照片数据 - 使用 useMemo 缓存，避免重复创建
  const photos: Photo[] = useMemo(() => [
    { 
      id: 1, 
      src: '/images/gallery/gallery1.jpg', 
      alt: '婚纱照1',
      thumbnail: '/images/gallery/gallery1.jpg'
    },
    { 
      id: 2, 
      src: '/images/gallery/gallery2.jpg', 
      alt: '婚纱照2',
      thumbnail: '/images/gallery/gallery2.jpg'
    },
    { 
      id: 3, 
      src: '/images/gallery/gallery3.jpg', 
      alt: '婚纱照3',
      thumbnail: '/images/gallery/gallery3.jpg'
    },
    { 
      id: 4, 
      src: '/images/gallery/gallery4.jpg', 
      alt: '婚纱照4',
      thumbnail: '/images/gallery/gallery4.jpg'
    },
    { 
      id: 5, 
      src: '/images/gallery/gallery5.jpg', 
      alt: '婚纱照5',
      thumbnail: '/images/gallery/gallery5.jpg'
    },
    { 
      id: 6, 
      src: '/images/gallery/gallery6.jpg', 
      alt: '婚纱照6',
      thumbnail: '/images/gallery/gallery6.jpg'
    },
  ], []);

  // 预加载图片
  useEffect(() => {
    const preloadImages = async () => {
      try {
        // 预加载缩略图
        const thumbnailPromises = photos.map(photo => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = photo.thumbnail || photo.src;
          });
        });
        
        await Promise.all(thumbnailPromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error('图片预加载失败:', error);
        setImagesLoaded(true); // 即使加载失败也显示内容
      }
    };
    
    preloadImages();
  }, [photos]);

  // 更新当前照片
  useEffect(() => {
    if (selectedPhoto) {
      const index = photos.findIndex(photo => photo.id === selectedPhoto.id);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [selectedPhoto, photos]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
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
    const diff = touchEndX - touchStartX.current;
    
    // 判断滑动方向和距离
    const isSwipe = Math.abs(diff) > 50;
    const isSwipeLeft = diff < 0;
    const isSwipeRight = diff > 0;
    
    if (isSwipe) {
      // 滑动到下一张或上一张
      if (isSwipeLeft && currentIndex < photos.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedPhoto(photos[currentIndex + 1]);
      } else if (isSwipeRight && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        setSelectedPhoto(photos[currentIndex - 1]);
      }
    }
    
    // 重置位置
    setTranslateX(0);
  };

  const handleTouchCancel = () => {
    setTranslateX(0);
  };

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const handleClosePreview = () => {
    setSelectedPhoto(null);
  };

  // 四宫格显示
  const renderPhotoGrid = () => {
    return (
      <div className="grid grid-cols-2 gap-2">
        {photos.map((photo) => (
          <div 
            key={photo.id} 
            className="aspect-square overflow-hidden rounded-sm cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => handlePhotoClick(photo)}
          >
            <img
              src={photo.thumbnail || photo.src}
              alt={photo.alt}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>
    );
  };

  // 照片预览模态框
  const renderPhotoPreview = () => {
    if (!selectedPhoto) return null;

    return createPortal(
      <div 
        className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999]"
        onClick={handleClosePreview}
      >
        <div 
          className="relative w-full h-full flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
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
              className="absolute inset-0 transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(${translateX}px)`,
                zIndex: 2,
              }}
            >
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.alt}
                className="w-full h-full object-contain"
                loading="eager"
                decoding="async"
              />
            </div>
            
            {/* 下一张照片 */}
            {currentIndex < photos.length - 1 && (
              <div
                className="absolute inset-0 transition-transform duration-300 ease-out"
                style={{
                  transform: `translateX(calc(100% + ${translateX}px))`,
                  zIndex: 1,
                }}
              >
                <img
                  src={photos[currentIndex + 1].src}
                  alt={photos[currentIndex + 1].alt}
                  className="w-full h-full object-contain"
                  loading="eager"
                  decoding="async"
                />
              </div>
            )}
            
            {/* 上一张照片 */}
            {currentIndex > 0 && (
              <div
                className="absolute inset-0 transition-transform duration-300 ease-out"
                style={{
                  transform: `translateX(calc(-100% + ${translateX}px))`,
                  zIndex: 1,
                }}
              >
                <img
                  src={photos[currentIndex - 1].src}
                  alt={photos[currentIndex - 1].alt}
                  className="w-full h-full object-contain"
                  loading="eager"
                  decoding="async"
                />
              </div>
            )}
          </div>
          
          {/* 关闭按钮 */}
          <button 
            className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 z-10"
            onClick={handleClosePreview}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
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
                    setSelectedPhoto(photos[index]);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="w-full">
      {renderPhotoGrid()}
      {renderPhotoPreview()}
    </div>
  );
};

export default PhotoGallery;
