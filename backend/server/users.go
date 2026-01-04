package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (s *Server) getAllUsers(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, s.database.GetAllUsers())
}
