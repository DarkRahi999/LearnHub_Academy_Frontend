import { useState, useEffect } from 'react';

export const useCountdown = (initialTime: number = 60) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const startCountdown = () => {
    setTimeLeft(initialTime);
    setIsActive(true);
  };

  const resetCountdown = () => {
    setIsActive(false);
    setTimeLeft(initialTime);
  };

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    timeLeft,
    isActive,
    startCountdown,
    resetCountdown,
    formatTime,
  };
};