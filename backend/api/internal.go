package api

import (
	"libam/database"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func getDBAddress(db *gorm.DB) string {
	var dbAddr string

	err := db.Raw("SELECT inet_server_addr()").Scan(&dbAddr).Error

	if err != nil || dbAddr == "" {
		return "localhost/socket"
	}
	return dbAddr
}

func (s *Api) dbStat(ctx *gin.Context) {
	gdb := database.NewDatabase().Db
	db, _ := gdb.DB()
	if err := db.Ping(); err != nil {
		ctx.JSON(http.StatusServiceUnavailable, gin.H{
			"error": err.Error(),
		})

		return
	}

	stats := make(map[string]any)
	stats["status"] = "okay"
	stats["db_host"] = getDBAddress(gdb)

	dbStats := db.Stats()
	stats["user_id"] = ctx.Keys["Subject"]
	stats["open_connections"] = dbStats.OpenConnections
	stats["in_use"] = dbStats.InUse
	stats["idle"] = dbStats.Idle
	stats["wait_count"] = dbStats.WaitCount
	stats["wait_duration"] = dbStats.WaitDuration.String()
	stats["max_idle_closed"] = dbStats.MaxIdleClosed
	stats["max_lifetime_closed"] = dbStats.MaxLifetimeClosed

	ctx.JSON(http.StatusOK, stats)
}
