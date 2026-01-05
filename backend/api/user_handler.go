package api

import (
	"libam/database"
	"libam/repository"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserDto struct {
	Name  string `json:"name" binding:"required,min=2,max=100"`
	Email string `json:"email" binding:"email"`
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
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "validation of your input is not correct",
			"error":   err.Error(),
		})
		return
	}

	err := h.repo.Create(&database.User{
		Name:  user.Name,
		Email: user.Email,
	})

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Unable to create user. Please try again later.",
			"error":   err.Error(),
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
