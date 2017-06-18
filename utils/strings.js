module.exports = (function() {
  const templateRegex = /[$]+[{][a-zA-Z][0-9a-zA-Z_]*[}]/g;
  function stringTemplateReplace(str, replacer) {
    if (!str) return '';

    return str.replace(templateRegex, (captured) => {
      let numSigns = 0;
      for (let i=numSigns; i < captured.length; numSigns+=+('$'===captured[i++]));

      if (numSigns % 2 == 0) {
        return ('$'.repeat(numSigns/2)) + captured.substring(numSigns);
      } else {
        let rep = '';

        let key = captured.substring(captured.lastIndexOf('{') + 1, captured.length - 1);
        if (typeof replacer === 'function') {
          rep = replacer(key);
        } else if (typeof replacer === 'object') {
          if (typeof replacer[key] === 'function') {
            rep = replacer[key]();
          } else {
            rep = replacer[key];
          }
        }

        return '$'.repeat(numSigns/2) + rep;
      }
    });
  }

  return {
    stringTemplateReplace: stringTemplateReplace
  };
})();
