var Joi = require('joi')

module.exports = toJoi

function toJoi(config){
  var schema = null
  if(config && typeof config === 'object'){

    if (config.isJoi) {
      return config
    }

    if (Array.isArray(config)) {
      var arrayTypes = config.map(function(el){
        return toJoi(el)
      })
      if(config.length === 0) arrayTypes = Joi.any()
      return Joi.array().includes(arrayTypes)
    }

    if (config instanceof RegExp) {
      return Joi.string().regex(config)
    }

    //else recursively convert config object
    var flags = config['*'] || {}
    delete config['*']

    var keys = Object.getOwnPropertyNames(config)
    var schemaKeys = {}
    keys.forEach(function(key){
      schemaKeys[key] = toJoi(config[key])
    })
    if(keys.length === 0) schemaKeys = null

    var sub = Joi.object().keys(schemaKeys)
    if(flags.required === true) sub = sub.requiredKeys(keys)
    if(flags.unknown === true) sub = sub.unknown(flags.unknown)
    if(typeof flags.max !== 'undefined') sub = sub.max(flags.max)
    if(typeof flags.min !== 'undefined') sub = sub.min(flags.min)
    return sub
  }

  //string conversion
  if(config && typeof config === 'string'){
    //string types
    if(config === 'string') return Joi.string()
    if(config === 'email') return Joi.string().email()
    if(config === 'hostname') return Joi.string().hostname()
    if(config === 'alphanum') return Joi.string().alphanum()
    if(config === 'hex') return Joi.string().hex()
    if(config === 'token') return Joi.string().token()

    //number types
    if(config === 'number') return Joi.number()
    if(config === 'integer') return Joi.number().integer()

    //any
    if(config === '*' || config === 'any') return Joi.any()
    if(config === 'forbidden') return Joi.any().forbidden()

    //other
    if(config === 'date') return Joi.date()
    if(config === 'boolean') return Joi.boolean()
    if(config === 'binary') return Joi.binary()
    if(config === 'func') return Joi.func()
    if(config === 'array') return Joi.array()
    if(config === 'object') return Joi.object()
  }
  else if(config === null){
    return Joi.any().valid(null)
  }
  else if(config === undefined){
    return Joi.any().forbidden()
  }
}
