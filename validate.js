var joi = require('joi');

var schema = joi.object().keys({
  version: joi.string(),
  host: joi.string().optional(),
  port: joi.string().optional(),
  servers: joi.object().keys().required()
});

module.exports = function(config, utils) {
  var details = [];

  var validationErrors = joi.validate(config.chromadb, schema, utils.VALIDATE_OPTIONS);
  details = utils.combineErrorDetails(details, validationErrors);
  details = utils.combineErrorDetails(
    details,
    utils.serversExist(config.servers, config.chromadb.servers)
  );

  return utils.addLocation(details, 'chromadb');
};
