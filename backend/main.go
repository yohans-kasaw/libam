package main

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"os"

	"libam/db"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/lmittmann/tint"
	"gorm.io/gorm"
)

func main() {
	logger := slog.New(tint.NewHandler(os.Stdout, &tint.Options{
		AddSource: true,
		Level:     slog.LevelInfo,
	}))

	err := godotenv.Load()
	if err != nil {
		logger.Error("Error loading .env file")
		os.Exit(1)
	}

	dsn := os.Getenv("GOOSE_DBSTRING")
	if dsn == "" {
		logger.Error("GOOSE_DBSTRING is not found in env variabls")
		os.Exit(1)
	}

	g_db, err := db.InitDB(dsn)

	if err != nil {
		logger.Error("Error when connecting to db", "error", err)
		os.Exit(1)
	}

	r := gin.Default()
	r.GET("/health", func(ctx *gin.Context) {
		ctx.String(http.StatusOK, "healthy")
	})

	r.GET("/users", func(ctx *gin.Context) {
		users, _ := gorm.G[db.User](g_db).Find(context.Background())
		ctx.JSON(http.StatusOK, users)
	})

	port := os.Getenv("PORT")
	if port == "" {
		logger.Error("PORT is not found in env variabls")
		os.Exit(1)
	}

	server := http.Server{
		Addr:    fmt.Sprintf(":%v", port),
		Handler: r,
	}

	if err := server.ListenAndServe(); err != nil {
		logger.Error("Error Listening", "err", err)
	}
}
