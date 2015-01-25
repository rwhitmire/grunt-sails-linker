module.exports = {

    /**
     * gets a list of script blocks from html content
     * @param  {string} htmlContent html content
     * @return {array}  list of script block meta data
     */
    getBlockDefs: function(htmlContent) {
      var matches = htmlContent.match(/<!--\s*SCRIPTS\s*src.*-->/g);

      return matches.map(function(blockStart) {
        var src = /src="(.*)"/g.exec(blockStart)[1];
        return {blockStart: blockStart, src: src};
      });
    },


    /**
     * given a list of paths, formats a sting of scripts to include in html
     * @param  {array}  paths list of paths to include
     * @param  {number} padding number of spaces to add to the begining of the tag
     * @return {string} stringified script tags
     */
    getScriptTags: function(paths, padding) {
      padding = padding || 0;

      var paddingStr = this.getPaddingStr(padding);
      var scripts = '';

      paths.forEach(function(path) {
        var script = '\n' + paddingStr + '<script src="'+ path +'"></script>';
        scripts += script;
      });

      return scripts += '\n' + paddingStr;
    },

    /**
     * given a number of characters, returns a string of spaces with a length of chars
     * @param  {number} chars number of characters for string to have
     * @return {string} padded spaces
     */
    getPaddingStr: function(chars) {
      return new Array(chars + 1).join(' ');
    },


    /**
     * escape all special characters in a string in preparation for use in a regular expression
     * @param  {string} str string of characters to escape
     * @return {string} string of escaped characters ready to become a regex
     */
    escapeSpecialChars: function(str) {
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    },


    /**
     * injects script files into html
     * @param  {object} htmlFile file information from grunt
     */
    injectScripts: function (htmlFile, grunt) {
      var self = this;

      var htmlFileSrc = htmlFile.src[0];
      var htmlContent = grunt.file.read(htmlFileSrc);

      // now that we have the html content, we need to use regular expressions to
      // find all script blocks that will append scripts to the html file
      var blockDefs = self.getBlockDefs(htmlContent);

      // loop through blockDefs and inject scripts into html
      blockDefs.forEach(function(blockDef) {

        // todo: remove hard coded test/ string
        var scriptPaths = grunt.file.expand( 'test/' + blockDef.src);
        var blockStartExpression = self.escapeSpecialChars(blockDef.blockStart);

        var start = "(" + blockStartExpression + ")";
        var end = /(<!--\s*SCRIPTS END\s*-->)/g;

        var expression = new RegExp(start + /\s*/g.source + end.source);

        // todo: determine padding and add it here.
        var scriptTags = self.getScriptTags(scriptPaths, 2);
        htmlContent = htmlContent.replace(expression, "$1" + scriptTags + "$2");

      });

      grunt.file.write(htmlFileSrc, htmlContent);

    }

};
