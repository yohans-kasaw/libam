package main

import (
	"context"
	_ "libam/internal/env"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"libam/api"

	"github.com/lmittmann/tint"
)

func main() {
	slog.SetDefault(slog.New(tint.NewHandler(
		os.Stdout,
		&tint.Options{
			AddSource: true,
			Level:     slog.LevelInfo,
		},
	)))

	server := api.NewServer()

	go func() {
		if err := server.ListenAndServe(); err != nil {
			if err == http.ErrServerClosed {
				slog.Info("server closed", "error", err)
			} else {
				slog.Error("Error while listening", "error", err)
			}

		}
	}()

	// block
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	<-ctx.Done()
	stop() // allow force shutdown

	// do gracefull quit
	ctx, cancel := context.WithTimeout(context.Background(), time.Minute)
	defer cancel()
	if err := server.Shutdown(ctx); err == nil {
		slog.Info("server gracefully shutdown")
	}
}
