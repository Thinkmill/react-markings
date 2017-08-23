// @flow
'use strict';

var React = require('react');
var Parser = require('commonmark').Parser;
var Renderer = require('commonmark-react-renderer');
var stripIndent = require('strip-indent');

var PLACEHOLDER = 'super-secret-react-markings-placeholder-if-you-are-seeing-this-then-there-is-a-bug-in-react-markings';

function validate(node) {
  var isValid = true;
  var walker = node.walker();
  var event;

  while ((event = walker.next())) {
    var node = event.node;

    if (!event.entering || !node.literal) {
      continue;
    }

    if (node.literal.indexOf(PLACEHOLDER) === -1) {
      continue;
    }

    if (
      node.type === 'text' &&
      node.parent.type === 'paragraph' &&
      node.literal === PLACEHOLDER
    ) {
      continue;
    }

    isValid = false;
    break;
  }

  return isValid;
}

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

  if (!validate(ast)) {
    throw new Error('react-markings cannot interpolate React elements non-block positions');
  }

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

  return React.createElement('div', {}, renderer.render(ast));
}

module.exports = markings;
