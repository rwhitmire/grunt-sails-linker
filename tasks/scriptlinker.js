/*
 * grunt-scriptlinker
 * https://github.com/scott-laursen/grunt-scriptlinker
 *
 * Copyright (c) 2013 scott-laursen
 * Licensed under the MIT license.
 */

var linker = require('../lib/linker');

module.exports = function(grunt) {
  grunt.registerMultiTask('scriptlinker', 'Your task description goes here.', function() {

    var options = this.options({
      startTag: /<!--\s*SCRIPTS.*src.*-->/g,
      endTag: /(<!--\s*SCRIPTS END\s*-->)/g,
      fileTmpl: '<script src="%s"></script>',
      appRoot: '',
      relative: false
    });

    this.files.forEach(function(file){
      linker.injectScripts(file, grunt, options);
    });
    
  });
};
