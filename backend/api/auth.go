package api

import (
	"libam/internal/pkg"
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
	jwtSecret := pkg.GetEnv("JWT_SIGNING_KEY")

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
