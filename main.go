package main

import (
	"syscall/js"
)

func main() {
	doc := js.Global().Get("document")

	// Создаём чекбоксы a1, b1, c1
	a1 := createCheckbox("a1", "Option A1")
	b1 := createCheckbox("b1", "Option B1")
	c1 := createCheckbox("c1", "Option C1 (neutral)")

	// Добавляем их в body
	body := doc.Get("body")
	body.Call("appendChild", a1)
	body.Call("appendChild", b1)
	body.Call("appendChild", c1)

	// Обработчики
	a1.Get("firstChild").Call("addEventListener", "change", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		checked := a1.Get("firstChild").Get("checked").Bool()
		b1.Get("firstChild").Set("disabled", checked)
		return nil
	}))

	b1.Get("firstChild").Call("addEventListener", "change", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		checked := b1.Get("firstChild").Get("checked").Bool()
		a1.Get("firstChild").Set("disabled", checked)
		return nil
	}))

	// C1 не зависит ни от чего

	// Не даём программе завершиться
	select {}
}

// Создание чекбокса с меткой
func createCheckbox(id, label string) js.Value {
	doc := js.Global().Get("document")
	labelEl := doc.Call("createElement", "label")
	cb := doc.Call("createElement", "input")
	cb.Set("type", "checkbox")
	cb.Set("id", id)
	labelEl.Call("appendChild", cb)
	labelEl.Call("appendChild", doc.Call("createTextNode", " "+label))
	labelEl.Call("appendChild", doc.Call("createElement", "br"))
	return labelEl
}
