package migrations

import (
	"context"
	"database/sql"
	"libam/database"
	"log"
	"os"

	"github.com/pressly/goose/v3"
	"gorm.io/gorm"
)

var m gorm.Migrator

func init() {
	db := database.NewDatabase(nil)
	m = db.Migrator()
	goose.AddMigrationContext(upCreateUser, downCreateUser)
}

func upCreateUser(ctx context.Context, tx *sql.Tx) error {
	return m.CreateTable(&database.User{})
}

func downCreateUser(ctx context.Context, tx *sql.Tx) error {
	return m.DropTable(&database.User{})
}
