package server

import (
	"libam/database"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserDto struct {
	Name  string `json:"name" binding:"required,min=2,max=100"`
	Email string `json:"email" binding:"email"`
}

func (s *Server) getAllUsers(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, s.database.GetAllUsers())
}

func (s *Server) createUser(ctx *gin.Context) {
	var user UserDto
    
    if err := ctx.ShouldBindJSON(&user); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return 
    }

    err := s.database.CreateUser(&database.User{
        Name:  user.Name,
        Email: user.Email,
    })

    if err != nil {
        ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to carve the record into stone"})
        return
    }

    ctx.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})
}
