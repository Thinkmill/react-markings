// @flow
'use strict';

var React = require('react');
var Parser = require('commonmark').Parser;
var Renderer = require('commonmark-react-renderer');

var PLACEHOLDER = 'super-secret-react-markings-placeholder-if-you-are-seeing-this-then-there-is-a-bug-in-react-markings';

// Source: https://github.com/sindresorhus/strip-indent
function stripIndent(str) {
  var match = str.match(/^[ \t]*(?=\S)/gm);
  if (!match) {
    return str;
  }

  var indent = Math.min.apply(Math, match.map(function (x) {
    return x.length;
  }));

  if (indent === 0) {
    return str;
  }

  var re = new RegExp('^[ \\t]{' + indent + '}', 'gm');
  return str.replace(re, '');
}

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

type Options = {
  renderers?: {
    [key: string]: (props: Object) => ReactNode
  }
};

type Exported<T, C> = T & { customize: C };
*/

function customize(opts /*: Options */) {
  var renderers = opts.renderers || {};

  return function markings(strings /*: Array<string> */ /*::, ...values: Array<ReactNode> */) {
    var values = Array.prototype.slice.call(arguments, 1);
    var input = stripIndent(strings.join(PLACEHOLDER));
    var parser = new Parser();
    var ast = parser.parse(input);

    if (!validate(ast)) {
      throw new Error('react-markings cannot interpolate React elements non-block positions');
    }

    var index = 0;
    var renderer = new Renderer({
      renderers: Object.assign({}, renderers, {
        Paragraph: function(props) {
          if (props.children.length === 1 && props.children[0] === PLACEHOLDER) {
            var value = values[index];
            index = index + 1 < values.length ? index + 1 : 0;
            return value;
          } else if (renderers.Paragraph) {
            return renderers.Paragraph(props);
          } else if (renderers.paragraph) {
            return renderers.paragraph(props);
          } else {
            return React.createElement('p', {}, props.children);
          }
        },
      })
    });

    return React.createElement('div', {}, renderer.render(ast));
  }
}

var md = customize({});
md.customize = customize;
md = (md /*: Exported<typeof md, typeof customize> */);
module.exports = md;
