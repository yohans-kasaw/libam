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
	ctx.String(http.StatusOK, "healthy")
}

func (s *Server) users(ctx *gin.Context) {
	users, _ := gorm.G[database.User](s.db).Find(context.Background())
	ctx.JSON(http.StatusOK, users)
}
