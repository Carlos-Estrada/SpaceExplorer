import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const MAX_SPEED = parseInt(process.env.MAX_SPEED, 10) || 10;
const SPACESHIP_SIZE = process.env.SPACESHIP_SIZE || { width: 100, height: 100 };

const windowDimensions = Dimensions.get('window');

const Spaceship = () => {
  const [position, setPosition] = useState({ 
    x: windowDimensions.width / 2 - SPACESHIP_SIZE.width / 2, 
    y: windowDimensions.height / 2 - SPACESHIP_SIZE.height / 2 
  });
  const [speed, setSpeed] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(prevPosition => ({
        x: Math.max(0, Math.min(windowDimensions.width - SPACESHIP_SIZE.width, prevPosition.x + speed.x)),
        y: Math.max(0, Math.min(windowDimensions.height - SPACESHIP_SIZE.height, prevPosition.y + speed.y)),
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [speed]);

  const changeSpeed = (dx = 0, dy = 0) => {
    setSpeed(prevSpeed => ({
      x: Math.min(MAX_SPEED, Math.max(-MAX_SPEED, prevSpeed.x + dx)),
      y: Math.min(MAX_SPEED, Math.max(-MAX_SPEED, prevSpeed.y + dy)),
    }));
  };

  return (
    <View style={styles.container}>
      <View style={[styles.spaceship, { left: position.x, top: position.y }]} />
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => changeSpeed(0, -1)} style={styles.button}><Text>Up</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => changeSpeed(-1, 0)} style={styles.button}><Text>Left</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => changeSpeed(1, 0)} style={styles.button}><Text>Right</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => changeSpeed(0, 1)} style={styles.button}><Text>Down</Text></TouchableOpacity>
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
    width: SPACESHIP_SIZE.width,
    height: SPACESHIP_SIZE.height,
    backgroundColor: 'blue',
  },
  controls: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  button: {
    margin: 10,
    padding: 10,
    backgroundColor: '#ddd',
  }
});

export default Spaceship;