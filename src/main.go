package main

import (
	"C"
	"fmt"

	"github.com/goccy/go-json"
	"github.com/manifoldco/promptui"
)

type TextReturn struct {
	Result string `json:"result"`
	Error  string `json:"error,omitempty"`
}

func formatResponse(result string, err error) *C.char {
	if err != nil {
		res, err := json.Marshal(TextReturn { Error: fmt.Sprintf("Erreur: %v", err)})
		if err != nil {
			return C.CString(fmt.Sprintf("Erreur: %v", err))
		}
		return C.CString(string(res))
	}
	res , err := json.Marshal(TextReturn { Result: result})
	if err != nil {
		return C.CString(fmt.Sprintf("Erreur: %v", err))
	}
	return C.CString(string(res))
}


type SelectProps struct {
	Label      string   `json:"Label"`
	Items      []string `json:"Items"`
	Size	   int      `json:"Size"`
	CursorPos  int      `json:"CursorPos"`
	IsVimMode   bool     `json:"IsVimMode"`
	HideHelp   bool     `json:"HideHelp"`
	HideSelected  bool     `json:"HideSelected"`
	Keys *promptui.SelectKeys `json:"Keys"`
	StartInSearchMode bool     `json:"StartInSearchMode"`
}
type SelectPropsUnserializable struct {
	Templates promptui.SelectTemplates
	Searcher func()
	Pointer func()
}

//export RunSelect
func RunSelect(props *C.char) *C.char {
	var sp SelectProps
	if err := json.Unmarshal([]byte(C.GoString(props)), &sp);  err != nil {
		return C.CString(fmt.Sprintf("Erreur: %v", err))
	}

	if sp.Keys == nil {
		sp.Keys = &promptui.SelectKeys{
		Prev:     promptui.Key{Code: promptui.KeyPrev, Display: promptui.KeyPrevDisplay},
		Next:     promptui.Key{Code: promptui.KeyNext, Display: promptui.KeyNextDisplay},
		PageUp:   promptui.Key{Code: promptui.KeyBackward, Display: promptui.KeyBackwardDisplay},
		PageDown: promptui.Key{Code: promptui.KeyForward, Display: promptui.KeyForwardDisplay},
		Search:   promptui.Key{Code: '/', Display: "/"},
	}
	}
	prompt := promptui.Select{
		Label:       sp.Label,
		Items:       sp.Items,
		Size:        sp.Size,
		CursorPos:   sp.CursorPos,
		IsVimMode:   sp.IsVimMode,
		HideHelp:    sp.HideHelp,
		HideSelected: sp.HideSelected,
		Keys:        sp.Keys,
		StartInSearchMode: sp.StartInSearchMode,
	}

	_, result, err := prompt.Run()

	return formatResponse(result, err)
}

type TextProps struct {
    Label       string `json:"Label"`
    Default     string `json:"Default"`
    AllowEdit   bool   `json:"AllowEdit"`
    HideEntered bool   `json:"HideEntered"`
    IsConfirm   bool   `json:"IsConfirm"`
    IsVimMode   bool   `json:"IsVimMode"`
	Mask		rune   `json:"Mask"`
}
type TextPropsUnserializable struct {
	Validate promptui.ValidateFunc
	Templates *promptui.PromptTemplates
	Pointer promptui.Pointer
}

//export RunText
func RunText(props *C.char) *C.char {
    var tp TextProps
    if err := json.Unmarshal([]byte(C.GoString(props)), &tp); err != nil {
        return C.CString(fmt.Sprintf("Erreur: %v", err))
    }

    prompt := promptui.Prompt{
        Label:       tp.Label,
        Default:     tp.Default,
        AllowEdit:   tp.AllowEdit,
        HideEntered: tp.HideEntered,
        IsConfirm:   tp.IsConfirm,
        IsVimMode:   tp.IsVimMode,
		Mask:        tp.Mask,
    }

    result, err := prompt.Run()
    return  formatResponse(result, err)
}

func main() {
	// Obligatoire pour la compilation en mode c-shared
}