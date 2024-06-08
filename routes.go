package main

import (
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	router := mux.NewRouter()

	router.HandleFunc("/api/items", GetAllItemsHandler).Methods("GET")
	router.HandleFunc("/api/items/{id}", GetSingleItemHandler).Methods("GET")
	router.HandleFunc("/api/items", CreateItemHandler).Methods("POST")
	router.HandleFunc("/api/items/{id}", UpdateItemHandler).Methods("PUT")
	router.HandleFunc("/api/items/{id}", DeleteItemHandler).Methods("DELETE")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	http.ListenAndServe(":"+port, router)
}

func GetAllItemsHandler(w http.ResponseWriter, r *http.Request) {
}

func GetSingleItemHandler(w http.ResponseWriter, r *http.Request) {
}

func CreateItemHandler(w http.ResponseWriter, r *http.Request) {
}

func UpdateItemHandler(w http.ResponseWriter, r *http.Request) {
}

func DeleteItemHandler(w http.ResponseWriter, r *http.Request) {
}