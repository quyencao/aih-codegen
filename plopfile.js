const fs = require("fs");
const path = require("path");
const yaml = require("yaml");
const { buildClientSchema, introspectionQuery } = require("graphql");
const fetch = require('node-fetch');
const addFile = require("node-plop/lib/actions/add").default;
const { generateQuery, getVarsToTypesStr } = require("./helpers");

module.exports = function(plop) {

  plop.setActionType('generateQuery', function (data, config, plop) {
        return new Promise((resolve, reject) => {
            fetch(data.endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: introspectionQuery })
            })
            .then(res => res.json())
            .then(res => {
                const gqlSchema = buildClientSchema(res.data);
                const promises = [];

                if (gqlSchema.getQueryType()) {
                    const obj = gqlSchema.getQueryType().getFields();
                    const description = 'Query';
                    Object.keys(obj).forEach((type) => {
                        const field = gqlSchema.getType(description).getFields()[type];
                        /* Only process non-deprecated queries/mutations: */
                        if (!field.isDeprecated) {
                          const queryResult = generateQuery(gqlSchema, type, description);
                          const varsToTypesStr = getVarsToTypesStr(queryResult.argumentsDict);
                          let query = queryResult.queryStr;
                          query = `${description.toLowerCase()} ${type}${varsToTypesStr ? `(${varsToTypesStr})` : ''}{\n${query}\n}`;
                          promises.push(addFile(Object.assign({}, data, { gql_type: type, gql: query }), config, plop));
                        }
                    });
                }

                return Promise.all(promises);
            })
            .then(() => resolve("Done!"))
            .catch(err => {
                console.log(err);
                reject('Error! Try again')
            })
        });
  });

  plop.setActionType('generateMutation', function (data, config, plop) {
    return new Promise((resolve, reject) => {
        fetch(data.endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: introspectionQuery })
        })
        .then(res => res.json())
        .then(res => {
            const gqlSchema = buildClientSchema(res.data);
            const promises = [];

            if (gqlSchema.getMutationType()) {
                const obj = gqlSchema.getMutationType().getFields();
                const description = 'Mutation';
                
                Object.keys(obj).forEach((type) => {
                    const field = gqlSchema.getType(description).getFields()[type];
                    /* Only process non-deprecated queries/mutations: */
                    if (!field.isDeprecated) {
                      const queryResult = generateQuery(gqlSchema, type, description);
                      const varsToTypesStr = getVarsToTypesStr(queryResult.argumentsDict);
                      let query = queryResult.queryStr;
                      query = `${description.toLowerCase()} ${type}${varsToTypesStr ? `(${varsToTypesStr})` : ''}{\n${query}\n}`;
                      promises.push(addFile(Object.assign({}, data, { gql_type: type, gql: query }), config, plop));
                    }
                })
            }

            return Promise.all(promises);
        })
        .then(() => resolve("Done!"))
        .catch(err => {
            console.log(err);
            reject('Error! Try again')
        })
    });
  });

  plop.setActionType('generateGql', function (data, config, plop) {
    return new Promise((resolve, reject) => {
        fetch(data.endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: introspectionQuery })
        })
        .then(res => res.json())
        .then(res => {
            const gqlSchema = buildClientSchema(res.data);
            const promises = [];

            if (gqlSchema.getQueryType()) {
                const obj = gqlSchema.getQueryType().getFields();
                const description = 'Query';

                Object.keys(obj).forEach((type) => {
                    const field = gqlSchema.getType(description).getFields()[type];

                    if (!field.isDeprecated) {
                      const queryResult = generateQuery(gqlSchema, type, description);
                      const varsToTypesStr = getVarsToTypesStr(queryResult.argumentsDict);
                      let query = queryResult.queryStr;
                      query = `${description.toLowerCase()} ${type}${varsToTypesStr ? `(${varsToTypesStr})` : ''}{\n${query}\n}`;
                      promises.push(addFile(Object.assign({}, data, { gql_type: type, gql: query }), config, plop));
                    }
                });
            }

            if (gqlSchema.getMutationType()) {
                const obj = gqlSchema.getMutationType().getFields();
                const description = 'Mutation';

                Object.keys(obj).forEach((type) => {
                    const field = gqlSchema.getType(description).getFields()[type];

                    if (!field.isDeprecated) {
                      const queryResult = generateQuery(gqlSchema, type, description);
                      const varsToTypesStr = getVarsToTypesStr(queryResult.argumentsDict);
                      let query = queryResult.queryStr;
                      query = `${description.toLowerCase()} ${type}${varsToTypesStr ? `(${varsToTypesStr})` : ''}{\n${query}\n}`;
                      promises.push(addFile(Object.assign({}, data, { gql_type: type, gql: query }), config, plop));
                    }
                });
            }

            return Promise.all(promises);
        })
        .then(() => resolve("Done!"))
        .catch(err => {
            console.log(err);
            reject('Error! Try again')
        });
    });
  });

  plop.setActionType("generateSchemaJson", function(data, config, plop) {
    return new Promise((resolve, reject) => {
        fetch(data.endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: introspectionQuery })
        })
        .then(res => res.json())
        .then(res => {
            return addFile(Object.assign({}, data, { schema: JSON.stringify(res.data, null, 2) }), config, plop);
        })
        .then(() => {
            resolve("Done!");
        })
        .catch(err => {
            console.log(err);
            reject('Error! Try again')
        });
    });
  });

  plop.setGenerator('react:connect', {
    description: 'Generate React Component to connect Graphql',
    prompts: [{
        type: 'input',
        name: 'endpoint',
        message: 'Enter graphql endpoint'
    }],
    actions: [
        {
            type: 'add',
            path: 'graphql/connect/Connect.js',
            templateFile: 'plop-templates/react/Connect.hbs',
            force: true
        }
    ]
  });

  plop.setGenerator('react:component', {
    description: 'Generate React Component for Graphql Query and Mutation',
    prompts: [{
        type: 'input',
        name: 'endpoint',
        message: 'Enter graphql endpoint'
    }],
    actions: [
        {
            type: 'generateQuery',
            path: 'graphql/queries/{{properCase gql_type}}.js',
            templateFile: 'plop-templates/react/Query.hbs',
            force: true
        },
        {
            type: 'generateMutation',
            path: 'graphql/mutations/{{properCase gql_type}}.js',
            templateFile: 'plop-templates/react/Mutation.hbs',
            force: true
        }
    ]
  });

  plop.setGenerator('react:app', {
    description: 'Generate React Graphql App',
    prompts: [{
        type: 'input',
        name: 'endpoint',
        message: 'Enter graphql endpoint'
    }],
    actions: [
        {
            type: 'add',
            path: 'graphql/connect/Connect.js',
            templateFile: 'plop-templates/react/Connect.hbs',
            force: true
        },
        {
            type: 'generateQuery',
            path: 'graphql/queries/{{properCase gql_type}}.js',
            templateFile: 'plop-templates/react/Query.hbs',
            force: true
        },
        {
            type: 'generateMutation',
            path: 'graphql/mutations/{{properCase gql_type}}.js',
            templateFile: 'plop-templates/react/Mutation.hbs',
            force: true
        }
    ]
  });

  plop.setGenerator('vue:connect', {
    description: 'Generate Vue file to connect Graphql',
    prompts: [{
        type: 'input',
        name: 'endpoint',
        message: 'Enter graphql endpoint'
    }],
    actions: [
        {
            type: 'add',
            path: 'graphql/connect/vue-apollo.js',
            templateFile: 'plop-templates/vue/Connect.hbs',
            force: true
        }
    ]
  });

  plop.setGenerator('vue:component', {
    description: 'Generate Vue conponent for Graphql Query and Mutation',
    prompts: [{
        type: 'input',
        name: 'endpoint',
        message: 'Enter graphql endpoint'
    }],
    actions: [
        {
            type: 'generateGql',
            path: 'graphql/gqls/{{properCase gql_type}}.gql',
            templateFile: 'plop-templates/vue/Gql.hbs',
            force: true
        },
        {
            type: 'generateQuery',
            path: 'graphql/queries/{{properCase gql_type}}.vue',
            templateFile: 'plop-templates/vue/Query.hbs',
            force: true
        },
        {
            type: 'generateMutation',
            path: 'graphql/mutations/{{properCase gql_type}}.vue',
            templateFile: 'plop-templates/vue/Mutation.hbs',
            force: true
        },
    ]
  });

  plop.setGenerator('vue:app', {
    description: 'Generate Vue Graphql App',
    prompts: [{
        type: 'input',
        name: 'endpoint',
        message: 'Enter graphql endpoint'
    }],
    actions: [
        {
            type: 'add',
            path: 'graphql/connect/vue-apollo.js',
            templateFile: 'plop-templates/vue/Connect.hbs',
            force: true
        },
        {
            type: 'generateGql',
            path: 'graphql/gqls/{{properCase gql_type}}.gql',
            templateFile: 'plop-templates/vue/Gql.hbs',
            force: true
        },
        {
            type: 'generateQuery',
            path: 'graphql/queries/{{properCase gql_type}}.vue',
            templateFile: 'plop-templates/vue/Query.hbs',
            force: true
        },
        {
            type: 'generateMutation',
            path: 'graphql/mutations/{{properCase gql_type}}.vue',
            templateFile: 'plop-templates/vue/Mutation.hbs',
            force: true
        },
    ]
  });

  plop.setGenerator("android:app", {
    description: "Generate graphql for android",
    prompts: [{
        type: 'input',
        name: 'endpoint',
        message: 'Enter graphql endpoint'
    }],
    actions: [
        {
            type: 'add',
            path: 'java/com/apollographql/apollo/client/GraphqlClient.java',
            templateFile: 'plop-templates/android/GraphqlClient.hbs',
            force: true
        },
        {
            type: 'generateSchemaJson',
            path: 'graphql/com/apollographql/apollo/api/schema.json',
            templateFile: 'plop-templates/android/schema.hbs',
            force: true
        },
        {
            type: 'generateGql',
            path: 'graphql/com/apollographql/apollo/api/{{properCase gql_type}}.graphql',
            templateFile: 'plop-templates/android/Graphql.hbs',
            force: true
        },
    ]
  });

  plop.setGenerator("codegen:schema", {
    description: "Generate grahql schema",
    prompts: [
        {
            type: "input",
            name: "config",
            message: "Path to file config"
        }, 
        {
            type: 'input',
            name: "output",
            message: "Path to store output file"
        }
    ],
    actions: function(data) {
        const doc = yaml.parse(fs.readFileSync(data.config, "utf8"));
        return [
            {
                type: "add",
                path: data.output,
                templateFile: 'plop-templates/server/schema.hbs',
                data: { types: doc.types },
                force: true
            }
        ]
    }
  });

  plop.setGenerator("codegen:resolver", {
    description: "Generate grahql resolver",
    prompts: [
        {
            type: "input",
            name: "config",
            message: "Path to file config"
        }, 
        {
            type: 'input',
            name: "output",
            message: "Path to store output file"
        }
    ],
    actions: function(data) {
        const doc = yaml.parse(fs.readFileSync(data.config, "utf8"));
        return [
            {
                type: "add",
                path: data.output,
                templateFile: 'plop-templates/server/resolvers.hbs',
                data: { types: doc.types },
                force: true
            }
        ]
    }
  });

  plop.setGenerator("codegen:app", {
    description: "Generate grahql schema and resolver",
    prompts: [
        {
            type: "input",
            name: "config",
            message: "Path to file config"
        }, 
        {
            type: "input",
            name: "soutput",
            message: "Path to store schema output file"
        }, 
        {
            type: "input",
            name: "routput",
            message: "Path to store resolver output file"
        }
    ],
    actions: function(data) {
        const doc = yaml.parse(fs.readFileSync(data.config, "utf8"));
        return [
            {
                type: "add",
                path: data.soutput,
                templateFile: 'plop-templates/server/schema.hbs',
                data: { types: doc.types },
                force: true
            },
            {
                type: "add",
                path: data.routput,
                templateFile: 'plop-templates/server/resolvers.hbs',
                data: { types: doc.types },
                force: true
            }
        ]
    }
  });
};