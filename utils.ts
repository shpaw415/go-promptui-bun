import { ptr, JSCallback, FFIType, CString } from "bun:ffi";

// On 64-bit systems (which Bun targets), a pointer is always 8 bytes.
const POINTER_SIZE = 8;

/**
 * Converts an array of strings to a C-style char** (pointer to pointers).
 * Returns the pointer and a 'references' array to prevent Garbage Collection.
 */
export function toCStringArray(strings: string[]) {
  // 1. Create null-terminated Buffers for each string.
  // C strings MUST end with a null byte (\0).
  const stringBuffers = strings.map((str) => Buffer.from(str + "\0"));

  // 2. Extract the memory addresses of those buffers.
  const pointerAddresses = stringBuffers.map((buf) => ptr(buf));

  // 3. Create an ArrayBuffer to hold the pointer addresses themselves.
  // This is the "array of pointers" (char*[]).
  const arrayBuffer = new ArrayBuffer(strings.length * POINTER_SIZE);
  const view = new DataView(arrayBuffer);

  // 4. Write each address into the ArrayBuffer.
  pointerAddresses.forEach((address, i) => {
    // address is a number, we cast to BigInt for setBigUint64
    view.setBigUint64(i * POINTER_SIZE, BigInt(address), true);
  });

  return {
    // This is your char**
    ptr: ptr(arrayBuffer),
    // CRITICAL: Keep these alive as long as the C code needs them.
    references: {
      strings: stringBuffers,
      pointerArray: arrayBuffer,
    },
  };
}

export function stringToCString(str: string): Uint8Array {
  return Buffer.from(str + "\0");
}

export function functionToCallback(fn: (...args: any) => any): JSCallback {
  const fnWrapper = (inputPtr: CString) => {
    const inputStr = inputPtr.toString();
    const result = fn(...JSON.parse(inputStr));
    return result;
  };

  return new JSCallback(fnWrapper, {
    args: [FFIType.cstring],
    returns: FFIType.cstring,
  });
}
