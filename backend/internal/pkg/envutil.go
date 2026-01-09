package pkg

import (
	"log/slog"
	"os"
)

func GetEnv(key string) string {
	value := os.Getenv(key)
	if value == "" {
		slog.Error("Key not found on env", "key", key)
		os.Exit(1)
	}
	return value
}
