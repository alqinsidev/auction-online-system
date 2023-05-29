import React, { useState, useEffect } from 'react';
import './styles.css';

interface ColorChangingTextProps {
  children: string
}

const ColorChangingText: React.FC<ColorChangingTextProps> = ({children}) => {
  const [color, setColor] = useState<string>('green');

  useEffect(() => {
    setColor('green');
  }, [children]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setColor('black');
    }, 2000);

    return () => clearTimeout(timeout);
  }, [children]);

  return (
      <span className={`color-changing-component ${color}`}>{children}</span>
  );
};

export default ColorChangingText;
