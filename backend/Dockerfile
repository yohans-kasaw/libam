FROM golang:1.25-alpine AS builder
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o libam-api . &&\
    CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o migrate ./cmd/migrate

FROM alpine:3.23.3
WORKDIR /app

COPY --from=builder /app/libam-api /app/migrate /app/start.sh ./

RUN addgroup -S appgroup && adduser -S appuser &&\
    chown -R appuser:appgroup /app &&\
    chmod +x ./start.sh

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --retries=3 CMD wget --spider http://localhost:$PORT/health

CMD ["./start.sh"]
