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
	auth := NewAuth()

	userRepository := repository.NewGormRepository[database.User](db)
	userHandler := NewUserHandler(&userRepository)

	r.GET("/ping", s.ping)


	authGroup := r.Group("/auth")
	{
		authGroup.POST("/signup", userHandler.create)
		authGroup.POST("/login", userHandler.login)
	}

	protected := r.Group("/api")
	{
		protected.GET("/health", auth.authMiddleWare(), s.health)
		protected.GET("/user", auth.authMiddleWare(), userHandler.list)
	}

	port := pkg.GetEnv("PORT")

	server := &http.Server{
		Addr:    fmt.Sprintf(":%v", port),
		Handler: r,
	}

	return server
}
