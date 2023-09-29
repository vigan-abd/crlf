# @vigan-abd/crlf

Easily convert line endings of files matching a glob pattern between CRLF and LF using this Node.js CLI utility.

## Installation
```cibsike
npm install -g @vigan-abd/crlf
```

## Usage
```console
crlf --type <conversion_type> --pattern "<glob_pattern>" [--encoding <file_encoding>]
```

### Parameters:

- **type**: Specify the target line ending format. Available options: **lf**, **crlf**.
- **pattern**: Glob pattern to match files. Make sure to use quotes!
- **encoding**: (Optional) Specify the file encoding. Default is **utf-8**.

### Example:

Convert all **.txt** files in the current directory from any line ending format to **LF**:

```console
crlf --type lf --pattern "*.txt"
```

## Features
- **Interactive**: Before converting, the CLI will list all matched files and ask for your confirmation.
- **Glob patterns**: Easily target multiple files in different directories using glob patterns.
- **Safe**: Conversion only happens after your confirmation.

### Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
GNU GPL v3
