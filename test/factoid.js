/* eslint-env mocha */

let expect = require('chai').expect;
let factoids = require('../db/factoids')();

describe('factoids', function() {
  describe('#stripFactoid', function() {
    it('should convert a string to lowercase', function() {
      expect(factoids.stripFactoid('EnTrOpY')).to.equal('entropy');
    });

    it('should strip end of string punctuation', function() {
      expect(factoids.stripFactoid('that is correct!'))
        .to.equal('that is correct');

      expect(factoids.stripFactoid('hi.'))
        .to.equal('hi');

      expect(factoids.stripFactoid('is anyone there?'))
        .to.equal('is anyone there');
    });

    it('should strip mid-sentence punctuation', function() {
      expect(factoids.stripFactoid('correct, horse. battery! staple'))
        .to.equal('correct horse battery staple');

      expect(factoids.stripFactoid('what? how? i don\'t even know anymore'))
        .to.equal('what how i don\'t even know anymore');
    });

    it('should leave mid-word symbols', function() {
      expect(factoids.stripFactoid('loading murder.exe into !mem please wait'))
        .to.equal('loading murder.exe into !mem please wait');
    });
  });

  describe('#getResponse', function() {
    it('should get a factoid response when given a trigger');
  });
});
