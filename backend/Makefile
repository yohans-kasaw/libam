.PHONY: server dev migrate migrate-up migrate-down

-include .env
export

migrate:
	@go build -o ./build/migrate ./cmd/migrate

migrate-up: migrate
	@./build/migrate up

migrate-down: migrate
	@./build/migrate down

server:
	@go build -o ./build/server .

dev: server
	@./build/server
