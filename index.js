#!/usr/bin/env node
const path = require("path");
const argv = require("yargs");
const nodePlop = require("node-plop");
const { isExistsFile } = require("./helpers/db");

// load an instance of plop from a plopfile
const plop = nodePlop(path.resolve(__dirname, "plopfile.js"), {
    destBasePath: process.cwd()
});

argv
    .usage("Usage: $0 <command> [options]")
    .command({
        command: "codegen:schema [options]",
        aliases: ["s"],
        desc: "Generate graphql schema",
        builder: (yargs) => {
            yargs.options({
                config: {
                    alias: "c",
                    describe: "Path to config file",
                    type: "string",
                    demand: false,
                    default: "config.yaml"
                },
                output: {
                    alias: "o",
                    describe: "Path to store output file",
                    type: "string",
                    demand: false,
                    default: "schema.js"
                }
            })
        },
        handler: (argv) => {
            const schemaGenerator = plop.getGenerator("codegen:schema");

            schemaGenerator
                .runActions({ config: argv.config, output: argv.output })
                .then(() => {
                    console.log("Done!");
                })
                .catch(err => console.error(err));
        }
    })
    .command({
        command: "codegen:resolver [options]",
        aliases: ["r"],
        desc: "Generate graphql resolvers",
        builder: (yargs) => {
            yargs.options({
                config: {
                    alias: "c",
                    describe: "Path to config file",
                    type: "string",
                    demand: false,
                    default: "config.yaml"
                },
                output: {
                    alias: "o",
                    describe: "Path to store output file",
                    type: "string",
                    demand: false,
                    default: "resolvers.js"
                }
            })
        },
        handler: (argv) => {
            const resolverGenerator = plop.getGenerator("codegen:resolver");

            resolverGenerator
                .runActions({ config: argv.config, output: argv.output })
                .then(() => {
                    console.log("Done!");
                })
                .catch(err => console.error(err));
        }
    })
    .command({
        command: "codegen:app [options]",
        aliases: ["a"],
        desc: "Generate graphql schema and resolvers",
        builder: (yargs) => {
            yargs.options({
                config: {
                    alias: "c",
                    describe: "Path to config file",
                    type: "string",
                    demand: false,
                    default: "config.yaml"
                },
                soutput: {
                    alias: "s",
                    describe: "Path to store output schema file",
                    type: "string",
                    demand: false,
                    default: "schema.js"
                },
                routput: {
                    alias: "r",
                    describe: "Path to store output resolver file",
                    type: "string",
                    demand: false,
                    default: "resolvers.js"
                }
            })
        },
        handler: (argv) => {
            const appGenerator = plop.getGenerator("codegen:app");

            appGenerator
                .runActions({ config: argv.config, soutput: argv.soutput, routput: argv.routput })
                .then(() => {
                    console.log("Done!");
                })
                .catch(err => console.error(err));
        }
    })
    .command({
        command: "client:react [options]", 
        aliases: ["cr"],
        desc: "Generate React code for Graphql", 
        builder: (yargs) => {
            return yargs.option("endpoint", {
                alias: "e",
                describe: "Graphql endpoint",
                type: "string",
                nargs: 1,
                demand: "Endpoint is required"
            });
        },
        handler: (argv) => {
            const reactGenerator = plop.getGenerator("react:app");

            reactGenerator
                .runActions({ endpoint: argv.endpoint })
                .then(() => {
                    console.log("Done!");
                })
                .catch(err => console.error(err));
        }
    })
    .command({
        command: "client:vue [options]", 
        aliases: ["cv"],
        desc: "Generate Vue code for Graphql", 
        builder: (yargs) => {
            return yargs.option("endpoint", {
                alias: "e",
                describe: "Graphql endpoint",
                type: "string",
                nargs: 1,
                demand: "Endpoint is required"
            })
        },
        handler: (argv) => {
            const vueGenerator = plop.getGenerator("vue:app");

            vueGenerator
                .runActions({ endpoint: argv.endpoint })
                .then(() => {
                    console.log("Done!");
                })
                .catch(err => console.error(err));
        }
    })
    .command({
        command: "client:android [options]", 
        aliases: ["ca"],
        desc: "Generate Android code for Graphql", 
        builder: (yargs) => {
            return yargs.option("endpoint", {
                alias: "e",
                describe: "Graphql endpoint",
                type: "string",
                nargs: 1,
                demand: "Endpoint is required"
            })
        },
        handler: (argv) => {
            const androidGenerator = plop.getGenerator("android:app");

            androidGenerator
                .runActions({ endpoint: argv.endpoint })
                .then(() => {
                    console.log("Done!");
                })
                .catch(err => console.error(err));
        }
    })
    .command({
        command: "db:model [options]",
        aliases: ["gm"],
        desc: "Generate sequelize model",
        builder: (yargs) => {
            return yargs.options("input_config_path", {
                alias: "i",
                describe: "Config path",
                type: "string",
                nargs: 1,
                demand: "Config path is required"
            }).check(function(args) {
                return isExistsFile(args.input_config_path);
            });
        },
        handler: (argv) => {
            const dbGenerator = plop.getGenerator("db:model");

            dbGenerator
                .runActions({ config_path: argv.input_config_path })
                .then(() => {
                    console.log("Done!");
                })
                .catch(err => console.error(err));
        }
    })
    .command({
        command: "db:table [options]",
        aliases: ["gt"],
        desc: "Generate create table script",
        builder: (yargs) => {
            return yargs.options("input_config_path", {
                alias: "i",
                describe: "Config path",
                type: "string",
                nargs: 1,
                demand: "Config path is required"
            }).check(function(args) {
                return isExistsFile(args.input_config_path);
            });
        },
        handler: (argv) => {
            const dbGenerator = plop.getGenerator("db:table");

            dbGenerator
                .runActions({ config_path: argv.input_config_path })
                .then(() => {
                    console.log("Done!");
                })
                .catch(err => console.error(err));
        }
    })
    .command({
        command: "db:all [options]",
        aliases: ["ga"],
        desc: "Generate model and create table script",
        builder: (yargs) => {
            return yargs.options("input_config_path", {
                alias: "i",
                describe: "Config path",
                type: "string",
                nargs: 1,
                demand: "Config path is required"
            }).check(function(args) {
                return isExistsFile(args.input_config_path);
            });
        },
        handler: (argv) => {
            const dbGenerator = plop.getGenerator("db:all");

            dbGenerator
                .runActions({ config_path: argv.input_config_path })
                .then(() => {
                    console.log("Done!");
                })
                .catch(err => console.error(err));
        }
    })
    .help("help")
    .alias("help", "h")
    .version()
    .alias("version", "v")
    .argv