package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (s *Api) ping(ctx *gin.Context) {
	ctx.String(http.StatusOK, "pong")
}
