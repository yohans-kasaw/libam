package server

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestPing(t *testing.T) {
	s := Server{}

	r := gin.New()
	r.GET("/ping", s.ping)

	req, err := http.NewRequest("GET", "/ping", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	r.ServeHTTP(rr, req)

	// check the status
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("status code failed: want %v got %v", http.StatusOK, status)
	}
	// check the body

	expected := "pong"
	if rr.Body.String() != expected {
		t.Errorf("responsed body failed: want %v got %v", expected, rr.Body.String())
	}
}
