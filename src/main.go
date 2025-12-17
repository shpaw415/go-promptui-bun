package main

import (
	"C"
	"fmt"
	"unsafe"

	"github.com/goccy/go-json"
	"github.com/manifoldco/promptui"
)

func CallbackToJsonString(result interface{}) string {
	jsonBytes, err := json.Marshal(result)
	if err != nil {
		return fmt.Sprintf("Erreur: %v", err)
	}
	return string(jsonBytes)
}

//export RunSelect
func RunSelect(label *C.char, items **C.char, itemsCount C.int) *C.char {
	goLabel := C.GoString(label)
	goItems := make([]string, int(itemsCount))
	itemPtrs := (*[1 << 28]*C.char)(unsafe.Pointer(items))[:itemsCount:itemsCount]
	for i := 0; i < int(itemsCount); i++ {
		goItems[i] = C.GoString(itemPtrs[i])
	}

	prompt := promptui.Select{
		Label: goLabel,
		Items: goItems,
	}

	_, result, err := prompt.Run()

	if err != nil {
		return C.CString(fmt.Sprintf("Erreur: %v", err))
	}

	return C.CString(result)
}

type TextProps struct {
    Label       string `json:"label"`
    Default     string `json:"default"`
    AllowEdit   bool   `json:"allow_edit"`
    HideEntered bool   `json:"hide_entered"`
    IsConfirm   bool   `json:"is_confirm"`
    IsVimMode   bool   `json:"is_vim_mode"`
}

//export RunText
func RunText(props *C.char, validate *func(string) error) *C.char {
    goJsonProps := C.GoString(props)
    var tp TextProps

    if err := json.Unmarshal([]byte(goJsonProps), &tp); err != nil {
        return C.CString(fmt.Sprintf("Erreur: %v", err))
    }

    prompt := promptui.Prompt{
        Label:       tp.Label,
        Default:     tp.Default,
        AllowEdit:   tp.AllowEdit,
        HideEntered: tp.HideEntered,
        IsConfirm:   tp.IsConfirm,
        IsVimMode:   tp.IsVimMode,
		Validate:    validate,
    }

    result, err := prompt.Run()
    if err != nil {
        return C.CString(fmt.Sprintf("Erreur: %v", err))
    }
    return C.CString(result)
}

func main() {
	// Obligatoire pour la compilation en mode c-shared
}