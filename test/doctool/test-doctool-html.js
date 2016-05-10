'use strict';

const common = require('../common');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const html = require('../../tools/doc/html.js');

// Test data is a list of objects with two properties.
// The file property is the file path.
// The html property is some html which will be generated by the doctool.
// This html will be stripped of all whitespace because we don't currently
// have an html parser.
const testData = [
  {
    file: path.join(common.fixturesDir, 'sample_document.md'),
    html: '<ol><li>fish</li><li><p>fish</p></li><li><p>Redfish</p></li>' +
      '<li>Bluefish</li></ol>'
  },
  {
    file: path.join(common.fixturesDir, 'order_of_end_tags_5873.md'),
    html: '<h3>ClassMethod: Buffer.from(array) <span> ' +
      '<a class="mark" href="#foo_class_method_buffer_from_array" ' +
      'id="foo_class_method_buffer_from_array">#</a> </span> </h3><div' +
      'class="signature"><ul><li><code>array</code><a ' +
      'href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/' +
      'Reference/Global_Objects/Array" class="type">&lt;Array&gt;</a></li>' +
      '</ul></div>'
  },
  {
    file: path.join(common.fixturesDir, 'doc_with_yaml.md'),
    html: '<h1>Sample Markdown with YAML info' +
      '<span><a class="mark" href="#foo_sample_markdown_with_yaml_info" ' +
      ' id="foo_sample_markdown_with_yaml_info">#</a></span></h1>' +
      '<h2>Foobar<span><a class="mark" href="#foo_foobar" ' +
      'id="foo_foobar">#</a></span></h2>' +
      '<div class="api_metadata"><span>Added in: v1.0.0</span></div> ' +
      '<p>Describe <code>Foobar</code> in more detail here.</p>' +
      '<h2>Foobar II<span><a class="mark" href="#foo_foobar_ii" ' +
      'id="foo_foobar_ii">#</a></span></h2>' +
      '<div class="api_metadata"><span>Added in: v5.3.0, v4.2.0</span></div> ' +
      '<p>Describe <code>Foobar II</code> in more detail here.</p>' +
      '<h2>Deprecated thingy<span><a class="mark" ' +
      'href="#foo_deprecated_thingy" id="foo_deprecated_thingy">#</a>' +
      '</span></h2>' +
      '<div class="api_metadata"><span>Added in: v1.0.0</span>' +
      '<span>Deprecated since: v2.0.0</span></div><p>Describe ' +
      '<code>Deprecated thingy</code> in more detail here.</p>' +
      '<h2>Something<span><a class="mark" href="#foo_something" ' +
      'id="foo_something">#</a></span></h2> ' +
      '<!-- This is not a metadata comment --> ' +
      '<p>Describe <code>Something</code> in more detail here. ' +
      '</p>'
  },
];

testData.forEach(function(item) {
  // Normalize expected data by stripping whitespace
  const expected = item.html.replace(/\s/g, '');

  fs.readFile(item.file, 'utf8', common.mustCall(function(err, input) {
    assert.ifError(err);
    html(
      {
        input: input,
        filename: 'foo',
        template: 'doc/template.html',
        nodeVersion: process.version,
      },

      common.mustCall(function(err, output) {
        assert.ifError(err);

        const actual = output.replace(/\s/g, '');
        // Assert that the input stripped of all whitespace contains the
        // expected list
        assert.notEqual(actual.indexOf(expected), -1);
      })
    );
  }));
});
