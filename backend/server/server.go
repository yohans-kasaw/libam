package server

import (
	"context"
	"fmt"
	"libam/database"
	"log/slog"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Server struct {
}

func NewServer(logger *slog.Logger) *http.Server {
	g_db, err := database.NewDatabase(logger)

	if err != nil {
		logger.Error("Error when connecting to db", "error", err)
		os.Exit(1)
	}

	port := os.Getenv("PORT")
	if port == "" {
		logger.Error("PORT is not found in env variabls")
		os.Exit(1)
	}

	r := gin.Default()
	r.GET("/health", func(ctx *gin.Context) {
		ctx.String(http.StatusOK, "healthy")
	})

	r.GET("/users", func(ctx *gin.Context) {
		users, _ := gorm.G[database.User](g_db).Find(context.Background())
		ctx.JSON(http.StatusOK, users)
	})

	server := &http.Server{
		Addr:    fmt.Sprintf(":%v", port),
		Handler: r,
	}

	return server
}
