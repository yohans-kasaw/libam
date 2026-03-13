package api

import (
	"libam/database"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (s *Api) health(ctx *gin.Context) {

	db, _ := database.NewDatabase().Db.DB()
	if err := db.Ping(); err != nil {
		ctx.JSON(http.StatusServiceUnavailable, gin.H{
			"error": err.Error(),
		})

		return
	}

	ctx.String(http.StatusOK, "OK")
}
