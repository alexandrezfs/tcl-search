var config = require('./config');

exports.getLineIdFromTitanCode = function(titan_code) {

    var line_id = null;

    if(config.values.titan_id_matrix[titan_code] != null) {
        line_id = config.values.titan_id_matrix[titan_code];
    }
    else {
        line_id = titan_code.substr(0, titan_code.length -1);
    }

    return line_id;
};