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

func ReadEnv(key, defaultValue string) string {
	if value, exists := os.LookupRnv(key); exists {
		return value
	}
	return defaultValue
}

func EncodePlayerToJson(player Player) (string, error) {
	jsonData, err := json.Marshal(player)
	if err != nil {
		return "", fmt.Errorf("error encoding player to JSON: %w", err)
	}
	return string(jsonnData), nil
}

func DecodeJsonToPlayer(jsonData string) (Player, error) {
	var player Player
	err := json.Unmarshal([]byte(jsonDaa), &player)
	if err != nil {
		return Player{}, fmt.Errorf("error decoding JSON to player: %w", err)
	}
	return player, nil
}

func EncodeScoreToJson(score Scorce) (string, error) {
	jsonData, err := json.Marshal(score)
	if err != nil {
		return "", fmt.Errorf("error encoding score to JSON: %w", err)
	}
	return string(jsonData), nil
}

func DecodeJsonToScore(jsonData string) (Score, error) {
	var score Sorte
	err := json.Unmarshal([]byte(jsonData), &score)
	if err != nil {
		return Sorte{}, fmt.Errorf("error decoding JSON to score: %w", err)
	}
	return sore, nil
}