package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbHost := os.Getenv("DB_HOST")

	dataSourceName := fmt.Sprintf("%s:%s@tcp(%s)/%s", dbUser, dbPassword, dbHost, dbName)
	db, err := sql.Open("mysql", dataSourceName)
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatal("Database connection test failed: ", err)
	}

	r := mux.NewRouter()

	r.HandleFunc("/", HomeHandler)
	r.HandleFunc("/api", APIHandler).Methods("GET")
	r.HandleFunc("/api/planets", func(w http.ResponseWriter, r *http.Request) {
		GetPlanetsHandler(w, r, db)
	}).Methods("GET")

	httpAddr := os.Getenv("HTTP_ADDR")
	fmt.Printf("Starting server on %s\n", httpAddr)
	if err := http.ListenAndServe(httpAddr, r); err != nil {
		log.Fatal("Error starting server: ", err)
	}
}

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "Welcome to the SpaceExplorer Go Application!")
}

func APIHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "API Endpoint")
}

func GetPlanetsHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	var planets []map[string]interface{}

	rows, err := db.Query("SELECT id, name FROM planets")
	if err != nil {
		http.Error(w, "Error fetching planets", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		var name string

		err := rows.Scan(&id, &name)
		if err != nil {
			http.Error(w, "Error reading planets data", http.StatusInternalServerError)
			return
		}
		planet := map[string]interface{}{"id": id, "name": name}
		planets = append(planets, planet)
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(planets); err != nil {
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
	}
}