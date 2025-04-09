import { useState, useEffect, useMemo } from 'react';

interface CountdownProps {
  targetDate: Date;
}

const Countdown = ({ targetDate }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // 使用useMemo缓存计算逻辑
  const calculateTimeLeft = useMemo(() => {
    return () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };
  }, [targetDate]);

  useEffect(() => {
    // 立即计算一次
    setTimeLeft(calculateTimeLeft());
    
    // 每秒更新一次
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  // 使用useMemo缓存渲染的倒计时数字
  const countdownDisplay = useMemo(() => (
    <div className="flex justify-center space-x-4 md:space-x-8">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-pink-100 rounded-lg flex items-center justify-center shadow-md">
          <span className="text-2xl md:text-3xl font-bold text-pink-800">{timeLeft.days}</span>
        </div>
        <span className="mt-2 text-sm md:text-base text-pink-600">天</span>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-pink-100 rounded-lg flex items-center justify-center shadow-md">
          <span className="text-2xl md:text-3xl font-bold text-pink-800">{timeLeft.hours}</span>
        </div>
        <span className="mt-2 text-sm md:text-base text-pink-600">时</span>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-pink-100 rounded-lg flex items-center justify-center shadow-md">
          <span className="text-2xl md:text-3xl font-bold text-pink-800">{timeLeft.minutes}</span>
        </div>
        <span className="mt-2 text-sm md:text-base text-pink-600">分</span>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-pink-100 rounded-lg flex items-center justify-center shadow-md">
          <span className="text-2xl md:text-3xl font-bold text-pink-800">{timeLeft.seconds}</span>
        </div>
        <span className="mt-2 text-sm md:text-base text-pink-600">秒</span>
      </div>
    </div>
  ), [timeLeft]);

  return (
    <div className="w-full max-w-md mx-auto">
      {countdownDisplay}
    </div>
  );
};

export default Countdown; 