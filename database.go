package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

func dbInit() *sql.DB {
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		log.Fatal("DB_PATH environment variable is not set.")
	}

	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		log.Fatalf("Error opening database: %v", err)
	}

	createTableSQL := `
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
		username TEXT NOT  NULL UNIQUE,
		email TEXT NOT  NULL UNIQUE,
		password TEXT NOT  NULL
	);`

	if _, err = db.Exec(createTableSQL); err != nil {
		log.Fatalf("Error creating table: %v", err)
	}

	return db
}

func addUser(db *sql.DB, username, email, password string) error {
	query := `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`
	statement, err := db.Prepare(query)
	if err != nil {
		return fmt.Errorf("addUser: %w", err)
	}
	defer statement.Close()

	if _, err = statement.Exec(username, email, password); err != nil {
		return fmt.Errorf("addUser exec: %w", err)
	}

	return nil
}

func getUser(db *sql.DB, username string) (string, string, error) {
	query := `SELECT username, email FROM users WHERE username = ?`
	row := db.QueryRow(query, username)

	var email string
	if err := row.Scan(&username, &email); err != nil {
		return "", "", fmt.Errorf("getUser: %w", err)
	}

	return username, email, nil
}

func main() {
	db := dbInit()
	defer db.Close()

	if err := addUser(db, "john_doe", "john@example.com", "supersecurepassword"); err != nil {
		log.Fatalf("Error adding user: %v", err)
	}

	username, email, err := getUser(db, "john_doe")
	if err != nil {
		log.Fatalf("Error getting user: %v", err)
	}
	log.Printf("User retrieved: %s, %s", username, email)
}