// @flow
'use strict';

const md = require('./');
const React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');

function MyComponent() {
  return React.createElement('div', null, 'MyComponent');
}

test('example', () => {
  expect(renderToStaticMarkup(md`
    # Heading

    ${React.createElement(MyComponent)}
  `)).toMatchSnapshot();
});
