const expect = require('chai').expect;
const strings = require('../utils/strings');

describe('utils', function() {
  describe('#strings', function() {
    describe('#stringTemplateReplace', function() {
      const replace = strings.stringTemplateReplace;

      it('should correctly call a function replacer', function() {
        let str = '${replace}';
        let fun = (key) => {
          expect(key).to.equal('replace');
          return 'this';
        };
        expect(replace(str, fun)).to.equal('this');
      });

      it('should correctly access a map replacer (string)', function() {
        let str = '${replace}';
        let map = {replace: 'this'};
        expect(replace(str, map)).to.equal('this');
      });

      it('should correctly access a map replacer (function)', function() {
        let str = '${replace}';
        let map = {replace: () => 'this'};
        expect(replace(str, map)).to.equal('this');
      });

      it('should not replace doubled $', function() {
        let str = '$${replace}';
        let map = {replace: () => 'this'};
        expect(replace(str, map)).to.equal('${replace}');
      });

      it('should replace half of tripled $', function() {
        let str = '$$${replace}';
        let map = {replace: () => 'this'};
        expect(replace(str, map)).to.equal('$this');
      });

      it('should not replace quadrupled $', function() {
        let str = '$$$${replace}';
        let map = {replace: () => 'this'};
        expect(replace(str, map)).to.equal('$${replace}');
      });

      it('should replace multiple occurrences', function() {
        let str = '${replace} ${replace} ${replace}';
        let fun = () => 'this';
        expect(replace(str, fun)).to.equal('this this this');
      });

      it('should replace different occurrences', function() {
        let str = '${replace1}, ${replace2} or ${replace3}';
        let fun = (key) => {
          if (key === 'replace1') return 'this';
          if (key === 'replace2') return 'that';
          if (key === 'replace3') return 'the other';
        };
        expect(replace(str, fun)).to.equal('this, that or the other');
      });
    });
  });
});
