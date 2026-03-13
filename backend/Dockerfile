FROM golang:1.25-alpine AS builder
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o libam-api .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o migrate ./cmd/migrate

FROM alpine:3.19
WORKDIR /app

COPY --from=builder /app/libam-api .
COPY --from=builder /app/migrate .
COPY --from=builder /app/start.sh .
EXPOSE 8080

RUN chmod +x ./start.sh

CMD ["./start.sh"]
