// @flow
'use strict';

var React = require('react');
var Parser = require('commonmark').Parser;
var Renderer = require('commonmark-react-renderer');
var stripIndent = require('strip-indent');

var PLACEHOLDER = 'REACT-MARKINGS-PLACEHOLDER';

/*::
declare type ReactNode =
  | void
  | null
  | boolean
  | number
  | string
  | React.Element<any>
  | Iterable<ReactNode>;
*/

function markings(strings /*: Array<string> */, ...values /*: Array<ReactNode> */) {
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

  return React.createElement('div', {}, result);
}

module.exports = markings;
