package database

import (
	"context"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name  string `gorm:"not null"`
	Email string `gorm:"not null"`
}

func (db *Database) GetAllUsers() []User {
	users, _ := gorm.G[User](db.Db).Find(context.Background())

	return users
}
