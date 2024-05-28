package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"github.com/gorilla/mux"
)

func main() {
	// Load the .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Database setup
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbHost := os.Getenv("DB_HOST")

	dataSourceName := fmt.Sprintf("%s:%s@tcp(%s)/%s", dbUser, dbPassword, dbHost, dbName)
	db, err := sql.Open("mysql", dataSourceName)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Verify our connection to the database
	err = db.Ping()
	if err != nil {
		log.Fatal("Database connection test failed:", err)
	}

	// Router setup
	r := mux.NewRouter()

	// Define routes
	r.HandleFunc("/", HomeHandler)
	r.HandleFunc("/api", APIHandler).Methods("GET")

	// Start the server
	httpAddr := os.Getenv("HTTP_ADDR")
	fmt.Printf("Starting server on %s\n", httpAddr)
	if err := http.ListenAndServe(httpAddr, r); err != nil {
		log.Fatal("Error starting server:", err)
	}
}

// HomeHandler handles the root route
func HomeHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "Welcome to the Go Application!")
}

// APIHandler handles the /api route
func APIHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "API Endpoint")
}