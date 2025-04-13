package main

import (
	"syscall/js"
)

func main() {
	document := js.Global().Get("document")
	body := document.Get("body")
	body.Set("innerHTML", "<h1>Hello from Go (WebAssembly)!</h1>")

	// Нужно, чтобы программа не завершилась
	c := make(chan struct{})
	<-c
}
