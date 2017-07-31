# Swagger Watcher

Swagger Watcher detects changes in your local Swagger files and reload Swagger UI in your browser to give you fluid workflow. It is primarily developed to work with multiple Swagger files using $ref.

## Installation

```
npm install swagger-watcher -g
```

## Usage

```
swagger-watcher ./main-swagger-file.json ./folder-with-swagger-files
```

You can also save a bundle with **--bundle** option whenever there is a change.

```
swagger-watcher ./swagger-main-file.json ./folder-with-swagger-files --bundle=./bundled.json
``` 