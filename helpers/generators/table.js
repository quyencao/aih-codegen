class Table {
    constructor(name, configs) {
        this.name = name
        this.configs = configs
    }

    generateScriptForCreateTable() {
        const table_configs = this._generateTableConfigScript(this.configs)
        return `CREATE TABLE IF NOT EXISTS ${this.name} (${table_configs})`
    }

    _generateTableConfigScript(configs) {
        const { fields, primary_keys, foreign_keys } = configs
        const field_configs = this._generateScriptForFields(fields)
        const primary_key_configs = primary_keys ? this._generateScriptForPrimaryKeys(primary_keys) : null
        const foreign_key_configs = foreign_keys ? this._generateScriptForForeignKeys(foreign_keys) : null

        const resultLst = [field_configs]

        if (primary_key_configs) {
            resultLst.push(primary_key_configs)
        }

        if (foreign_key_configs) {
            resultLst.push(foreign_key_configs)
        }

        return resultLst.join(",")
    }

    _generateScriptForFields(fields) {
        const resultLst = fields.map(field => {
            const field_name = Object.keys(field).shift()
            const field_configs = field[field_name]

            return this._generateScriptForField(field_name, field_configs)
        })

        return resultLst.join(",")
    }

    _generateScriptForField(name, configs) {
        const { type, unique, not_null } = configs
        let result = `"${name}" ${type}`
        if (unique) {
            result += " UNIQUE"
        }
        if (not_null) {
            result += " NOT NULL"
        }

        return result
    }

    _generateScriptForPrimaryKeys(primary_keys) {
        const joined_keys = primary_keys.join(",")
        return `PRIMARY KEY (${joined_keys})`
    }

    _generateScriptForForeignKey(foreign_field) {
        const field_name = Object.keys(foreign_field).shift()
        const field_configs = foreign_field[field_name]
        const { ref_table, ref_field } = field_configs

        return `CONSTRAINT FK_${field_name} FOREIGN KEY (${field_name}) REFERENCES ${ref_table}(${ref_field})`
    }

    _generateScriptForForeignKeys(foreign_fields) {
        const resultLst = foreign_fields.map(foreign_field => {
            return this._generateScriptForForeignKey(foreign_field)
        })

        return resultLst.join(",")
    }
}

module.exports = Table