import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const spaceshipSize = 60;
const obstacleWidth = 60;
const obstacleHeight = 60;
const starSize = 30;

const getRandomPosition = (max, min = 0) => Math.floor(Math.random() * (max - min + 1)) + min;

const GameScreen = () => {
  const [spaceshipPosition, setSpaceshipPosition] = useState(windowWidth / 2 - spaceshipSize / 2);
  const [obstacles, setObstacles] = useState([]);
  const [stars, setStars] = useState([]);
  const [score, setScore] = useState(0);

  const moveSpaceship = useCallback((direction) => {
    setSpaceshipPosition((currentPosition) => {
      let newPosition = currentPosition + (direction === 'left' ? -10 : 10);
      return Math.min(Math.max(newPosition, 0), windowWidth - spaceshipSize);
    });
  }, []);

  useEffect(() => {
    const initialStarsAndObstacles = () => {
      let items = { stars: [], obstacles: [] };
      for (let i = 0; i < 5; i++) {
        items.stars.push({
          id: i,
          x: getRandomPosition(windowWidth - starSize),
          y: -getRandomPosition(windowHeight, 100),
        });
      }
      for (let i = 0; i < 3; i++) {
        items.obstacles.push({
          id: i,
          x: getRandomPosition(windowWidth - obstacleWidth),
          y: -getRandomPosition(100, windowHeight),
        });
      }
      return items;
    };
    
    const { stars: newStars, obstacles: newObstacles } = initialStarsAndObstacles();
    setStars(newStars);
    setObstacles(newObstacles);

    const gameInterval = setInterval(() => {
      const updatePosition = (items, speed, resetY) => items.map((item) => ({
        ...item,
        y: item.y + speed,
      })).filter((item) => item.y < windowHeight)
        .concat({
          id: new Date().getTime(),
          x: getRandomPosition(windowWidth - (resetY ? starSize : obstacleWidth)),
          y: - (resetY ? starSize : obstacleHeight),
        });

      setStars((currentStars) => updatePosition(currentStars, 10, true));
      setObstacles((currentObstacles) => updatePosition(currentObstacles, 5, false));

      obstacles.forEach((obstacle) => {
        if (
          obstacle.x < spaceshipPosition + spaceshipSize &&
          obstacle.x + obstacleWidth > spaceshipPosition &&
          obstacle.y < windowHeight &&
          obstacle.y + obstacleHeight > windowHeight - spaceshipSize
        ) {
          console.log('collision detected');
        }
      });

    }, 100);

    return () => clearInterval(gameInterval);
  }, [moveSpaceship, obstacles, spaceshipPosition]);

  return (
    <View style={styles.gameScreen}>
      <TouchableWithoutFeedback onPressIn={() => moveSpaceship('left')} onPressOut={() => moveSpaceship('right')}>
        <View style={[styles.spaceship, { left: spaceshipPosition }]} />
      </TouchableWithoutFeedback>
      {stars.map((star) => (
        <View key={star.id} style={[styles.star, { top: star.y, left: star.x }]} />
      ))}
      {obstacles.map((obstacle) => (
        <View key={obstacle.id} style={[styles.obstacle, { top: obstacle.y, left: obstacle.x }]} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gameScreen: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  spaceship: {
    position: 'absolute',
    width: spaceshipSize,
    height: spaceshipSize,
    backgroundColor: '#fff',
    bottom: 20,
  },
  star: {
    position: 'absolute',
    width: starSize,
    height: starSize,
    backgroundColor: '#FFD700',
  },
  obstacle: {
    position: 'absolute',
    width: obstacleWidth,
    height: obstacleHeight,
    backgroundColor: '#8B0000',
  },
});

export default GameSP;