package server

import (
	"fmt"
	"libam/database"
	"log/slog"
	"net/http"
	"os"
)

type Server struct {
	database *database.Database
}

func NewServer(logger *slog.Logger) *http.Server {
	database := database.NewDatabase(logger)

	s := &Server{
		database: database,
	}

	port := os.Getenv("PORT")
	if port == "" {
		logger.Error("PORT is not found in env variabls")
		os.Exit(1)
	}

	server := &http.Server{
		Addr:    fmt.Sprintf(":%v", port),
		Handler: s.RegisterRouts(),
	}

	return server
}
