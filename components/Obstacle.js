import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const OBSTACLE_WIDTH = 50;
const OBSTACLE_HEIGHT = 50;

const MovingObstacle = ({ color = '#444', movementSpeed = 10, initialPositionX }) => {
  const [horizontalPosition, setHorizontalPosition] = useState(initialPositionX);
  const [obstacleError, setObstacleError] = useState('');

  useEffect(() => {
    try {
      const updateObstaclePosition = () => {
        setHorizontalPosition((currentPosition) => {
          if (currentPosition <= -OBSTACLE_WIDTH) {
            return SCREEN_WIDTH;
          } else {
            return currentPosition - movementSpeed;
          }
        });
      };

      const movementIntervalId = setInterval(updateObstaclePosition, 100);

      return () => clearInterval(movementIntervalId);
    } catch (error) {
      setObstacleError('Failed to move obstacle: ' + error.message);
    }
  }, [movementSpeed]);

  if (obstacleError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {obstacleError}</Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.obstacle, {
        left: horizontalPosition,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default MovingObstacle;