package api

import (
	"errors"
	"libam/internal/env"
	"log/slog"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type Auth struct {
	jwtSecret string
}

type UserClaim struct {
	jwt.RegisteredClaims
}

func NewAuth() *Auth {
	jwtSecret := env.GetEnv("JWT_SIGNING_KEY")

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

func (h *Auth) validateToken(tokenString string) (*UserClaim, error) {
	token, err := jwt.ParseWithClaims(tokenString, &UserClaim{}, func(t *jwt.Token) (any, error) {
		return []byte(h.jwtSecret), nil
	})

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*UserClaim)

	if !token.Valid || !ok {
		return nil, errors.New("Invalied token")
	}

	return claims, nil
}

func (h *Auth) authMiddleWare() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"message": "Autherization header is required",
			})
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"message": "Invalid authorization format",
			})
			return
		}

		token := parts[1]
		claims, err := h.validateToken(token)
		if err != nil {
			slog.Error("Error verifying User", "error", err)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"message": "Invalid or expired token",
			})
			return
		}

		c.Set("Subject", claims.Subject)
		c.Next()
	}
}
