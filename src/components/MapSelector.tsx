import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface MapSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (mapType: 'baidu' | 'qq' | 'amap') => void;
}

const MapSelector = ({ isOpen, onClose, onSelect }: MapSelectorProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 bg-black/50 flex items-end justify-center z-[9999]"
      onClick={handleBackdropClick}
    >
      <div className="bg-green-50 rounded-t-lg p-4 w-full max-w-md animate-slide-up">
        <div className="w-12 h-1 bg-green-200 rounded-full mx-auto mb-4"></div>
        <h3 className="text-lg font-medium mb-4 text-center text-green-800">选择导航应用</h3>
        <div className="space-y-3">
          <button
            onClick={() => onSelect('baidu')}
            className="w-full py-3 px-4 bg-green-600/10 hover:bg-green-600/20 rounded-sm transition-colors duration-300 text-sm text-green-800"
          >
            百度地图
          </button>
          <button
            onClick={() => onSelect('amap')}
            className="w-full py-3 px-4 bg-green-600/10 hover:bg-green-600/20 rounded-sm transition-colors duration-300 text-sm text-green-800"
          >
            高德地图
          </button>
          <button
            onClick={() => onSelect('qq')}
            className="w-full py-3 px-4 bg-green-600/10 hover:bg-green-600/20 rounded-sm transition-colors duration-300 text-sm text-green-800"
          >
            腾讯地图
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-sm transition-colors duration-300 text-sm mt-4"
          >
            取消
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MapSelector; 