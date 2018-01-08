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

This tool has two options, first one is watching the target directory for any changes and updating the swagger UI, and second one is building the swagger bundle file from directory

For watching the changes in target directory, following command is used
```
swagger-ui-watcher watch ./main-swagger-file.json ./folder-with-swagger-files
```

You can also save a bundle with **--bundle** option on file change event.

```
swagger-ui-watcher watch ./swagger-main-file.json ./folder-with-swagger-files --bundle=./bundled.json
``` 

For creating the bundled file

```
swagger-ui-watcher build ./swagger-multi-files/swag.yaml ./swagger-multi-files/
```
If you do not provide the **--bundle** option, the default bundle file created is **bundled.json** in the current working directory

You can also provide a bundle with **--bundle** option.

```
swagger-ui-watcher build ./swagger-multi-files/swag.yaml ./swagger-multi-files/ --bundle=./bundled.json
```

Click the image to see it in action

[![Alt text](http://i.imgur.com/UQMAn4U.png)](https://www.youtube.com/embed/s-77RrN311c?autoplay=1)
