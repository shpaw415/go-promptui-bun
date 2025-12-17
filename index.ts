import { dlopen, FFIType } from "bun:ffi";
import { functionToCallback, stringToCString, toCStringArray } from "./utils";
import { type TextProps } from "./types";

// Charger la bibliothèque partagée
const { symbols } = dlopen("./dist/lib/linux/libprompt.so", {
  RunSelect: {
    args: [
      FFIType.cstring, // Titre du menu
      FFIType.pointer, // Options du menu (tableau de chaînes)
      FFIType.int8_t, // Nombre d'options
    ],
    returns: FFIType.cstring,
  },
  RunText: {
    args: [FFIType.cstring, "callback"], // JSON des propriétés
    returns: FFIType.cstring,
  },
});

const title = "Sélectionner une option";
const options = ["Option 1", "Option 2", "Option 3"];

/*
const selectedValue = symbols.RunSelect(
  stringToCString(title),
  toCStringArray(options).ptr,
  options.length
);
*/

export function text(props: TextProps) {
  const { validate, ...toStringify } = props;

  const jsonProps = JSON.stringify(toStringify);
  const validateCallback = functionToCallback(
    validate ?? ((input: string) => null)
  );
  const resultPtr = symbols.RunText(
    stringToCString(jsonProps),
    validateCallback.ptr
  );
  return resultPtr;
}

const res = text({
  label: "Entrez votre nom:",
  default: "Utilisateur",
  validate: (input) => {
    console.log("Validation de l'entrée:", input);
    return null;
  },
});

console.log("Résultat du prompt texte:", res.toString());
