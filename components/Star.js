import React, { useState, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

const Star = () => {
  const [position] = useState(new Animated.ValueXY({ x: 0, y: 0 }));

  const resetPosition = () => {
    position.setValue({ x: 0, y: 0 });
  };

  const animationConfig = {
    toValue: { x: 100, y: 300 },
    duration: 2000,
    useNativeDriver: true,
    easing: Easing.linear,
  };

  const animateStarMovement = () => {
    Animated.timing(position, animationConfig).start(() => {
      resetPosition();
    });
  };

  useEffect(() => {
    animateStarMovement();
  }, []);

  return (
    <Animated.View
      style={{
        transform: position.getTranslateTransform(),
        width: 50,
        height: 50,
        backgroundColor: 'yellow',
      }}
    />
  );
};

export default Star;