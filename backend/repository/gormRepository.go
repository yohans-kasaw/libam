package repository

import (
	"libam/database"

	"gorm.io/gorm"
)

type GormRepository[T any] struct {
	db *gorm.DB
}

func NewGormRepository[T any](db *database.Database) GormRepository[T] {
	return GormRepository[T]{db: db.Db}
}

func (r *GormRepository[T]) Create(entity *T) error {
	return r.db.Create(entity).Error
}

func (r *GormRepository[T]) List() ([]T, error) {
	var entities []T
	err := r.db.Find(&entities).Error

	return entities, err
}

func (r *GormRepository[T]) GetByID(id uint) (*T, error) {
	var entity T
	err := r.db.First(&entity, id).Error
	return &entity, err
}
