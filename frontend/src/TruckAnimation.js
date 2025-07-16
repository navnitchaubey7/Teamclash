import React, { useEffect, useState } from 'react';
import './TruckAnimation.css';

const cartoonImages = [
  '/img/person.png', // boy
  '/img/person.png', // girl
  '/img/person.png', // boy
  '/img/person.png', // girl
  '/img/person.png', // boy
];

const TruckAnimation = () => {
  const [truckClass, setTruckClass] = useState('truck truck-start');
  const [cartoonStates, setCartoonStates] = useState(
    Array(5).fill().map((_, i) => ({
      left: `${100 + i * 70}px`,
      hidden: false,
    }))
  );

  useEffect(() => {
    setTimeout(() => {
      setTruckClass('truck truck-enter');
    }, 100);

    cartoonImages.forEach((_, i) => {
      setTimeout(() => {
        setCartoonStates(prev => {
          const updated = [...prev];
          updated[i] = { ...updated[i], left: '420px' };
          return updated;
        });
      }, 2500 + i * 1000);

      setTimeout(() => {
        setCartoonStates(prev => {
          const updated = [...prev];
          updated[i] = { ...updated[i], hidden: true };
          return updated;
        });
      }, 3000 + i * 1000);
    });

    setTimeout(() => {
      setTruckClass('truck truck-exit');
    }, 8500);
  }, []);

  return (
    <div className="truck-container">
      <img
        src="/img/truck.png"
        alt="truck"
        className={truckClass}
        style={{ left: '0px' }}
      />

      {cartoonImages.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`cartoon-${index}`}
          className={`cartoon ${cartoonStates[index]?.hidden ? 'hide' : ''}`}
          style={{ left: cartoonStates[index]?.left }}
        />
      ))}
    </div>
  );
};

export default TruckAnimation;
