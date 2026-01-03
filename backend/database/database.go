package database

import (
	"log/slog"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func NewDatabase(logger *slog.Logger) *gorm.DB {
	dsn := os.Getenv("GOOSE_DBSTRING")
	if dsn == "" {
		if logger != nil {
			logger.Error("GOOSE_DBSTRING is not found in env variabls")
		}
		os.Exit(1)
	}

	d := postgres.Open(dsn)
	db, err := gorm.Open(d, &gorm.Config{})
	if err != nil {
		logger.Error("Error connecting to database", "error", err)
		os.Exit(1)
	}

	return db
}
