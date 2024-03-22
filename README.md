# Swagger UI Watcher

Swagger UI Watcher detects changes in your local Swagger files and reload Swagger UI in your browser to give you fluid workflow. It is primarily developed to work with multiple Swagger files using \$ref.

## Why?

- Using online Swagger Editor is annoying. You have to copy and paste your Swagger files back and forth.
- Relative and local system \$ref do not work with online Swagger Editor v3
- Manually creating bundle from multiple Swagger files after each update is impractical and tiresome.
- Using my editor/ide of choice is awesome.

## Installation

| Version | Swagger Version |
| ------- | --------------- |
| 1.0.10  | 2               |
| >=2.0   | 3               |

```
npm install swagger-ui-watcher -g
```

## Usage

For watching the changes in target directory, following command is used

```
swagger-ui-watcher ./main-swagger-file.json
```

### Additional Options

| Command line argument        | Description                                                                                                                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| -p --port <port>             | Default is 8000                                                                                                                                                               |
| -h --host <Hostname/IP>      | Defaults to 127.0.0.1                                                                                                                                                         |
| --no-open                    | Do not open the view page in the default browser                                                                                                                              |
| -c --config <JSON_file>      | JSON file containing any of the [Swagger UI options](https://github.com/swagger-api/swagger-ui/blob/master/docs/usage/configuration.md). Example: `{"withCredentials": true}` |
| -b --bundle <bundleLocation> | Create bundle at the specified location                                                                                                                                       |
| -i --ignore <matches>        | File or path omitted from watching. Supports globbing                                                                                                                         |

For creating the bundled file, provide the optional argument `bundle`

```
swagger-ui-watcher ./main-swagger-file.json --bundle=./bundled.json
```

Click the image to see it in action

[![Alt text](http://i.imgur.com/UQMAn4U.png)](https://www.youtube.com/embed/ejBS75q3ouo?autoplay=1)

## Do What You Want to Public License

```
               DO WHAT YOU WANT TO PUBLIC LICENSE
                    Version 3, January 2012

 Copyright (C) 2012 Ryan Thompson

 Everyone is permitted to copy and distribute verbatim or modified
 copies of this license document, and changing it is allowed as long
 as the name is changed.

                DO WHAT YOU WANT TO PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. You just DO WHAT YOU WANT TO.
```
