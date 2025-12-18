# go-promptui-bun

# go-promptui-bun

A Bun.js native addon for using Go's [promptui](https://github.com/manifoldco/promptui) interactive prompts from JavaScript/TypeScript. This project enables you to call Go-powered terminal UIs (select and text prompts) from your Bun applications.

## Features

- Exposes Go promptui's Select and Prompt (text input) to JavaScript/TypeScript
- Fast, native integration using Bun's FFI
- Supports advanced promptui options (vim mode, custom keys, etc.)

## Usage

### 1. Install dependencies

```
bun install
```

### 2. Build the Go shared library

```
go build -o libpromptui.so -buildmode=c-shared ./src/main.go
```

### 3. Use in your Bun/Node.js project

```ts
import { select, text } from "go-promptui-bun";

const selectResult = await select({
  Label: "Choose an option",
  Items: ["A", "B", "C"],
  Size: 5,
  CursorPos: 0,
  IsVimMode: false,
  HideHelp: false,
  HideSelected: false,
  Keys: {
    /* ... */
  },
});

console.log(selectResult);

const textResult = await text({
  Label: "Enter your name",
  Default: "",
  AllowEdit: true,
  HideEntered: false,
  IsConfirm: false,
  IsVimMode: false,
});

console.log(textResult);
```

## API

### `select(props: SelectProps): { result: string, error?: string }`

- Presents a selection prompt in the terminal.
- `props` matches Go's promptui.Select options (see `types/select.ts`).

### `text(props: TextProps): { result: string, error?: string }`

- Presents a text input prompt in the terminal.
- `props` matches Go's promptui.Prompt options.

## Development

- Go code: [`src/main.go`](src/main.go)
- TypeScript FFI: [`src/index.ts`](src/index.ts), [`types/`](types/)
- Tests: [`test/`](test/)

### Run tests

```
bun test
```

## License

MIT
To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.4. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
