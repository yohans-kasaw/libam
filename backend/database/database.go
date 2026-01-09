package database

import (
	"libam/internal/pkg"
	"log/slog"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Database struct {
	Db *gorm.DB
}

func NewDatabase() *Database {
	dsn := pkg.GetEnv("GOOSE_DBSTRING")

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
