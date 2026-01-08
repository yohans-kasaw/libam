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

type UserDto struct {
	Name     string `json:"name" binding:"required,min=2,max=100"`
	Email    string `json:"email" binding:"email"`
	Password string `json:"password" binding:"required"`
}

type userHandler struct {
	repo *repository.GormRepository[database.User]
}

func NewUserHandler(repo *repository.GormRepository[database.User]) *userHandler {
	return &userHandler{
		repo: repo,
	}
}

func (h *userHandler) create(ctx *gin.Context) {
	var user UserDto

	if err := ctx.ShouldBindJSON(&user); err != nil {
		slog.Error("error creating user", "error", err)
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "validation of your input is not correct",
		})
		return
	}

	if err := validatePassword(user.Password); err != nil {
		slog.Error(err.Error())

		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 12)

	if err != nil {
		slog.Error("Error hashing password", "error", err)
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "error hashing password",
		})
		return
	}

	err = h.repo.Create(&database.User{
		Name:         user.Name,
		Email:        user.Email,
		PasswordHash: string(hashedPassword),
	})

	if err != nil {
		slog.Error("error getting users", "error", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Unable to create user. Please try again later.",
		})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})
}

func (h *userHandler) list(ctx *gin.Context) {
	users, err := h.repo.List()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Unable to retrieve users. Please try again later.",
			"error":   err.Error(),
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
		return errors.New("password must be greater than 8")
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
