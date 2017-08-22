// @flow
'use strict';

var React = require('react');
var Parser = require('commonmark').Parser;
var Renderer = require('commonmark-react-renderer');
var stripIndent = require('strip-indent');

var PLACEHOLDER = 'REACT-MARKINGS-PLACEHOLDER';

/*
type Value =
  | null
  | void
  | string
  | number
  | React.Element<any>
*/

function markings(strings /*: Array<string> */, ...values /*: Array<Value> */) {
  var input = stripIndent(strings.join(PLACEHOLDER));
  var parser = new Parser();
  var ast = parser.parse(input);

  var renderer = new Renderer({
    renderers: {
      Paragraph: function(props) {
        if (props.children.length === 1 && props.children[0] === PLACEHOLDER) {
          return values.shift();
        } else {
          return React.createElement('p', props);
        }
      },
    },
  });

  var result = renderer.render(ast);

  return React.createElement('div', null, result);
}

module.exports = markings;
