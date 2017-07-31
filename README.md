# Swagger UI Watcher

Swagger UI Watcher detects changes in your local Swagger files and reload Swagger UI in your browser to give you fluid workflow. It is primarily developed to work with multiple Swagger files using $ref.

## Why?

- Using online Swagger Editor is annoying. You have to copy and paste your Swagger files back and forth.
- Relative and local system $ref do not work with online Swagger Editor v3
- Manually creating bundle from multiple Swagger files after each update is impractical and tiresome.
- Using my editor/ide of choice is awesome.

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

Click the image to see it in action

[![Alt text](http://i.imgur.com/UQMAn4U.png)](https://www.youtube.com/embed/s-77RrN311c?autoplay=1)
