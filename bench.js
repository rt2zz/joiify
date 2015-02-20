var Joiify = require('./')
var Joi = require('joi')

var ben = require('ben')

//Joi
var ms = ben(100000, function () {
  Joi.object().keys({
    a: Joi.string(),
    b: Joi.any().valid(null),
    c: Joi.array().includes('string'),
    d: Joi.object().keys({
      e: Joi.number().integer(),
      f: Joi.string().email()
    }).unknown(false).requiredKeys(['e', 'f'])
  })
});

console.log('Joi: %s ms/op', ms)

//Joiify
var jms = ben(100000, function () {
  Joiify({
    a: 'string',
    b: null,
    c: ['string'],
    d: {
      e: 'integer',
      f: 'email',
      '*': {required: true, uknown: false}
    }
  })
});

console.log('Joiify: %s ms/op', jms)

console.log('Translation cost: %s ms/op', jms-ms)
//@TODO why is Joiify faster? must be missing something...
