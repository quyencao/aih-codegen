# AIH CODEGEN

Generate graphql schema and resolver code

# Usage
```sh-session
$ npm install -g aih-codegen
$ aih COMMAND
running command...
$ aih (-V|--version)
0.0.1
$ aih --help
  Usage: aih [options] [command]
  Generate graphql code
...
```

# Commands
* [`aih codegen:schema`](#aih-codegen-schema)
* [`aih codegen:resolver`](#aih-codegen-resolver)
* [`aih codegen:app`](#aih-codegen-app)

## `aih codegen:schema`
Generate schema

```
USAGE
  $ aih codegen:schema

OPTIONS
  -c, --config=config                    Path to your config file
  -o, --output=output                    Path to store generate schema file
```

## `aih codegen:resolver`
Generate schema

```
USAGE
  $ aih codegen:resolver

OPTIONS
  -c, --config=config                    Path to your config file
  -o, --output=output                    Path to store generate resolver file
```

## `aih codegen:app`
Generate schema and resolver

```
USAGE
  $ aih codegen:resolver

OPTIONS
  -c, --config=config                    Path to your config file
  -s, --soutput=soutput                  Path to store generate schema file
  -r, --routput=routput                  Path to store generate resolver file
```