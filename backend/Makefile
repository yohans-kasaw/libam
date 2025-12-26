.PHONY: server dev

-include .env
export

server:
	@go build -o ./build/server .

dev: server
	@./build/server
