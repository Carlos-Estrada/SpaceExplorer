import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const MAX_SPEED = process.env.MAX_SPEED || 10;
const SPACESHIP_SIZE = process.env.SPACESHIP_SIZE || { width: 100, height: 100 };

const windowDimensions = Dimensions.get('window');

const Spaceship = () => {
  const [position, setPosition] = useState({ x: windowDimensions.width / 2, y: windowDimensions.height / 2 });
  const [speed, setSpeed] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prevPosition) => ({
        x: Math.max(0, Math.min(windowDimensions.width - SPACESHIP_SIZE.width, prevPosition.x + speed.x)),
        y: Math.max(0, Math.min(windowDimensions.height - SPACESHIP_SIZE.height, prevPosition.y + speed.y)),
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [speed]);

  const moveLeft = () => {
    setSpeed((prevSpeed) => ({ x: Math.max(-MAX_SPEED, prevSpeed.x - 1), y: prevSpeed.y }));
  };

  const moveRight = () => {
    setSpeed((prevSpeed) => ({ x: Math.min(MAX_SPEED, prevSpeed.x + 1), y: prevSpeed.y }));
  };

  const moveUp = () => {
    setSpeed((prevSpeed) => ({ x: prevSpeed.x, y: Math.max(-MAX_SPEED, prevSpeed.y - 1) }));
  };

  const moveDown = () => {
    setSpeed((prevSpeed) => ({ x: prevSpeed.x, y: Math.min(MAX_SPEED, prevSpeed.y + 1) }));
  };

  return (
    <View style={styles.container}>
      <View style={[styles.spaceship, { left: position.x, top: position.y }]} />
      <View style={styles.controls}>
        <TouchableOpacity onPress={moveUp} style={styles.button}><Text>Up</Text></TouchableOpacity>
        <TouchableOpacity onPress={moveLeft} style={styles.button}><Text>Left</Text></TouchableOpacity>
        <TouchableOpacity onPress={moveRight} style={styles.button}><Text>Right</TimeIndicator></View></TouchableOpacity>
        <TouchableOpacity onPress={moveDown} style={styles.button}><Text>Down</Text></TouchableOpacity>
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