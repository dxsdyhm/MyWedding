import { useEffect, useRef, useState } from 'react';
import MapSelector from './MapSelector';

declare global {
  interface Window {
    TMap: any;
  }
}

const LocationMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const marker = useRef<any>(null);
  const [error, setError] = useState<string>('');
  const [showMapSelector, setShowMapSelector] = useState(false);
  const address = "湖北省黄石市黄石港区花湖大道30号";
  const hotelName = "富力万达嘉华酒店";
  const longitude = 115.057822;
  const latitude = 30.243752;
  const isWechat = /MicroMessenger/.test(navigator.userAgent);

  useEffect(() => {
    if (window.TMap) {
      initMap();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://map.qq.com/api/gljs?v=1.exp&key=S3UBZ-TPH6B-O6GU2-NZPQI-Z2TK6-AQFDC';
    script.async = true;
    script.onload = () => {
      if (window.TMap) {
        initMap();
      } else {
        setError('地图加载失败，请刷新页面重试');
      }
    };
    script.onerror = () => {
      setError('地图加载失败，请检查网络连接');
    };
    document.body.appendChild(script);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
      }
      document.body.removeChild(script);
    };
  }, []);

  const initMap = () => {
    if (!mapRef.current) return;

    try {
      mapInstance.current = new window.TMap.Map(mapRef.current, {
        center: new window.TMap.LatLng(latitude, longitude),
        zoom: 17,
        pitch: 20,
        rotation: 0,
        baseMap: {
          type: 'vector',
          features: ['base', 'building2d', 'building3d', 'point', 'label']
        },
        control: {
          zoom: false,    // 禁用缩放控件
          rotation: false, // 禁用旋转控件
          pitch: false,   // 禁用倾斜控件
          mapType: false, // 禁用地图类型切换控件
          location: false, // 禁用定位控件
          scale: false,   // 禁用比例尺控件
          fullscreen: false // 禁用全屏控件
        },
        showControl: false // 禁用所有控件
      });

      // 添加标记点
      marker.current = new window.TMap.MultiMarker({
        map: mapInstance.current,
        styles: {
          "marker": new window.TMap.MarkerStyle({
            width: 32,
            height: 32,
            anchor: { x: 16, y: 32 },
            src: '/images/location-pin.svg',
            faceTo: 'map',
            rotate: 0
          })
        },
        geometries: [{
          "id": "1",
          "styleId": "marker",
          "position": new window.TMap.LatLng(latitude, longitude),
          "properties": {
            "title": hotelName
          }
        }]
      });

      // 添加文本标签
      new window.TMap.MultiLabel({
        map: mapInstance.current,
        styles: {
          "label": new window.TMap.LabelStyle({
            color: '#887e72',
            size: 14,
            offset: { x: 0, y: -46 },
            backgroundColor: 'transparent',
            borderWidth: 0,
            padding: { top: 2, right: 5, bottom: 2, left: 5 }
          })
        },
        geometries: [{
          "id": "1",
          "styleId": "label",
          "position": new window.TMap.LatLng(latitude, longitude),
          "content": hotelName,
        }]
      });
    } catch (err) {
      setError('地图初始化失败，请刷新页面重试');
    }
  };

  const getNavigationUrl = (mapType: 'baidu' | 'qq' | 'amap' = 'qq', useWebVersion = false) => {
    // 检测设备类型
    const isWechat = /MicroMessenger/.test(navigator.userAgent);
    
    console.log('设备信息：', {
      userAgent: navigator.userAgent,
      isWechat
    });
    
    let url = '';
    if (isWechat || useWebVersion) {
      // 微信内置浏览器或需要网页版时使用对应地图的网页版
      switch (mapType) {
        case 'baidu':
          url = `http://api.map.baidu.com/geocoder?location=30.249961,115.064298&coord_type=bd09ll&output=html&src=webapp.baidu.openAPIdemo`;
          break;
        case 'amap':
          url = `https://uri.amap.com/marker?position=${longitude},${latitude}&name=${encodeURIComponent(hotelName)}&address=${encodeURIComponent(address)}&src=wedding-invitation`;
          break;
        case 'qq':
        default:
          url = `https://apis.map.qq.com/tools/poimarker?type=0&marker=coord:${latitude},${longitude};title:${encodeURIComponent(hotelName)};addr:${encodeURIComponent(address)}&key=S3UBZ-TPH6B-O6GU2-NZPQI-Z2TK6-AQFDC&referer=wedding-invitation`;
          break;
      }
    } else {
      // 非微信环境使用应用
      switch (mapType) {
        case 'baidu':
          url = `baidumap://map/direction?destination=name:${encodeURIComponent(hotelName)}|latlng:${latitude},${longitude}&coord_type=bd09ll&mode=driving&src=wedding-invitation`;
          break;
        case 'amap':
          url = `androidamap://navi?sourceApplication=wedding&lat=${latitude}&lon=${longitude}&dev=0&style=2&poiname=${encodeURIComponent(hotelName)}`;
          break;
        case 'qq':
        default:
          url = `qqmap://map/routeplan?type=drive&to=${encodeURIComponent(hotelName)}&tocoord=${latitude},${longitude}&coord_type=1&policy=0`;
          break;
      }
    }
    
    console.log('导航链接：', url);
    return url;
  };

  const handleNavigationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowMapSelector(true);
  };

  const handleMapSelect = (mapType: 'baidu' | 'qq' | 'amap') => {
    setShowMapSelector(false);
    const url = getNavigationUrl(mapType);
    window.location.href = url;
  };

  return (
    <div className="mt-6 w-full">
      <h4 className="text-sm mb-3 font-light">地图导航</h4>

      <div className="relative overflow-hidden rounded-sm border border-[#887e72]/20 h-48">
        <div ref={mapRef} className="w-full h-full"></div>
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}
      </div>

      <div className="mt-3 text-center">
        <p className="text-xs font-light mt-1">{address}</p>
        <a
          href={getNavigationUrl()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleNavigationClick}
          className="inline-flex items-center gap-2 mt-3 text-xs py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-sm transition-colors duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" transform="rotate(45 12 12)" />
          </svg>
          打开导航
        </a>
      </div>

      <MapSelector
        isOpen={showMapSelector}
        onClose={() => setShowMapSelector(false)}
        onSelect={handleMapSelect}
      />
    </div>
  );
};

export default LocationMap;
