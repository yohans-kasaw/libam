package env

import (
	"log/slog"
	"os"

	"github.com/joho/godotenv"
)

func init() {
	paths := []string{"/secrets/.env", ".env"}
	var loaded bool

	for _, path := range paths {
		// Check if file exists before trying to load
		if _, err := os.Stat(path); os.IsNotExist(err) {
			continue
		}

		if err := godotenv.Load(path); err != nil {
			slog.Error("failed to load .env file", "path", path, "error", err)
			os.Exit(1)
		}

		slog.Info("environment configuration loaded", "path", path)
		loaded = true
		break
	}

	if !loaded {
		slog.Error("no .env file found in search paths", "searched", paths)
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
