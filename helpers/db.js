const fs = require("fs");
const YAML = require("yaml");

const isExistsFile = (path) => {
    return fs.existsSync(path)
}

const readConfiguration = (config_path) => {
    const config_file = fs.readFileSync(config_path, 'utf8')
    const config_data = YAML.parse(config_file)

    return config_data
}

module.exports = {
    isExistsFile,
    readConfiguration
}