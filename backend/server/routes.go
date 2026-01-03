package server

import (
	"context"
	"libam/database"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func (s *Server) RegisterRouts() *gin.Engine {
	r := gin.Default()
	r.GET("/health", s.health)
	r.GET("/users", s.users)

	return r
}

func (s *Server) health(ctx *gin.Context) {
	db, _ := s.db.DB()
	if err := db.Ping(); err != nil {
		ctx.JSON(http.StatusOK, gin.H{
			"error": err.Error(),
		})

		return
	}

	stats := make(map[string]any)
	stats["status"] = "okay"

	dbStats := db.Stats()
	stats["open_connections"] = dbStats.OpenConnections
	stats["in_use"] = dbStats.InUse
	stats["idle"] = dbStats.Idle
	stats["wait_count"] = dbStats.WaitCount
	stats["wait_duration"] = dbStats.WaitDuration.String()
	stats["max_idle_closed"] = dbStats.MaxIdleClosed
	stats["max_lifetime_closed"] = dbStats.MaxLifetimeClosed

	ctx.JSON(http.StatusOK, stats)
}

func (s *Server) users(ctx *gin.Context) {
	users, _ := gorm.G[database.User](s.db).Find(context.Background())
	ctx.JSON(http.StatusOK, users)
}
