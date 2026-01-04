package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (s *Server) RegisterRouts() *gin.Engine {
	r := gin.Default()

	r.GET("/ping", s.ping)
	r.GET("/health", s.health)
	r.GET("/user", s.getAllUsers)
	r.POST("/user", s.createUser)

	return r
}

func (s *Server) ping(ctx *gin.Context) {
	ctx.String(http.StatusOK, "pong")
}

func (s *Server) health(ctx *gin.Context) {
	db, _ := s.database.Db.DB()
	if err := db.Ping(); err != nil {
		ctx.JSON(http.StatusServiceUnavailable, gin.H{
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
