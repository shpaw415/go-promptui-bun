import { CString } from "bun:ffi";
import type { ResultType } from "../types/common";

export function stringToCString(str: string): Uint8Array {
  return Buffer.from(str + "\0");
}

export function parseResult<T>(resultPtr: CString): ResultType<T> {
  const resultStr = resultPtr.toString();
  const resultObj = JSON.parse(resultStr);

  if (resultObj.error) {
    return { error: resultObj.error };
  } else {
    return { result: resultObj.result };
  }
}

export function OsToPath() {
  switch (process.platform) {
    case "linux":
      return "linux/libprompt.so";
    case "darwin":
      return "macos/libprompt.dylib";
    case "win32":
      return "windows/libprompt.dll";
    default:
      throw new Error("Unsupported platform: " + process.platform);
  }
}
