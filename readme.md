# cjs

A lightweight C interpreter implemented in JavaScript, designed to execute a deliberately scoped subset of C with an emphasis on core runtime semantics

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


> This project is under active development and intentionally supports only a subset of C.
> Features are added selectively, with correctness and semantic clarity taking priority over completeness.

