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

	router.HandleFunc("/api/items", fetchAllItems).Methods("GET")
	router.HandleFunc("/api/items/{id}", fetchSingleItem).Methods("GET")
	router.HandleFunc("/api/items", createNewItem).Methods("POST")
	router.HandleFunc("/api/items/{id}", updateExistingItem).Methods("PUT")
	router.HandleFunc("/api/items/{id}", removeItem).Methods("DELETE")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000" 
	}

	http.ListenAndServe(":"+port, router)
}

func fetchAllCollectionItems(responseWriter http.ResponseWriter, request *http.Request) {
}

func fetchSingleItem(responseWriter http.ResponseWriter, request *http.Request) {
}

func createNewItem(responseWriter http.ResponseWriter, request *http.Request) {
}

func updateExistingItem(responseWriter http.ResponseWriter, request *http.Request) {
}

func removeItem(responseWriter http.ResponseWriter, request *http.Request) {
}