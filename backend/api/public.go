package api

import (
	"libam/database"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (s *Api) ping(ctx *gin.Context) {
	ctx.String(http.StatusOK, "pong")
}

// TODO: authentication 
func (s *Api) health(ctx *gin.Context) {
	db, _ := database.NewDatabase().Db.DB()
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
