package main

import (
	"context"
	"flag"
	"libam/db"
	"log/slog"
	"os"

	_ "libam/migrations"

	"github.com/lmittmann/tint"
	"github.com/pressly/goose/v3"
)

func main() {
	logger := slog.New(tint.NewHandler(os.Stdout, &tint.Options{
		AddSource: true,
		Level:     slog.LevelInfo,
	}))

	flag.Parse()
	if len(flag.Args()) < 1 {
		logger.Error("No argument has been provide.")
		os.Exit(1)
	}
	command := flag.Args()[0]

	dsn := os.Getenv("GOOSE_DBSTRING")
	if dsn == "" {
		logger.Error("GOOSE_DBSTRING is not found in env variabls")
		os.Exit(1)
	}

	g_db, err := db.InitDB(dsn)
	if err != nil {
		logger.Error("Error when connecting to db", "error", err)
		os.Exit(1)
	}

	db, _ := g_db.DB()
	goose.RunContext(context.Background(), command, db, ".")
}
