var util = require('util');

module.exports = {

    /**
     * gets a list of script blocks from html content
     * @param  {string} htmlContent html content
     * @return {array}  list of script block meta data
     */
    getBlockDefs: function(htmlContent) {
      var matches = htmlContent.match(this.options.startTag);

      return matches.map(function(blockStart) {
        var src = /src="(.*)"/g.exec(blockStart)[1];
        return {blockStart: blockStart, src: src};
      });
    },


    /**
     * given a list of paths, formats a sting of scripts to include in html
     * @param  {array}  paths list of paths to include
     * @param  {string} padding characters to add to the begining of the tag
     * @return {string} stringified script tags
     */
    getScriptTags: function(paths, paddingChars) {
      paddingChars = paddingChars || '';

      var options = this.options;
      var scripts = '';

      paths.forEach(function(path) {
        var tag = util.format(options.fileTmpl, path);
        var script = '\n' + paddingChars + tag;
        scripts += script;
      });

      return scripts += '\n' + paddingChars;
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
     * looks for spaces or tabs preceeding a script block and returns them
     * @param  {string} htmlContent html to parse
     * @return {string} whitespace characters to be used as padding on injected scripts
     */
    getPaddingChars: function(htmlContent) {
      var expression = new RegExp(/( *|\t*)/g.source + this.options.startTag.source);
      var result = expression.exec(htmlContent);

      return result[1];
    },


    /**
     * injects script files into html
     * @param  {object} htmlFile file information from grunt
     * @param  {object} grunt instance of grunt passed from grunt task
     */
    injectScripts: function (htmlFile, grunt, options) {
      this.options = options;

      var self = this;
      var htmlFileSrc = htmlFile.src[0];
      var htmlContent = grunt.file.read(htmlFileSrc);
      var paddingChars = self.getPaddingChars(htmlContent);

      // now that we have the html content, we need to use regular expressions to
      // find all script blocks that will append scripts to the html file
      var blockDefs = self.getBlockDefs(htmlContent);

      // loop through blockDefs and inject scripts into html
      blockDefs.forEach(function(blockDef) {
        // todo: remove hard coded test/ string
        var scriptPaths = grunt.file.expand( 'test/' + blockDef.src);
        var blockStartExpression = self.escapeSpecialChars(blockDef.blockStart);
        var start = "(" + blockStartExpression + ")";
        var end = options.endTag;
        var expression = new RegExp(start + /\s*/g.source + end.source);
        var scriptTags = self.getScriptTags(scriptPaths, paddingChars);

        htmlContent = htmlContent.replace(expression, "$1" + scriptTags + "$2");
      });

      grunt.file.write(htmlFileSrc, htmlContent);

    }

};
