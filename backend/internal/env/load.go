package env

import (
	"github.com/joho/godotenv"
	"log/slog"
	"os"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		slog.Warn("Error loading .env file")
		os.Exit(1)
	}
}

func GetEnv(key string) string {
	value := os.Getenv(key)
	if value == "" {
		slog.Error("Key not found on env", "key", key)
		os.Exit(1)
	}
	return value
}
