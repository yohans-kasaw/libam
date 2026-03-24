package database

import (
	"libam/internal/env"
	"log/slog"
	"os"

	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Database struct {
	Db *gorm.DB
}

func NewDatabase() *Database {

	user := env.GetEnv("DB_USER")
	pass := env.GetEnv("DB_PASSWORD")
	name := env.GetEnv("DB_NAME")
	host := env.GetEnv("DB_HOST")

	dsn := fmt.Sprintf(
		"user=%s password=%s database=%s host=%s sslmode=disable",
		user,
		pass,
		name,
		host,
	)

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
