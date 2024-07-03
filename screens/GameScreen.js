import React, { useState, useEffect } from 'react';
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

  const moveSpaceship = (direction) => {
    setSpaceshipPosition((currentPosition) => {
      let newPosition = currentPosition + (direction === 'left' ? -10 : 10);
      return Math.min(Math.max(newPosition, 0), windowWidth - spaceshipSize);
    });
  };

  useEffect(() => {
    let newStars = [];
    for (let i = 0; i < 5; i++) {
      newStars.push({
        id: i,
        x: getRandomPosition(windowWidth - starSize),
        y: -getRandomPosition(windowHeight, 100),
      });
    }
    setStars(newStars);

    let newObstacles = [];
    for (let i = 0; i < 3; i++) {
      newObstacles.push({
        id: i,
        x: getRandomPosition(windowWidth - obstacleWidth),
        y: -getRandomPosition(100, windowHeight),
      });
    }
    setObstacles(newObstacles);

    const gameInterval = setInterval(() => {
      // Update star positions
      setStars((currentStars) =>
        currentStars.map((star) => ({
          ...star,
          y: star.y + 10,
        }))
      );

      // Update obstacle positions
      setObstacles((currentObstacles) =>
        currentObstacles.map((obstacle) => ({
          ...obstacle,
          y: obstacle.y + 5,
        }))
      );

      // Check for collisions
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

      // Recycle stars
      setStars((currentStars) =>
        currentStars.filter((star) => star.y < windowHeight).concat({
          id: new Date().getTime(),
          x: getRandomPosition(windowWidth - starSize),
          y: -starSize,
        })
      );

      // Recycle obstacles
      setObstacles((currentObstacles) =>
        currentObstacles.filter((obstacle) => obstacle.y < windowHeight).concat({
          id: new Date().getTime(),
          x: getRandomPosition(windowWidth - obstacleWidth),
          y: -obstacleHeight,
        })
      );
    }, 100);

    // Cleanup on component unmount
    return () => clearInterval(gameInterval);
  }, [obstacles]); // Depend on 'obstacles' to trigger updates

  return (
    <View style={styles.gameScreen}>
      <TouchableWithoutFeedback onPressIn={() => moveSpaceship('left')} onPressOut={() => moveSpaceship('right')}>
        <View style={[styles.spaceship, { left: spaceshipPosition }]} />
      </TouchableWithoutFeedback>
      {/* Render stars */}
      {stars.map((star) => (
        <View key={star.id} style={[styles.star, { top: star.y, left: star.x }]} />
      ))}
      {/* Render obstacles */}
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

export default GameScreen;