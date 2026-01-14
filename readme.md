# cjs

A small C interpreter written in JavaScript, supporting a strict subset of C focused on control flow and expressions.


## Installation

### Linux/macOS
```bash
# Make the binary executable
chmod +x bin/cjs.js

npm link  # installs `cjs` as a global CLI

```

### Windows
```cmd
:: Link the package globally (npm handles the executable shim)
npm link
```

## Usage

```bash
# Run a C file
cjs <file.c>

# Enable Undefined Behavior (UB) mode
# (introduces intentionally unstable behavior to emulate C semantics)
cjs <file.c> --ub

```


> This project is under active development and currently supports a limited subset of C.

