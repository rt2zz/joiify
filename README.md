# joiify
Convert an idiomatic js/json object into a Joi schema.

This makes it easier to read and write Joi schemas, especially if written inline, e.g.
`{a: 'string', b: ['number']}`

**Note:** Joiify does not cache the schema result, for optimal performance you should Joiify your scheme before validation time as you would with any Joi schema.

**Note2:** Joiify will treat Joi objects as pass through so you can safely mix and match Joiify schemes with Joi schemas and do not have to worry about loss of functionality.  E.G. Joiify(Joi.string()) compiles to Joi.string()

## Usage
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

## API
Joiify accepts one argument the "scheme" which should be one of the following:
### Joiify(scheme)
Convert the a joiify "scheme" into a Joi "schema" where `scheme`: one of the following
* `type`: See type values below
* `Object`: An object. Object keys will be recursively converted to Joi objects.
* `Array`: An array. Array children will be used to validate array elements.

### Type Conversion  

#### strings types
* `"string"`: Joi.string()
* `"email"`: Joi.string().email()
* `"hostname"`: Joi.string().hostname()
* `"alphanum"`: Joi.string().alphanum()
* `"hex"`: Joi.string().hex()
* `"token"`: Joi.string().token()  

#### number types
* `"number"`: Joi.number()
* `"integer"`: Joi.number().integer()  

#### other types
* `"date"`: Joi.date()
* `"boolean"`: Joi.boolean()
* `"binary"`: Joi.binary()
* `"func"`: Joi.func()
* `"array"`: Joi.array()
* `"object"`: Joi.object()
* `"forbidden"`: Joi.any().forbidden()  

#### special (non strings)  
* `undefined`: Joi.any().foribdden()
* `null`: Joi.any().valid(null)
* `[]`: Joi.array()
  * Array elements are added as valid types see `Joi.array().includes()`

####Objects
* *Joi Schema Object*: will return the Joi schema verbatim.
* `{}`: Joi.object()
  * Children will be recursively converted using the same rules above
  * `'*'` if set specifies special handlers for the object validation as follows  
    * `required: boolean`, marks as required (true) or optional (false) all keys on the object
    * `unknown: boolean`, allows (true) or disallows (false) unknown keys on the object
    * `max: integer`, sets the maximum number of keys on the object
    * `min: integer`, sets the minimum number of keys on the object
