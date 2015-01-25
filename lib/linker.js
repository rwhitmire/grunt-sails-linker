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
     * @return {string} stringified script tags
     */
    getScriptTags: function(paths) {
      var scripts = '';

      paths.forEach(function(path) {
        var script = '\n<script src="'+ path +'"></script>';
        scripts += script;
      });

      scripts += '\n';

      return scripts;
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

        // todo: make sure we have all glob special characters escaped
        var blockStartExpression = blockDef.blockStart
          .replace(/\//g, '\\/')
          .replace(/\*/g, '\\*');

        var start = "(" + blockStartExpression + ")";
        var end = /(<!--\s*SCRIPTS END\s*-->)/g;

        var expression = new RegExp(start + /\s*/g.source + end.source);
        var scriptTags = self.getScriptTags(scriptPaths);
        htmlContent = htmlContent.replace(expression, "$1" + scriptTags + "$2");

      });

      grunt.file.write(htmlFileSrc, htmlContent);

    }

};
