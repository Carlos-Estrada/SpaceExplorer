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
    var err error
    psqlInfo := fmt.Sprintf("host=%s port=%s user=%s "+
        "password=%s dbname=%s sslmode=disable",
        os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_USER"),
        os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"))

    db, err = sql.Open("postgres", psqlInfo)
    if err != nil {
        log.Fatal(err)
    }

    err = db.Ping()
    if err != nil {
        log.Fatal(err)
    }
}

type Score struct {
    Player string `json:"player"`
    Score  int    `json:"score"`
}

func getScores(w http.ResponseWriter, r *http.Request) {
    const query = `SELECT player, score FROM scores ORDER BY score DESC`

    rows, err := db.Query(query)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var scores []Score
    for rows.Next() {
        var s Score
        if err := rows.Scan(&s.Player, &s.Score); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        scores = append(scores, s)
    }
    if err := rows.Err(); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(scores)
}

func submitScore(w http.ResponseWriter, r *http.Request) {
    var s Score
    if err := json.NewDecoder(r.Body).Decode(&s); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    const query = `INSERT INTO scores(player, score) VALUES($1, $2)`
    _, err := db.Exec(query, s.Player, s.Score)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
}

func main() {
    http.HandleFunc("/scores", getScores)
    http.HandleFunc("/submit", submitScore)

    http.ListenAndServe(":8080", nil)
}