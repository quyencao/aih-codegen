const TABLE_NAME_SEPERATOR = "_"

class Model {
    constructor(name, configs) {
        this._name = name
        this._configs = configs
    }

    getModelData() {
        return this._getModelData(this._name, this._configs);
    }

    _getModelData(table_name, model_configs) {
        const { fields, primary_keys } = model_configs
        const obj_fields = this._getObjFields(fields, primary_keys)
        const model_name = this._getModelNameFromTableName(table_name)
        const result = {
            TableName: table_name,
            ModelName: model_name,
            Fields: JSON.stringify(obj_fields).replace(/"/g, '')
        }

        return result
    }

    _getModelNameFromTableName(table_name) {
        const splitedTableNames = table_name.split(TABLE_NAME_SEPERATOR)
        return splitedTableNames.map(word => this._capitalizeFirstLetter(word)).join()
    }

    _capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    _getObjFields(fields, primary_keys) {
        const result = {}
        fields.forEach(field => {
            const field_name = Object.keys(field).shift()
            const field_configs = field[field_name]
            const is_primary = primary_keys.includes(field_name)
            const obj_field = this._getObjField(field_name, field_configs, is_primary)
            Object.assign(result, obj_field)
        })

        return result
    }

    _getObjField(name, configs, is_primary) {
        const { type, not_null } = configs
        const sequelize_type = this._convertPGTypeToSequelizeType(type)
        const data = {
            [name]: {
                type: sequelize_type,
                allowNull: !not_null,
            }
        }

        if (is_primary) {
            data[name].primaryKey = true
            data[name].autoIncrement = true
        }

        return data
    }

    _convertPGTypeToSequelizeType(pg_type) {
        switch (pg_type) {
            case "serial":
                return "DataTypes.NUMBER"
            case "text":
                return "DataTypes.TEXT"
            case "int":
                return "DataTypes.INTEGER"
            case "bool":
                return "DataTypes.BOOLEAN"
            case "timestamp":
                return "DataTypes.TIME"
            default:
                break;
        }
    }
}


module.exports = Model