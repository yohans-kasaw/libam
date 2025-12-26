package db

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitDB(dsn string) (*gorm.DB, error) {
	d := postgres.Open(dsn)
	db, err := gorm.Open(d, &gorm.Config{})
	return db, err
}
