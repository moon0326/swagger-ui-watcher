# Swagger UI Watcher

Swagger UI Watcher detects changes in your local Swagger files and reload Swagger UI in your browser to give you fluid workflow. It is primarily developed to work with multiple Swagger files using $ref.

## Installation

```
npm install swagger-ui-watcher -g
```

## Usage

```
swagger-ui-watcher ./main-swagger-file.json ./folder-with-swagger-files
```

You can also save a bundle with **--bundle** option on file change event.

```
swagger-ui-watcher ./swagger-main-file.json ./folder-with-swagger-files --bundle=./bundled.json
``` 