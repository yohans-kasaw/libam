package api

import (
	"log/slog"
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Auth struct {
	jwtSecret string
}

type UserClaim struct {
	jwt.RegisteredClaims
}

func NewAuth() *Auth {
	jwtSecret := os.Getenv("JWT_SIGNING_KEY")
	if jwtSecret == "" {
		slog.Error("JWT_SIGNING_KEY is not set in environment variables")
		os.Exit(1)
	}

	return &Auth{
		jwtSecret: jwtSecret,
	}
}

func (h *Auth) generateToken(userId uint) (string, error) {
	claim := UserClaim{
		jwt.RegisteredClaims{
			Subject:   strconv.FormatUint(uint64(userId), 10),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claim)

	return token.SignedString([]byte(h.jwtSecret))
}
