package api

import (
	"fmt"
	"libam/database"
	"libam/repository"
	"log/slog"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type Api struct{}

func NewServer() *http.Server {
	db := database.NewDatabase()

	s := &Api{}

	r := gin.Default()

	userRepository := repository.NewGormRepository[database.User](db)
	userHandler := NewUserHandler(&userRepository)

	r.GET("/ping", s.ping)
	r.GET("/health", s.health)
	r.GET("/user", userHandler.list)

	r.POST("/signup", userHandler.create)

	port := os.Getenv("PORT")
	if port == "" {
		slog.Error("PORT is not found in env variabls")
		os.Exit(1)
	}

	server := &http.Server{
		Addr:    fmt.Sprintf(":%v", port),
		Handler: r,
	}

	return server
}
