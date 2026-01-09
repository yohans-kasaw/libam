package api

import (
	"fmt"
	"libam/database"
	"libam/internal/pkg"
	"libam/repository"
	"net/http"

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
	r.POST("/login", userHandler.login)

	port := pkg.GetEnv("PORT")

	server := &http.Server{
		Addr:    fmt.Sprintf(":%v", port),
		Handler: r,
	}

	return server
}
