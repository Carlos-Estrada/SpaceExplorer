package main

import (
	"encoding/json"
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
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

func EncodePlayerToJson(player Player) (string, error) {
	jsonData, err := json.Marshal(player)
	if err != nil {
		return "", err
	}
	return string(jsonData), nil
}

func DecodeJsonToPlayer(jsonData string) (Player, error) {
	var player Player
	err := json.Unmarshal([]byte(jsonData), &player)
	if err != nil {
		return Player{}, err
	}
	return player, nil
}

func EncodeScoreToJson(score Score) (string, error) {
	jsonData, err := json.Marshal(score)
	if err != nil {
		return "", err
	}
	return string(jsonData), nil
}

func DecodeJsonToScore(jsonData string) (Score, error) {
	var score Score
	err := json.Unmarshal([]byte(jsonData), &score)
	if err != nil {
		return Score{}, err
	}
	return score, nil
}