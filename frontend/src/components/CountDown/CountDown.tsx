import React, { useState, useEffect } from 'react';
import moment, { Moment } from 'moment';
import { Tag } from 'antd';

interface CountDownProps {
  end_date: string;
}

const CountDown: React.FC<CountDownProps> = ({ end_date }) => {
  const [countdown, setCountdown] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const remainingTime = calculateRemainingTime(end_date);
      setCountdown(remainingTime);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [end_date]);

  const calculateRemainingTime = (endTime: string): string => {
    const now: Moment = moment();
    const end: Moment = moment(endTime);
    const duration: moment.Duration = moment.duration(end.diff(now));

    if (end.isBefore(now)) {
      return "closed";
    }
    
    const hours: number = Math.floor(duration.asHours());
    const minutes: number = duration.minutes();
    const seconds: number = duration.seconds();

    if (hours < 1) {
      if (minutes < 3) {
        return `${minutes}m${seconds.toString().padStart(2, '0')}s`;
      }
      return `${minutes}m`;
    }

    return `${hours}h`;
  };

  const getColor = (): string => {
    if (countdown !== null) {
      const [hours, minutes] = countdown.split(':');
      if (Number(hours) < 1) {
        if (Number(minutes) < 3) {
          return 'red';
        }
        return 'green';
      }
    }
    return 'blue';
  };

  return <Tag color={getColor()}>{countdown}</Tag>;
};

export default CountDown;
