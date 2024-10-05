import React, { useState, useEffect } from 'react';

const Timer: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<string>(new Date().toLocaleDateString());
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date().toLocaleDateString());
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(timer);
  }, []);

  return (
    <div className='flex flex-col gap-1 justify-center items-center p-5 text-slate-200'>
        <p className='text-5xl font-[200]'>{currentTime}</p>
      <p className='font-[800] text-lg'>{currentDate}</p>
      
    </div>
  );
};

export default Timer;
