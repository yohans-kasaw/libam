package api

import (
	"errors"
	"libam/database"
	"libam/repository"
	"log/slog"
	"net/http"
	"unicode"

	"github.com/gin-gonic/gin"
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

type userHandler struct {
	repo *repository.GormRepository[database.User]
	auth *Auth
}

func NewUserHandler(repo *repository.GormRepository[database.User]) *userHandler {
	return &userHandler{
		repo: repo,
		auth: NewAuth(),
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

	token, err := h.auth.generateToken(user.ID)
	if err != nil {
		slog.Error("error signing token", "error", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Unable to login. Please try again later.",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"access_token": token,
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

	token, err := h.auth.generateToken(newUser.ID)
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
