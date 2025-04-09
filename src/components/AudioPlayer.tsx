import { useRef, useState, useEffect } from 'react';
import { Howl } from 'howler';

// 为微信JSBridge添加类型声明
declare global {
  interface Window {
    WeixinJSBridge?: any;
  }
}

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const soundRef = useRef<Howl | null>(null);

  // 检测是否在微信浏览器中
  const isWeixinBrowser = () => {
    return navigator.userAgent.toLowerCase().includes('micromessenger');
  };

  // 初始化音频
  useEffect(() => {
    // 生成带随机参数的音频文件路径，避免缓存问题
    const audioSrc = `/music/wedding_music.mp3?v=${Date.now()}`;
    
    // 创建Howl实例
    const sound = new Howl({
      src: [audioSrc],
      loop: true,
      preload: true,
      volume: 0.3,
      html5: false, // 使用Web Audio API而不是HTML5 Audio
      onload: () => {
        // 微信浏览器特殊处理
        if (isWeixinBrowser()) {
          // 监听微信的 WeixinJSBridgeReady 事件
          const handleWeixinJSBridgeReady = () => {
            sound.play();
            setIsPlaying(true);
            setHasInteracted(true);
          };
          
          // 如果已经就绪，直接调用
          if (window.WeixinJSBridge) {
            window.WeixinJSBridge.invoke('getNetworkType', {}, handleWeixinJSBridgeReady);
          } else {
            // 否则添加事件监听
            document.addEventListener('WeixinJSBridgeReady', handleWeixinJSBridgeReady, false);
          }
          
          return () => {
            document.removeEventListener('WeixinJSBridgeReady', handleWeixinJSBridgeReady);
          };
        } else {
          // 非微信浏览器尝试自动播放
          sound.play();
          setIsPlaying(true);
          setHasInteracted(true);
        }
      },
      onplay: () => {
        setIsPlaying(true);
      },
      onpause: () => {
        setIsPlaying(false);
      },
      onstop: () => {
        setIsPlaying(false);
      },
      onend: () => {
        setIsPlaying(false);
      },
      onloaderror: (id, error) => {
        // 音频加载错误处理
      },
      onplayerror: (id, error) => {
        // 音频播放错误处理
      }
    });
    
    soundRef.current = sound;
    
    // 清理函数
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
        soundRef.current = null;
      }
    };
  }, []);

  // 监听页面可见性变化
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 页面隐藏时暂停音乐
        if (soundRef.current && isPlaying) {
          soundRef.current.pause();
        }
      } else if (hasInteracted) {
        // 页面显示且用户已交互过时，恢复播放
        if (soundRef.current && !isPlaying) {
          soundRef.current.play();
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPlaying, hasInteracted]);

  // 添加用户交互监听
  useEffect(() => {
    if (hasInteracted || !soundRef.current) return;
    
    const handleUserInteraction = () => {
      setHasInteracted(true);
      
      if (soundRef.current) {
        soundRef.current.play();
      }
      
      // 移除事件监听器
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
    
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [hasInteracted]);

  const togglePlay = () => {
    if (!soundRef.current) return;

    setHasInteracted(true);
    
    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  };

  return (
    <button
      onClick={togglePlay}
      className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white/80 hover:bg-white/90 transition-colors duration-300"
      aria-label={isPlaying ? '暂停音乐' : '播放音乐'}
    >
      <svg
        className="w-6 h-6 text-[#887e72]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {isPlaying ? (
          <>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </>
        ) : (
          <>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v13"
              className="opacity-50"
            />
          </>
        )}
      </svg>
    </button>
  );
};

export default AudioPlayer; 