/*
 * grunt-scriptlinker
 * https://github.com/scott-laursen/grunt-scriptlinker
 *
 * Copyright (c) 2013 scott-laursen
 * Licensed under the MIT license.
 */

'use strict';

var util = require('util');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('scriptlinker', 'Your task description goes here.', function() {

    // // Merge task-specific and/or target-specific options with these defaults.
    // var options = this.options({
    //   startTag: '<!--SCRIPTS-->',
    //   endTag: '<!--SCRIPTS END-->',
    //   fileTmpl: '<script src="%s"></script>',
    //   appRoot: ''
    // });


    // // Iterate over all specified file groups.
    // this.files.forEach(function (f) {
    //   var scripts = '',
    //     page = '',
    //     newPage = '',
    //     start = -1,
    //     end = -1;

    //   // Create string tags
    //   scripts = f.src.filter(function (filepath) {

    //       // Warn on and remove invalid source files (if nonull was set).
    //       if (!grunt.file.exists(filepath)) {
    //         grunt.log.warn('Source file "' + filepath + '" not found.');
    //         return false;
    //       } else { return true; }
    //     }).map(function (filepath) {
    //       return util.format(options.fileTmpl, filepath.replace(options.appRoot, ''));
    //     });

    //   grunt.file.expand({}, f.dest).forEach(function(dest){
    //     page = grunt.file.read(dest);
    //     start = page.indexOf(options.startTag);

    //     end = page.indexOf(options.endTag);
    //     if (start === -1 || end === -1 || start >= end) {
    //       return;
    //     } else {
    //       var padding ='';
    //       var ind = start - 1;
    //       // TODO: Fix this hack
    //       while(page.charAt(ind)===' ' || page.charAt(ind)==='  ' || page.charAt(ind)==='\t'){
    //         padding += page.charAt(ind);
    //         ind -= 1;
    //       }
    //       console.log('padding length', padding.length);
    //       newPage = page.substr(0, start + options.startTag.length)+'\n' + padding + scripts.join('\n'+padding) + '\n' + padding + page.substr(end);
    //       // Insert the scripts
    //       grunt.file.write(dest, newPage);
    //       grunt.log.writeln('File "' + dest + '" updated.');
    //     }
    //   });
    // });


    /**
     * gets a list of script blocks from html content
     * @param  {string} htmlContent html content
     * @return {array}  list of script block meta data
     */
    function getBlockDefs(htmlContent) {
      var matches = htmlContent.match(/<!--\s*SCRIPTS\s*src.*-->/g);

      return matches.map(function(blockStart) {
        var src = /src="(.*)"/g.exec(blockStart)[1];
        return {blockStart: blockStart, src: src};
      });
    }

    /**
     * given a list of paths, formats a sting of scripts to include in html
     * @param  {array}  paths list of paths to include
     * @return {string} stringified script tags
     */
    function getScriptTags(paths) {
      var scripts = '';

      paths.forEach(function(path) {
        var script = '\n<script src="'+ path +'"></script>';
        scripts += script;
      });

      scripts += '\n';

      return scripts;
    }


    /**
     * processes content of a single html file
     * @param  {object} htmlFile file information from grunt
     */
    function handleHtmlFile(htmlFile) {
      var htmlFileSrc = htmlFile.src[0];
      var htmlContent = grunt.file.read(htmlFileSrc);

      // now that we have the html content, we need to use regular expressions to
      // find all script blocks that will append scripts to the html file
      var blockDefs = getBlockDefs(htmlContent);

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
        var scriptTags = getScriptTags(scriptPaths);
        htmlContent = htmlContent.replace(expression, "$1" + scriptTags + "$2");

      });

      grunt.file.write(htmlFileSrc, htmlContent);

    }

    this.files.forEach(handleHtmlFile);

  });

};
