package main

import (
    "database/sql"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "os"

    _ "github.com/lib/pq"
)

var db *sql.DB

func init() {
    setupDB()
}

func setupDB() {
    var err error
    psqlInfo := fmt.Sprintf("host=%s port=%s user=%s "+
        "password=%s dbname=%s sslmode=disable",
        os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_USER"),
        os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"))

    db, err = sql.Open("postgres", psqlInfo)
    if err != nil {
        log.Fatalf("Could not open database connection: %v", err)
    }

    err = db.Ping()
    if err != nil {
        log.Fatalf("Could not connect to database: %v", err)
    }
}

type Score struct {
    Player string `json:"player"`
    Score  int    `json:"score"`
}

func getScores(w http.ResponseWriter, r *http.Request) {
    const query = "SELECT player, score FROM scores ORDER BY score DESC"

    rows, err := db.Query(query)
    if err != nil {
        log.Printf("Error querying scores from the database: %v", err)
        http.Error(w, "Internal Server Error", http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var scores []Score
    for rows.Next() {
        var s Score
        if err := rows.Scan(&s.Player, &s.Score); err != nil {
            log.Printf("Error scanning scores from the database: %v", err)
            http.Error(w, "Internal Server Error", http.StatusInternalServerError)
            return
        }
        scores = append(scores, s)
    }
    if err := rows.Err(); err != nil {
        log.Printf("Error finalizing score retrieval: %v", err)
        http.Error(w, "Internal Server Error", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    if err := json.NewEncoder(w).Encode(scores); err != nil {
        log.Printf("Error encoding scores to JSON: %v", err)
        http.Error(w, "Internal Server Error", http.StatusInternalServerError)
    }
}

func submitScore(w http.ResponseWriter, r *http.Request) {
    var s Score
    if err := json.NewDecoder(r.Body).Decode(&s); err != nil {
        log.Printf("Error decoding score submission: %v", err)
        http.Error(w, "Bad Request", http.StatusBadRequest)
        return
    }

    const query = "INSERT INTO scores(player, score) VALUES($1, $2)"
    _, err := db.Exec(query, s.Player, s.Score)
    if err != nil {
        log.Printf("Error inserting score into the database: %v", err)
        http.Error(w, "Internal Server Error", http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
}

func main() {
    http.HandleFunc("/scores", getIgnoreAccessErrorHandling(getScores))
    http.HandleFunc("/submit", submitScore)

    log.Println("Server starting on :8080")
    if err := http.ListenAndServe(":8080", nil); err != nil {
        log.Fatalf("Error starting server: %v", err)
    }
}

func getIgnoreAccessErrorHandling(handleFunc http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        handleFunc(w, r)
    }
}