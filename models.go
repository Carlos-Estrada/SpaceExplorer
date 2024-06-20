package main

import (
	"encoding/json"
	"fmt"
	"os"
)

type Player struct {
	Name string `json:"name"`
	Age  int    `json:"age"`
}

type Score struct {
	Player Player `json:"player"`
	Value  int    `json:"value"`
}

// ReadEnv reads an environment variable or returns a default value if not found
func ReadEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

// EncodePlayerToJson converts a Player object to a JSON string
func EncodePlayerToJson(player Player) (string, error) {
	jsonData, err := json.Marshal(player)
	if err != nil {
		return "", fmt.Errorf("error encoding player to JSON: %w", err)
	}
	return string(jsonData), nil
}

// DecodeJsonToPlayer converts a JSON string to a Player object
func DecodeJsonToPlayer(jsonData string) (Player, error) {
	var player Player
	err := json.Unmarshal([]byte(jsonData), &player)
	if err != nil {
		return Player{}, fmt.Errorf("error decoding JSON to player: %w", err)
	}
	return player, nil
}

// EncodeScoreToJson converts a Score object to a JSON string
func EncodeScoreToJson(score Score) (string, error) {
	jsonData, err := json.Marshal(score)
	if err != nil {
		return "", fmt.Errorf("error encoding score to JSON: %w", err)
	}
	return string(jsonData), nil
}

// DecodeJsonToScore converts a JSON string to a Score object
func DecodeJsonToScore(jsonData string) (Score, error) {
	var score Score
	err := json.Unmarshal([]byte(jsonData), &score)
	if err != nil {
		return Score{}, fmt.Errorf("error decoding JSON to score: %w", err)
	}
	return score, nil
}