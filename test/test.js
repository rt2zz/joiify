var tape = require('tape')
var Joiify = require('..')

tape('joiify', function (t) {
  t.plan(11);

  Joiify(null).validate(null, function(err){
    t.equal(err, null)
  })
  Joiify(null).validate(1, function(err){
    t.equal(err && err.name, 'ValidationError')
  })
  Joiify(undefined).validate(undefined, function(err){
    t.equal(err, null)
  })
  Joiify(undefined).validate(null, function(err){
    t.equal(err && err.name, 'ValidationError')
  })
  Joiify({'*': {unknown: true}}).validate({a:1}, function(err){
    t.equal(err, null)
  })
  Joiify({'*': {max: 0}}).validate({a:1}, function(err){
    t.equal(err && err.name, 'ValidationError')
  })
  Joiify({a: 'string', '*': {unknown: false}}).validate({b:1}, function(err){
    t.equal(err && err.name, 'ValidationError')
  })
  Joiify({a: 'any', '*': {required: false}}).validate({}, function(err){
    t.equal(err, null)
  })
  Joiify({a: 'any', '*': {required: true}}).validate({}, function(err){
    t.equal(err && err.name, 'ValidationError')
  })
  Joiify({a: ['string'], b: 'integer', c: {a: ['integer', 'string'], b: 'any'}}).validate({a: ['a'], b: 1, c: {a: [1, 's'], b: new Date()}}, function(err){
    t.equal(err, null)
  })
  Joiify({a: ['string'], b: 'integer', c: {a: ['integer', 'string'], b: 'any'}}).validate({a: ['a'], b: 1, c: {a: [1.1, 's'], b: new Date()}}, function(err){
    t.equal(err && err.name, 'ValidationError')
  })
});
