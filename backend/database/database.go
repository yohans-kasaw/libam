package database

import (
	"log/slog"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Database struct {
	Db *gorm.DB
}

func NewDatabase() *Database {
	dsn := os.Getenv("GOOSE_DBSTRING")
	if dsn == "" {
		slog.Error("GOOSE_DBSTRING is not found in env variabls")
		os.Exit(1)
	}

	d := postgres.Open(dsn)
	db, err := gorm.Open(d, &gorm.Config{})
	if err != nil {
		slog.Error("Error connecting to database", "error", err)
		os.Exit(1)
	}

	return &Database{
		Db: db,
	}
}
