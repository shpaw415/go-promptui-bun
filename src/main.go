package main

import (
	"C"
	"fmt"

	"github.com/manifoldco/promptui"
)

type SelectParams struct {
	Label string
	Items []string
}

//export RunSelect
func RunSelect(params: SelectParams) *C.char {
	prompt := promptui.Select{
		Label: params.Label,
		Items: params.Items,
	}

	_, result, err := prompt.Run()

	if err != nil {
		return C.CString(fmt.Sprintf("Erreur: %v", err))
	}

	return C.CString(result)
}

func main() {
	// Obligatoire pour la compilation en mode c-shared
}