package ratelimit

import (
	"github.com/revel/revel"
	"golang.org/x/time/rate"
	"net"
	"sync"
	"time"
)

type visitor struct {
	limiter  *rate.Limiter
	lastSeen time.Time
}

var visitors = make(map[string]*visitor)
var mu sync.Mutex

func init() {
	go cleanupVisitors()
}

func getVisitor(ip string) *rate.Limiter {
	mu.Lock()
	defer mu.Unlock()
	v, exists := visitors[ip]
	if !exists {
		limiter := rate.NewLimiter(1, 5)
		visitors[ip] = &visitor{limiter, time.Now()}
		return limiter
	}
	v.lastSeen = time.Now()
	return v.limiter
}

func cleanupVisitors() {
	for {
		time.Sleep(time.Minute)
		mu.Lock()
		for ip, v := range visitors {
			if time.Since(v.lastSeen) > 3*time.Minute {
				delete(visitors, ip)
			}
		}
		mu.Unlock()
	}
}

func Limit(c *revel.Controller) revel.Result {
	ip, _, err := net.SplitHostPort(c.Request.RemoteAddr)
	if err == nil {
		limiter := getVisitor(ip)
		if !limiter.Allow(){
			c.Response.Status = 429
			return c.RenderText("Too many requests")
		}
	}
	return nil
}
