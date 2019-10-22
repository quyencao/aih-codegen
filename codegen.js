const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const yaml = require("yaml");

const generateSchema = function(config, output) {
    const doc = yaml.parse(fs.readFileSync(config, "utf8"))
    const schemaTemplate = path.resolve(__dirname, "templates", "schema.ejs");
    
    ejs.renderFile(schemaTemplate, { types: doc.types },  function(err, schema) {
        if (err) {
            throw err;
        }

        fs.writeFileSync(output, schema);
    });
};

const generateResolver = function(config, output){
    const doc = yaml.parse(fs.readFileSync(config, "utf8"))
    const resolverTemplate = path.resolve(__dirname, "templates", "resolvers.ejs");

    ejs.renderFile(resolverTemplate, { types: doc.types },  function(err, resolver) {
        if (err) {
            throw err;
        }

        fs.writeFileSync(output, resolver);
    });
};

module.exports = {
    generateResolver,
    generateSchema
};

