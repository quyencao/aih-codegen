const Table = require("./table")

class Database {
    constructor(configs) {
        this._configs = configs
    }

    getGenerateScriptForCreateAllTable() {
        const scripts = this._generateScriptForCreateAllTable(this._configs)
        const rendered_string = scripts.join(';\n')
        return rendered_string;
    }

    _generateScriptForCreateAllTable(configs) {
        try {
            const ordered_tables = this._get_ordered_tables(configs)
            const resultLst = ordered_tables.map(table_name => {
                const table_configs = configs[table_name]
                const table = new Table(table_name, table_configs)
                const create_table_script = table.generateScriptForCreateTable()
                return create_table_script
            })
            return resultLst
        } catch (error) {
            return error.message
        }
    }

    _get_ordered_tables(configs) {
        const all_table = this._get_all_table_name(configs)
        const all_independent_table = this._get_all_independent_table(configs)
        const result = all_independent_table.slice()
        const remain_tables = all_table.filter(table_name => !all_independent_table.includes(table_name))
        while (remain_tables.length) {
            let flag = false
            remain_tables.forEach(table_name => {
                const table_configs = configs[table_name]
                const reference_tables = this._get_tables_reference_of_table(table_name, table_configs)
                const is_reference_tables_exists_in_result = this._is_contains_array(result, reference_tables)

                if (is_reference_tables_exists_in_result) {
                    flag = true
                    result.push(table_name)
                    remain_tables.splice(remain_tables.indexOf(table_name), 1)
                }
            })

            if (!flag) {
                throw new Error(`Error at foreign key: ${remain_tables}`)
            }
        }

        return result
    }

    _get_all_table_name(configs) {
        return Object.keys(configs)
    }

    _is_contains_array(source, target) {
        return !target.filter(element => !source.includes(element)).length
    }


    _get_all_independent_table(configs) {
        const not_reference_tables = this._get_not_reference_tables(configs)
        const only_reference_to_itself_tables = this._get_only_reference_to_itself_tables(configs)

        return not_reference_tables.concat(only_reference_to_itself_tables)
    }

    _get_not_reference_tables(configs) {
        const result = []
        Object.keys(configs).forEach(table_name => {
            const table_configs = configs[table_name]
            const { foreign_keys } = table_configs

            if (!foreign_keys || !foreign_keys.length) {
                result.push(table_name)
            }
        })

        return result
    }

    _get_only_reference_to_itself_tables(configs) {
        const result = []
        Object.keys(configs).forEach(table_name => {
            const table_configs = configs[table_name]
            const is_only_reference_to_itself = this._is_only_reference_to_itself(table_name, table_configs)

            if (is_only_reference_to_itself) {
                result.push(table_name)
            }
        })
        return result
    }

    _is_only_reference_to_itself(table_name, table_configs) {
        const tables_reference_to = this._get_tables_reference_of_table(table_name, table_configs)
        return tables_reference_to.shift() == table_name
    }

    _get_tables_reference_of_table(table_name, table_configs) {
        const result = []
        const { foreign_keys } = table_configs
        if (!foreign_keys) {
            return result
        }
    
        foreign_keys.forEach(foreign_key => {
            const field_name = Object.keys(foreign_key).shift()
            const field_reference_config = foreign_key[field_name]
            const table_reference_to = field_reference_config["ref_table"]
            if (table_reference_to != table_name && !result.includes(table_reference_to)) {
                result.push(table_reference_to)
            }
        })
        return result
    }
}

module.exports = Database