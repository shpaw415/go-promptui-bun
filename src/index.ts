import { dlopen, FFIType } from "bun:ffi";
import { OsToPath, parseResult, stringToCString } from "./utils";
import { type SelectProps, type TextProps } from "@/types";
import { join } from "path";

// Charger la bibliothèque partagée

function loadLibrary() {
  const { symbols } = dlopen(join(__dirname, "..", "dist/lib", OsToPath()), {
    RunSelect: {
      args: [
        FFIType.cstring, // Titre du menu
        FFIType.pointer, // Options du menu (tableau de chaînes)
        FFIType.int8_t, // Nombre d'options
      ],
      returns: FFIType.cstring,
    },
    RunText: {
      args: [FFIType.cstring], // JSON des propriétés
      returns: FFIType.cstring,
    },
  });
  return symbols;
}

const symbols = loadLibrary();

export function text(props: TextProps) {
  const { validate, ...toStringify } = props;

  const jsonProps = JSON.stringify(toStringify);
  const resultPtr = symbols.RunText(stringToCString(jsonProps));

  const res = parseResult<string>(resultPtr);
  if ("error" in res) {
    throw new Error(res.error);
  } else {
    const validated = validate?.(res.result);
    if (validated) {
      throw new Error(validated);
    } else {
      return res.result;
    }
  }
}

export function select(options: SelectProps) {
  const jsonProps = JSON.stringify(options);
  const resultPtr = symbols.RunSelect(stringToCString(jsonProps));
  const res = parseResult<string>(resultPtr);

  if ("error" in res) {
    throw new Error(res.error);
  } else {
    return res.result;
  }
}
