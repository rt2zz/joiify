# joiify
Convert an idiomatic js/json object into a Joi schema

##Usage
```js
var Joiify = require('joiify')
var AccountSchema = Joiify({
  AccountID: 'string',
  lastLogin: 'date',
  //Any values that are already Joi objects will included verbatim
  role: Joi.any().valid(['user', 'manager', 'admin']),
  profile: {
    url: 'string',
    email: 'email',
    age: 'integer',
    //special rules for this object
    '*': {required: true, unknown: false, min: 1, max: 10}  
  })

AccountSchema.validate(data, function(err, data){
  //just a nornmal joi schema
})

//AccountSchema equivalent to:
Joi.object().keys({
  AccountID: Joi.string(),
  lastLogin: Joi.date(),
  role: Joi.any().valide(['user', 'manager', 'admin']),
  profile: Joi.object().requiredKeys(['url', 'email', 'age']).unknown(false).min(1).max(10).keys({
    url: Joi.string(),
    email: Joi.string().email(),
    age: Joi.number().integer(),
  })
})
```

##API
Joiify accepts one argument the "scheme" which should be one of the following:
### Joiify(scheme)
Convert the a joiify "scheme" into a Joi "schema" where `scheme`: one of the following
* `type`: See type values below
* `Object`: An object. Object keys will be recursively converted to Joi objects.
* `Array`: An array. Array children will be used to validate array elements.

###Type Conversion  

####strings types
* *string*: Joi.string()
* *email*: Joi.string().email()
* *hostname*: Joi.string().hostname()
* *alphanum*: Joi.string().alphanum()
* *hex*: Joi.string().hex()
* *token*: Joi.string().token()  

#### number types
* *number*: Joi.number()
* *integer*: Joi.number().integer()  

####other types
* *date*: Joi.date()
* *boolean*: Joi.boolean()
* *binary*: Joi.binary()
* *func*: Joi.func()
* *array*: Joi.array()
* *object*: Joi.object()
* *forbidden*: Joi.any().forbidden()  

####special (non strings)  
* Joi schema: uses the Joi schema verbatim
* `undefined`: Joi.any().foribdden()
* `null`: Joi.any().valid(null)
* `[]`: Joi.array() - will add children as valid elements, see `Joi.array().includes()`

####Objects
* `{}`: Joi.object() - will recursively convert children as well  
Objects types have a special `'*'` property that sets special handlers for the object validation:  
  * `'*'`: Object with the following possible keys
    * required: boolean, marks as required (or optional) all keys on the object
    * unknown: boolean, allows (or disallows) unknown keys on the object 
    * max: integer, sets the maximum number of keys on the object
    * min: integer, sets the minimum number of keys on the object
  
