import { useEffect } from 'react';

// 为微信JS-SDK添加类型声明
declare global {
  interface Window {
    wx: any;
  }
}

// 后台API地址配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://duan.tangleitech.com';

const WechatConfig = () => {
  useEffect(() => {
    const initWechatConfig = async () => {
      try {
        // 获取当前页面URL
        const currentUrl = window.location.href.split('#')[0];
        
        // 获取微信配置
        const response = await fetch(`${API_BASE_URL}/api/js-config?url=${encodeURIComponent(currentUrl)}`);
        const config = await response.json();

        // 配置微信JS-SDK
        window.wx.config({
          debug: false,
          appId: config.appId,
          timestamp: config.timestamp,
          nonceStr: config.nonceStr,
          signature: config.signature,
          jsApiList: [
            'updateAppMessageShareData',
            'updateTimelineShareData'
          ]
        });

        // 配置分享信息
        window.wx.ready(() => {
          // 分享给朋友
          window.wx.updateAppMessageShareData({
            title: '段雪松&贾坤 | 婚礼邀请函',
            desc: '诚挚邀请您前来见证我们的爱与喜悦',
            link: window.location.href,
            imgUrl: `${window.location.origin}/images/home.jpg`,
            success: () => {
              console.log('分享设置成功');
            }
          });

          // 分享到朋友圈
          window.wx.updateTimelineShareData({
            title: '段雪松&贾坤 | 婚礼邀请函',
            link: window.location.href,
            imgUrl: `${window.location.origin}/images/home.jpg`,
            success: () => {
              console.log('分享设置成功');
            }
          });
        });
      } catch (error) {
        console.error('微信配置失败:', error);
      }
    };

    // 加载微信JS-SDK
    const script = document.createElement('script');
    script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js';
    script.async = true;
    script.onload = initWechatConfig;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
};

export default WechatConfig; 