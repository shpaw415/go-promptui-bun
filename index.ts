import { dlopen, FFIType } from "bun:ffi";

// Charger la bibliothèque partagée
const { symbols } = dlopen("./dist/lib/libprompt.so", {
  RunSelect: {
    args: [],
    returns: FFIType.cstring,
  },
});

console.log("Ouverture du menu Go...");

// Appeler la fonction Go
const selectedValue = symbols.RunSelect();

console.log(`\nRésultat récupéré dans Bun : ${selectedValue}`);
