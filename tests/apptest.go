package tests

import (
	"github.com/revel/revel/testing"
	"net/url"
)

type AppTest struct {
	testing.TestSuite
}

func (t *AppTest) Before() {
	println("Set up")
}

func (t *AppTest) TestRoomJoinInvalid(){
	t.PostForm("/room/xxxxx/join",url.Values{})
	t.AssertStatus(400)
	t.AssertContentType("text/plain; charset=utf-8")
}


func (t *AppTest) TestRoomList(){
	t.PostForm("/room/list",url.Values{})
	t.AssertOk()
	t.AssertContentType("application/json; charset=utf-8")
}

func (t *AppTest) TestRoomCreate() {
	values := url.Values{}
	values.Set("owner","acnologia")
	t.PostForm("/room",values)
	t.AssertOk()
	t.AssertContentType("text/plain; charset=utf-8")
}



func (t *AppTest) TestThatIndexPageWorks() {
	t.Get("/")
	t.AssertOk()
	t.AssertContentType("text/html; charset=utf-8")
}

func (t *AppTest) After() {
	println("Tear down")
}
