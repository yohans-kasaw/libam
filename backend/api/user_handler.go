package api

import (
	"errors"
	"libam/database"
	"libam/repository"
	"log/slog"
	"net/http"
	"os"
	"strconv"
	"time"
	"unicode"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type SignupDto struct {
	Name     string `json:"name" binding:"required,min=2,max=100"`
	Email    string `json:"email" binding:"email"`
	Password string `json:"password" binding:"required"`
}

type LoginDto struct {
	Email    string `json:"email" binding:"email"`
	Password string `json:"password" binding:"required"`
}

type UserClaim struct {
	jwt.RegisteredClaims
}

type userHandler struct {
	repo      *repository.GormRepository[database.User]
	jwtSecret string
}

func NewUserHandler(repo *repository.GormRepository[database.User]) *userHandler {
	jwtSecret := os.Getenv("JWT_SIGNING_KEY")
	if jwtSecret == "" {
		slog.Error("JWT_SIGNING_KEY is not set in environment variables")
		os.Exit(1)
	}

	return &userHandler{
		repo:      repo,
		jwtSecret: jwtSecret,
	}
}

func (h *userHandler) login(ctx *gin.Context) {
	var loginDto LoginDto

	if err := ctx.ShouldBindJSON(&loginDto); err != nil {
		slog.Warn("invalid login attempt", "error", err)
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid input data",
		})
		return
	}

	user, err := h.repo.GetByEmail(loginDto.Email)
	if err != nil {
		slog.Info("login failed: user not found", "email", loginDto.Email)
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"message": "Invalid email or password",
		})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(loginDto.Password))
	if err != nil {
		slog.Info("login failed: incorrect password", "email", loginDto.Email)
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"message": "Invalid email or password",
		})
		return
	}

	token, err := h.generateToken(user.ID)
	if err != nil {
		slog.Error("error signing token", "error", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Unable to login. Please try again later.",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"accessToken": token,
	})
}

func (h *userHandler) create(ctx *gin.Context) {
	var user SignupDto

	if err := ctx.ShouldBindJSON(&user); err != nil {
		slog.Warn("invalid signup attempt", "error", err)
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid input data",
		})
		return
	}

	if err := validatePassword(user.Password); err != nil {
		slog.Debug("password validation failed", "error", err)
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 12)
	if err != nil {
		slog.Error("error hashing password", "error", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Internal server error",
		})
		return
	}

	newUser := &database.User{
		Name:         user.Name,
		Email:        user.Email,
		PasswordHash: string(hashedPassword),
	}

	err = h.repo.Create(newUser)
	if err != nil {
		slog.Error("error creating user", "error", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Unable to create user. Please try again later.",
		})
		return
	}

	token, err := h.generateToken(newUser.ID)
	if err != nil {
		slog.Error("error signing token", "error", err)
		// User created but token failed
		ctx.JSON(http.StatusCreated, gin.H{
			"message": "User created, but unable to generate token. Please login.",
		})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"accessToken": token,
		"message":     "User created successfully",
	})
}

func (h *userHandler) list(ctx *gin.Context) {
	users, err := h.repo.List()
	if err != nil {
		slog.Error("error listing users", "error", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Unable to retrieve users",
		})
		return
	}

	ctx.JSON(http.StatusOK, users)
}

func (h *userHandler) generateToken(userId uint) (string, error) {
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

func validatePassword(password string) error {
	var (
		hasUpper   = false
		hasLower   = false
		hasSpecial = false
		hasNumber  = false
	)

	if len(password) < 8 {
		return errors.New("password must be at least 8 characters long")
	}

	for _, c := range password {
		switch {
		case unicode.IsUpper(c):
			hasUpper = true
		case unicode.IsLower(c):
			hasLower = true
		case unicode.IsNumber(c):
			hasNumber = true
		case unicode.IsSymbol(c) || unicode.IsPunct(c):
			hasSpecial = true
		}
	}

	if !hasUpper || !hasLower || !hasNumber || !hasSpecial {
		return errors.New("password must contain upper, lower, numeric, and special characters")
	}

	return nil
}
