package api

import (
	"fmt"
	"libam/database"
	"libam/internal/pkg"
	"libam/repository"
	"net/http"

	"github.com/gin-contrib/cors"

	"github.com/gin-gonic/gin"
)

type Api struct{}

func NewServer() *http.Server {
	db := database.NewDatabase()

	s := &Api{}

	r := gin.Default()
	r.RedirectTrailingSlash = false
	r.RedirectFixedPath = false
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "Accept", "Authorization"},
	}))

	auth := NewAuth()

	userRepository := repository.NewGormRepository[database.User](db)
	userHandler := NewUserHandler(&userRepository)

	r.GET("/health", s.health)

	authGroup := r.Group("/auth")
	{
		authGroup.POST("/signup", userHandler.create)
		authGroup.POST("/login", userHandler.login)
	}

	protected := r.Group("/api")
	{
		protected.GET("/db-stat", auth.authMiddleWare(), s.dbStat)
		protected.GET("/user", auth.authMiddleWare(), userHandler.list)
	}

	port := pkg.GetEnv("PORT")

	server := &http.Server{
		Addr:    fmt.Sprintf(":%v", port),
		Handler: r,
	}

	return server
}
