import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const MAX_SPACESHIP_SPEED = parseInt(process.env.MAX_SPEED, 10) || 10;
const SPACESHIP_DIMENSIONS = process.env.SPACESHIP_SIZE || { width: 100, height: 100 };

const screenDimensions = Dimensions.get('window');

const SpaceshipController = () => {
  const [spaceshipPosition, setSpaceshipPosition] = useState({ 
    x: screenDimensions.width / 2 - SPACESHIP_DIMENSIONS.width / 2, 
    y: screenDimensions.height / 2 - SPACESHIP_DIMENSIONS.height / 2 
  });
  const [motionSpeed, setMotionSpeed] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const movementInterval = setInterval(() => {
      setSpaceshipPosition(previousPosition => ({
        x: Math.max(0, Math.min(screenDimensions.width - SPACESHIP_DIMENSIONS.width, previousPosition.x + motionSpeed.x)),
        y: Math.max(0, Math.min(screenDimensions.height - SPACESHIP_DIMENSIONS.height, previousPosition.y + motionSpeed.y)),
      }));
    }, 100);

    return () => clearInterval(movementInterval);
  }, [motionSpeed]);

  const adjustSpeed = (dx = 0, dy = 0) => {
    setMotionSpeed(previousSpeed => ({
      x: Math.min(MAX_SPACESHIP_SPEED, Math.max(-MAX_SPACESHIP_SPEED, previousSpeed.x + dx)),
      y: Math.min(MAX_SPACESHIP_SPEED, Math.max(-MAX_SPACESHIP_SPEED, previousSpeed.y + dy)),
    }));
  };

  return (
    <View style={styles.container}>
      <View style={[styles.spaceship, { left: spaceshipPosition.x, top: spaceshipPosition.y }]} />
      <View style={styles.controlPanel}>
        <TouchableOpacity onPress={() => adjustSpeed(0, -1)} style={styles.controlButton}><Text>Up</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => adjustSpeed(-1, 0)} style={styles.controlButton}><Text>Left</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => adjustSpeed(1, 0)} style={styles.controlButton}><Text>Right</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => adjustSpeed(0, 1)} style={styles.controlButton}><Text>Down</Text></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceship: {
    position: 'absolute',
    width: SPACESHIP_DIMENSIONS.width,
    height: SPACESHIP_DIMENSIONS.height,
    backgroundColor: 'blue',
  },
  controlPanel: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  controlButton: {
    margin: 10,
    padding: 10,
    backgroundColor: '#ddd',
  }
});

export default SpaceshipController;