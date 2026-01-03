package server

import (
	"fmt"
	"libam/database"
	"log/slog"
	"net/http"
	"os"

	"gorm.io/gorm"
)

type Server struct {
	db *gorm.DB
}

func NewServer(logger *slog.Logger) *http.Server {
	db := database.NewDatabase(logger)

	s := &Server{
		db: db,
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
