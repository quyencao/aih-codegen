const { renderString } = require('template-file')
const fs = require('fs')
const TemplateBase = require("./template_base")


class SequelizeConnection extends TemplateBase {
    constructor(user, pass, db_host, db_port, db_name) {
        super(`./templates/config.json`)
        this._output_file_name = "config"
        this._user = user
        this._pass = pass
        this._db_host = db_host
        this._db_port = db_port
        this._db_name = db_name
    }

    create() {
        const rendered_string = this._get_model_rendered_string(this._user, this._pass, this._db_host, this._db_port, this._db_name)
        fs.writeFileSync(`./models/configs/${this._output_file_name}.json`, rendered_string)
    }

    _get_model_rendered_string(user, pass, db_host, _db_port, db_name) {
        const model_data = this._get_model_data(user, pass, db_host, _db_port, db_name)
        const model_template = this._read_template()
        const rendered_string = renderString(model_template, model_data)
        return rendered_string
    }

    _get_model_data(user, pass, db_host, db_port, db_name) {
        const data ={
            user: user,
            pass: pass,
            db_host: db_host,
            db_port: db_port,
            db_name: db_name
        }

        return data
    }
}


module.exports = SequelizeConnection