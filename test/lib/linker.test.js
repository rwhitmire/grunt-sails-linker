var linker = require('../../lib/linker');
var assert = require('assert');

describe("linker", function() {

  describe("escapeSpecialChars", function() {
    it("should escape special characters", function() {
      var result = linker.escapeSpecialChars("/.**-");
      assert.equal(result, '\\/\\.\\*\\*\\-');
    });
  });

  describe("getScriptTags", function() {
    it("should return script tag for a single script", function() {
      var result = linker.getScriptTags(['foo/bar.js']);
      assert.equal(result, '\n<script src="foo/bar.js"></script>\n');
    });

    it("should apply proper padding to script tags", function() {
      var result = linker.getScriptTags(['foo/bar.js'], '  ');
      assert.equal(result, '\n  <script src="foo/bar.js"></script>\n  ');
    });
  });

  describe('getPaddingChars', function () {
    it('should handle spaces', function () {
      var html = '\n  <!--SCRIPTS src="foo/bar.js"-->';
      var result = linker.getPaddingChars(html);
      assert.equal(result, '  ');
    });

    it('should handle tabs', function () {
      var html = '\n\t\t<!--SCRIPTS src="foo/bar.js"-->';
      var result = linker.getPaddingChars(html);
      assert.equal(result, '\t\t');
    });

    it('should handle cr', function () {
      var html = '\r  <!--SCRIPTS src="foo/bar.js"-->';
      var result = linker.getPaddingChars(html);
      assert.equal(result, '  ');
    });

    it('should handle crlf', function () {
      var html = '\n \r\n  <!--SCRIPTS src="foo/bar.js"-->';
      var result = linker.getPaddingChars(html);
      assert.equal(result, '  ');
    });
  });


});