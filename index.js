#! /usr/bin/env node

const program = require("commander");
const { generateResolver, generateSchema } = require("./codegen");

program
    .version("0.0.1")
    .description("Generate graphql code");

program
    .command("codegen:schema")
    .alias("s")
    .description("Generate graphql schema")
    .option("-c, --config <path>", "Path to config file", "config.yaml")
    .option("-o, --output <path>", "Path to store output file", "schema.js")
    .action(options => {
        generateSchema(options.config, options.output);
    });

program
    .command("codegen:resolver")
    .alias("r")
    .description("Generate graphql resolvers")
    .option("-c, --config <path>", "Path to config file", "config.yaml")
    .option("-o, --output <path>", "Path to store output file", "resolvers.js")
    .action(options => {
        generateResolver(options.config, options.output);
    });

program
    .command("codegen:app")
    .alias("a")
    .description("Generate graphql schema and resolvers")
    .option("-c, --config <path>", "Path to config file", "config.yaml")
    .option("-s, --soutput <path>", "Path to store output schema file", "schema.js")
    .option("-r, --routput <path>", "Path to store output resolver file", "resolvers.js")
    .action(options => {
        generateSchema(options.config, options.soutput);
        generateResolver(options.config, options.routput);
    });

program.parse(process.argv);