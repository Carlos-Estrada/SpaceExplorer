import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const WINDOW_WIDTH = Dimensions.get('window').width;
const OBSTACLE_WIDTH = 50;
const OBSTACLE_HEIGHT = 50;

const Obstacle = ({ color = '#444', speed = 10, startX }) => {
  const [position, setPosition] = useState(startX);

  useEffect(() => {
    const moveObstacle = () => {
      setPosition((currentPosition) => {
        if (currentPosition <= -OBSTACLE_WIDTH) {
          return WINDOW_WIDTH;
        } else {
          return currentPosition - speed;
        }
      });
    };

    const intervalId = setInterval(moveObstacle, 100);

    return () => clearInterval(intervalId);
  }, [speed]);

  return (
    <View
      style={[styles.obstacle, {
        left: position,
        backgroundColor: color
      }]}
    />
  );
};

const styles = StyleSheet.create({
  obstacle: {
    position: 'absolute',
    width: OBSTACLE_WIDTH,
    height: OBSTACLE_HEIGHT,
    top: 200,
  },
});

export default Obstacle;