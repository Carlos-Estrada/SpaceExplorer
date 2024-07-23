import React, { useState, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

const Star = () => {
  const [position] = useState(new Animated.ValueXY({ x: 0, y: 0 }));
  const [opacity] = useState(new Animated.Value(1)); // New state for opacity

  const resetPositionAndOpacity = () => {
    position.setValue({ x: 0, y: 0 });
    opacity.setValue(1); // Reset opacity to full
  };

  const animationConfig = {
    toValue: { x: 100, y: 300 },
    duration: 2000,
    useNativeDriver: true,
    easing: Easing.linear,
  };

  const twinkleConfig = {
    duration: 1000,
    toValue: 0,
    useNativeDriver: true,
    easing: Easing.inOut(Easing.quad), // This gives a gentle twinkling effect
  };

  const animateStarMovementAndTwinkle = () => {
    // Start both animations in parallel
    Animated.parallel([
      Animated.timing(position, animationConfig),
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, twinkleConfig),
          Animated.timing(opacity, { ...twinkleConfig, toValue: 1 }),
        ]),
        { iterations: 2 } // Number of twinkles during the movement
      ),
    ]).start(() => {
      resetPositionAndOpacity();
    });
  };

  useEffect(() => {
    animateStarMovementAndTwinkle();
  }, []);

  return (
    <Animated.View
      style={{
        transform: position.getTranslateTransform(),
        opacity: opacity, // Apply dynamic opacity
        width: 50,
        height: 50,
        backgroundColor: 'yellow',
      }}
    />
  );
};

export default Star;