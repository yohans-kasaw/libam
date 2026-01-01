package migrations

import (
	"context"
	"database/sql"
	"libam/db"
	"log"
	"os"

	"github.com/pressly/goose/v3"
	"gorm.io/gorm"
)

var m gorm.Migrator

func init() {

	dsn := os.Getenv("GOOSE_DBSTRING")
	if dsn == "" {
		log.Print("GOOSE_DBSTRING is not found in env variabls")
		os.Exit(1)
	}

	g_db, err := db.InitDB(dsn)
	if err != nil {
		log.Print("Error when connecting to db", err)
		os.Exit(1)
	}

	m = g_db.Migrator()
	goose.AddMigrationContext(upCreateUser, downCreateUser)
}

func upCreateUser(ctx context.Context, tx *sql.Tx) error {
	return m.CreateTable(&db.User{})
}

func downCreateUser(ctx context.Context, tx *sql.Tx) error {
	return m.DropTable(&db.User{})
}
