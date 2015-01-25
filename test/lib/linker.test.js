var linker = require('../../lib/linker');
var assert = require('assert');

describe("linker", function() {

  describe("escapeSpecialChars", function() {
    it("should escape special characters", function() {
      var result = linker.escapeSpecialChars("/.**-");
      assert.equal(result, '\\/\\.\\*\\*\\-');
    });
  });

  describe("getPaddingStr", function() {
    it("should return padded string", function() {
      var result = linker.getPaddingStr(5);
      assert.equal(result, '     ');
    });
  });

  describe("getScriptTags", function() {
    it("should return script tag for a single script", function() {
      var result = linker.getScriptTags(['foo/bar.js']);
      assert.equal(result, '\n<script src="foo/bar.js"></script>\n');
    });

    it("should apply proper padding to script tags", function() {
      var result = linker.getScriptTags(['foo/bar.js'], 2);
      assert.equal(result, '\n  <script src="foo/bar.js"></script>\n  ');
    });
  });


});