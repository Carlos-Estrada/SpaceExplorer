package main

import (
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}

	r := mux.NewRouter()

	r.HandleFunc("/api/items", getItems).Methods("GET")
	r.HandleFunc("/api/items/{id}", getItem).Methods("GET")
	r.HandleFunc("/api/items", createItem).Methods("POST")
	r.HandleFunc("/api/items/{id}", updateItem).Methods("PUT")
	r.HandleFunc("/api/items/{id}", deleteItem).Methods("DELETE")

	http.ListenAndServe(":"+os.Getenv("PORT"), r)
}

func getItems(w http.ResponseWriter, r *http.Request) {
}

func getItem(w http.ResponseWriter, r *http.Request) {
}

func createItem(w http.ResponseWriter, r *http.Request) {
}

func updateItem(w http.ResponseWriter, r *http.Request) {
}

func deleteItem(w http.ResponseWriter, r *http.Request) {
}