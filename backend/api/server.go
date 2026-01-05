package api

import (
	"fmt"
	"libam/database"
	"log/slog"
	"net/http"
	"os"
)

type Api struct {
	database *database.Database
}

func NewServer(logger *slog.Logger) *http.Server {
	database := database.NewDatabase(logger)

	s := &Api{
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
