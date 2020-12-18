# CREATE DEFAULT

Create default allows you to do what you need to do when starting your project with a single command.

## CONFIG

You can create config files for your projects.

    create-default --config

This command will ask you some questions then create a configuration file.

## Create Project with Config File

You can now create your project with the configuration file.

    create-default --project --path [file.json]

Or you can create a default project by leaving the path argument blank.

## Example Configuration

```JSON
{
  "configName": "config",
  "author": "xkraltr",
  "main": "src/index.js",
  "_dependencies": ["express", "axios"],
  "_devDependencies": ["nodemon", "mocha"],
  "scripts": {
    "start": "node .",
    "dev": "nodemon ."
  },
  "tree": [
    {
      "name": "src",
      "isFile": false,
      "tree": [
        {
          "name": "index.js",
          "isFile": true,
          "content": "// Some content here."
        }
        {
          "name": "something.json",
          "isFile" : true,
          "json": {
            "config": true
          }
        }
      ]
    }
  ]
}
```
